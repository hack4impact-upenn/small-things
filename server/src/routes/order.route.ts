/**
 * Specifies the middleware and controller functions to call for each route
 * relating to authentication.
 */
import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import { isAdmin } from '../controllers/admin.middleware';
import { isAdminOrInOrg } from '../controllers/order.middleware';
import {
  createOrder,
  fetchAllOrders,
  fetchOrdersByOrganization,
  fetchOrderById,
  updateOrder,
} from '../controllers/order.controller';

const router = express.Router();

/**
 * A POST request to create a new order.
 */
router.post('/create', isAuthenticated, createOrder);

/**
 * A GET request to fetch all orders for an admin.
 */
router.get('/all', isAuthenticated, isAdmin, fetchAllOrders);

/**
 * A GET request to fetch all orders for an organization.
 */
router.get('/:org/all', isAdminOrInOrg, fetchOrdersByOrganization);

/**
 * A GET request to a specific order by id.
 */
router.get('/:id', isAdminOrInOrg, fetchOrderById);

/**
 * A PUT request to update a new order by id.
 */
router.put('/:id', isAdminOrInOrg, updateOrder);

export default router;
