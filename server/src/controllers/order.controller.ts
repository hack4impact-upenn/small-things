/**
 * All the middleware functions related to authentication
 */
import express from 'express';
import ApiError from '../util/apiError';
import { IOrder } from '../models/order.model';
import StatusCode from '../util/statusCode';
import { IUser } from '../models/user.model';
import {
  createNewOrder,
  getOrderByTimeSlot,
  getAllOrders,
  getAllOrdersForOrganization,
  getOrderById,
  updateOrderById,
  getAllCompletedOrders,
} from '../services/order.service';
import { getUserByOrganization } from '../services/user.service';

/**
 * Create a new order in the database
 * and creates an {@link ApiError} to pass on to error handlers if not
 */
const createOrder = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { organization, produce, meat, vito, dry, pickup, retailRescue } =
    req.body;
  if (!organization || !produce || !meat || !vito || !dry || !pickup) {
    next(
      ApiError.missingFields([
        'organization',
        'produce',
        'meat',
        'vito',
        'dry',
        'pickup',
      ]),
    );
  }
  const existingTimeSlot: IOrder | null = await getOrderByTimeSlot(pickup);
  if (existingTimeSlot) {
    next(
      ApiError.badRequest(
        `An order is already scheduled at ${pickup}, please select another time`,
      ),
    );
    return;
  }
  const organizationUser: IUser | null = await getUserByOrganization(
    organization,
  );

  if (!organizationUser) {
    next(ApiError.badRequest(`${organization} does not exist`));
    return;
  }
  try {
    const order = await createNewOrder(
      organization,
      produce,
      meat,
      vito,
      dry,
      retailRescue,
      'PENDING',
      pickup,
    );
    order.save();
    res.sendStatus(StatusCode.CREATED);
  } catch (err) {
    next(ApiError.internal('Unable to create order.'));
  }
};

const fetchAllOrders = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const orders: IOrder[] = await getAllOrders();
    res.status(StatusCode.OK).send(orders);
  } catch (err) {
    next(ApiError.internal('Unable to fetch all orders.'));
  }
};

const fetchAllCompletedOrders = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    console.log('fetching all completed orders');
    const orders: IOrder[] = await getAllCompletedOrders();
    res.status(StatusCode.OK).send(orders);
  } catch (err) {
    next(ApiError.internal('Unable to fetch all completed orders.'));
  }
};

const fetchOrdersByOrganization = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { org } = req.params;
  try {
    const orders: IOrder[] = await getAllOrdersForOrganization(org);
    res.status(StatusCode.OK).send(orders);
  } catch (err) {
    next(ApiError.internal(`Unable to fetch all orders for ${org}.`));
  }
};

const fetchOrderById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  try {
    const order: IOrder | null = await getOrderById(id);
    if (!order) {
      next(ApiError.notFound('Order not found'));
      return;
    }
    res.status(StatusCode.OK).send(order);
  } catch (err) {
    next(ApiError.internal('Unable to fetch order'));
  }
};

const updateOrder = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  const order = req.body;
  if (!order) {
    next(
      ApiError.missingFields([
        'organization',
        'produce',
        'meat',
        'vito',
        'dry',
        'status',
        'pickup',
      ]),
    );
  }
  updateOrderById(id, order)
    .then(() => {
      res.sendStatus(StatusCode.OK);
    })
    .catch(() => {
      next(ApiError.internal('Unable to update order.'));
    });
};

export {
  createOrder,
  fetchAllOrders,
  fetchAllCompletedOrders,
  fetchOrdersByOrganization,
  fetchOrderById,
  updateOrder,
};
