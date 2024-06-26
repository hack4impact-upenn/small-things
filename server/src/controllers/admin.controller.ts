/**
 * All the controller functions containing the logic for routes relating to
 * admin users such as getting all users, deleting users and upgrading users.
 */
import express from 'express';
import crypto from 'crypto';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IUser } from '../models/user.model';
import {
  upgradeUserToAdmin,
  downgradeUserToAdmin,
  getUserByEmail,
  getAllUsersFromDB,
  deleteUserById,
  getUserById,
  updateUserById,
  updateSettingsInDB,
  getSettingsFromDB,
} from '../services/user.service';
import {
  createInvite,
  getInviteByEmail,
  getInviteByToken,
} from '../services/invite.service';
import { emailInviteLink } from '../services/mail.service';
import { IInvite } from '../models/invite.model';

/**
 * Get all users from the database. Upon success, send the a list of all users in the res body with 200 OK status code.
 */
const getAllUsers = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    getAllUsersFromDB()
      .then((userList) => {
        res.status(StatusCode.OK).send(userList);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve all users'));
      })
  );
};

/**
 * Upgrade a user to an admin. The email of the user is expected to be in the request body.
 * Upon success, return 200 OK status code.
 */
const upgradePrivilege = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { email } = req.body;
  if (!email) {
    next(ApiError.missingFields(['email']));
    return;
  }

  const user: IUser | null = await getUserByEmail(email);
  if (!user) {
    next(ApiError.notFound(`User with email ${email} does not exist`));
    return;
  }
  if (user.admin) {
    next(ApiError.badRequest(`User is already an admin`));
    return;
  }

  upgradeUserToAdmin(user._id)
    .then(() => {
      res.sendStatus(StatusCode.OK);
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Unable to upgrade user to admin.'));
    });
};

const downgradePrivilege = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { email } = req.body;
  if (!email) {
    next(ApiError.missingFields(['email']));
    return;
  }

  const user: IUser | null = await getUserByEmail(email);
  if (!user) {
    next(ApiError.notFound(`User with email ${email} does not exist`));
    return;
  }
  if (!user.admin) {
    next(ApiError.badRequest(`User is not an admin`));
    return;
  }

  downgradeUserToAdmin(user._id)
    .then(() => {
      res.sendStatus(StatusCode.OK);
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Unable to downgrade user to admin.'));
    });
};

/**
 * Delete a user from the database. The email of the user is expected to be in the request parameter (url). Send a 200 OK status code on success.
 */
const deleteUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { email } = req.params;
  if (!email) {
    next(ApiError.missingFields(['email']));
    return;
  }

  // Check if user to delete is an admin
  const user: IUser | null = await getUserByEmail(email);
  if (!user) {
    next(ApiError.notFound(`User with email ${email} does not exist`));
    return;
  }

  const reqUser: IUser | undefined = req.user as IUser;
  if (reqUser.email === user.email) {
    next(ApiError.badRequest('Cannot delete self.'));
    return;
  }
  if (user.admin) {
    next(ApiError.forbidden('Cannot delete an admin.'));
    return;
  }

  deleteUserById(user._id)
    .then(() => res.sendStatus(StatusCode.OK))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Failed to delete user.'));
    });
};

const updateSettings = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const settings = req.body;
  if (!settings) {
    next(ApiError.missingFields(['settings']));
  }

  updateSettingsInDB(settings)
    .then(() => {
      res.sendStatus(StatusCode.OK);
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      console.log(e);
      next(ApiError.internal('Unable to update settings'));
    });
};

const inviteUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { email } = req.body;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
  if (!email.match(emailRegex)) {
    next(ApiError.badRequest('Invalid email'));
  }
  const lowercaseEmail = email.toLowerCase();
  const existingUser: IUser | null = await getUserByEmail(lowercaseEmail);
  if (existingUser) {
    next(
      ApiError.badRequest(
        `An account with email ${lowercaseEmail} already exists.`,
      ),
    );
    return;
  }

  const existingInvite: IInvite | null = await getInviteByEmail(lowercaseEmail);

  if (existingInvite) {
    next(
      ApiError.badRequest(
        `An invite for email ${lowercaseEmail} already exists.`,
      ),
    );
    return;
  }

  try {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await createInvite(lowercaseEmail, verificationToken);
    await emailInviteLink(lowercaseEmail, verificationToken);
    res.sendStatus(StatusCode.CREATED);
  } catch (err) {
    next(ApiError.internal('Unable to invite user.'));
  }
};

const verifyToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { token } = req.params;
  getInviteByToken(token)
    .then((invite) => {
      if (invite) {
        res.status(StatusCode.OK).send(invite);
      } else {
        next(ApiError.notFound('Unable to retrieve invite'));
      }
    })
    .catch(() => {
      next(ApiError.internal('Error retrieving invite'));
    });
};

/**
 * Get status of a user. Upon success, send the value of enabled in the res body with 200 OK status code.
 */
const getUserStatus = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }

  const user: IUser | null = await getUserById(id);
  if (!user) {
    next(ApiError.notFound(`User with id ${id} does not exist`));
    return;
  }

  if (user != null) {
    res.send(user.enabled);
  } else {
    ApiError.internal('Unable to get user status.');
  }
};

/**
 * Update status of a user. Upon success, send the user in the res body with 200 OK status code.
 */
const updateUserStatus = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { email } = req.body;
  const { status } = req.body;
  if (!email) {
    next(ApiError.missingFields(['email']));
    return;
  }

  const user: IUser | null = await getUserByEmail(email);
  if (!user) {
    next(ApiError.notFound(`User with email ${email} does not exist`));
    return;
  }

  updateUserById(user._id, !status)
    .then(() => {
      res.sendStatus(StatusCode.OK);
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Unable to update user status.'));
    });
};

/**
 * Get current settings. Upon success, send the settings in the res body with 200 OK status code.
 */
const getSettings = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return (
    getSettingsFromDB()
      .then((settings) => {
        res.status(StatusCode.OK).send(settings);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        next(ApiError.internal('Unable to retrieve settings'));
      })
  );
};

export {
  getAllUsers,
  upgradePrivilege,
  downgradePrivilege,
  deleteUser,
  updateSettings,
  inviteUser,
  verifyToken,
  updateUserStatus,
  getUserStatus,
  getSettings,
};
