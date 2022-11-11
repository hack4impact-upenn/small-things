/**
 * Specifies the middleware and controller functions to call for each route
 * relating to authentication.
 */
import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import { createOrder } from '../controllers/order.controller';

const router = express.Router();

/**
 * A POST request to create a new order.
 */
router.post('/create', isAuthenticated, createOrder);

export default router;
