/**
 * All the controller functions containing the logic for routes relating to
 * admin users such as getting all users, deleting users and upgrading users.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IUser } from '../models/user.model';
import {
  upgradeUserToAdmin,
  getUserByEmail,
  getAllUsersFromDB,
  deleteUserById,
  getUserById,
  updateUserById,
} from '../services/user.service';

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
  if (!email) {
    next(ApiError.missingFields(['email']));
    return;
  }

  const user: IUser | null = await getUserByEmail(email);
  if (!user) {
    next(ApiError.notFound(`User with email ${email} does not exist`));
    return;
  }

  updateUserById(user._id, false)
    .then(() => {
      res.sendStatus(StatusCode.OK);
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Unable to update user status.'));
    });
};

export {
  getAllUsers,
  upgradePrivilege,
  deleteUser,
  getUserStatus,
  updateUserStatus,
};
