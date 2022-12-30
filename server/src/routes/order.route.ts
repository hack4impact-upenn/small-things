/**
 * Specifies the middleware and controller functions to call for each route
 * relating to authentication.
 */
import express from 'express';
import cron from 'node-cron';
import { isAuthenticated } from '../controllers/auth.middleware';
import { isAdmin } from '../controllers/admin.middleware';
import { isAdminOrInOrg } from '../controllers/order.middleware';
import {
  createOrder,
  fetchAllOrders,
  fetchOrdersByOrganization,
  fetchOrderById,
  updateOrder,
  fetchUsedTimes,
} from '../controllers/order.controller';
import { Order } from '../models/order.model';

const router = express.Router();

// update each order status at midnight EST daily
cron.schedule(
  '0 0 0 * * *',
  () => {
    Order.find().then((orders) => {
      for (let i = 0; i < orders.length; i += 1) {
        const order = orders[i];
        if (order.pickup.getDate() - Date.now() < 0) {
          // marks orders with past pickups as completed
          order.status = 'COMPLETED';
        } else if (order.pickup.getDate() - Date.now() < 3) {
          // marks orders to be picked up in three days as released
          order.status = 'RELEASED';
        }

        order.save();
      }
    });
  },
  {
    scheduled: true,
    timezone: 'America/New_York',
  },
);

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
router.get('/:id', isAuthenticated, fetchOrderById);

/**
 * A PUT request to update a new order by id.
 */
router.put('/:id', isAdminOrInOrg, updateOrder);

/**
 * A GET request to get avalible times to schedule an order.
 */
router.get('/settings/times', fetchUsedTimes);

export default router;
