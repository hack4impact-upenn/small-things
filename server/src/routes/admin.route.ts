/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';
import {
  getAllUsers,
  upgradePrivilege,
  deleteUser,
  getUserStatus,
  updateUserStatus,
  inviteUser,
  verifyToken,
} from '../controllers/admin.controller';
import { isAuthenticated } from '../controllers/auth.middleware';
import { approve } from '../controllers/auth.controller';
import 'dotenv/config';

const router = express.Router();

/**
 * A GET route to get all users. Checks first if the requestor is a
 * authenticated and is an admin.
 */
router.get('/all', isAuthenticated, isAdmin, getAllUsers);

/**
 * A GET route to check if the requestor is an admin. Checks first if the
 * requestor is a authenticated. Throws an error if the requestor is not an admin.
 */
router.get('/adminstatus', isAuthenticated, isAdmin, approve);

/**
 * A PUT route to upgrade a user's privilege. Checks first if the requestor
 * is a authenticated and is an admin.
 * Expects a JSON body with the following fields:
 * - email (string) - The email of the user to be promoted
 */
router.put('/promote', isAuthenticated, isAdmin, upgradePrivilege);

router.get('/invite/:token', verifyToken);

/**
 * A POST route to invite a new user
 * Expects a JSON body with the following fields:
 * - email (string) - The email to invite the user from
 */
router.post('/invite', isAuthenticated, isAdmin, inviteUser);

/**
 * A PUT route to upgrade a user's privilege
 * Expects a JSON body with the following fields:
 * - email (string) - The email of the user to be promoted
 */
// delete during deployment
router.put('/autopromote', upgradePrivilege);

/**
 * A PUT route to delete a user. Checks first if the requestor
 * is a authenticated and is an admin.
 * Expects the following fields in the URL:
 * email (string) - The email of the user to be deleted
 */
router.delete('/:email', isAuthenticated, isAdmin, deleteUser);

/**
 * A GET route to get status of user by id. Checks first if the requestor is a
 * authenticated and is an admin.
 * Expects the following fields in the URL:
 * _id (string) - The id of the user to be updated
 */
router.get('/status/:id', isAuthenticated, isAdmin, getUserStatus);

/**
 * A POST route to update the enabled field
 * Expects a JSON body with the following fields:
 * - email (string) - The email of the user to be updated
 * - status (boolean) - The new value of enable
 */
router.post('/updatestatus', isAuthenticated, isAdmin, updateUserStatus);

export default router;
