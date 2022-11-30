/**
 * All the middleware functions related to orders
 */
import express from 'express';
import ApiError from '../util/apiError';
import { IUser } from '../models/user.model';

/**
 * Middleware to check if a user is an admin or part of an organization
 * using Passport Strategy and creates an
 * {@link ApiError} to pass on to error handlers if not
 */
const isAdminOrInOrg = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Get User
  const user: IUser | null = req.user as IUser;
  const { org } = req.params;
  // Check is user exists and is valid
  if (!user) {
    next(ApiError.unauthorized('Not a valid user.')); // TODO: see if this is the correct message
    return;
  }
  // Check if the user is an admin
  if (user.admin || user.organization === org) {
    next();
  } else if (user.organization !== org) {
    next(ApiError.unauthorized('Need to be part of organization.'));
  } else {
    next(ApiError.unauthorized('Need admin status.'));
  }
};

// eslint-disable-next-line import/prefer-default-export
export { isAdminOrInOrg };
