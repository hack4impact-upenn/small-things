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
} from '../services/order.service';
import { getUserByOrganization } from '../services/user.service';
import { ISettings, Settings } from '../models/settings.model';

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
  const user: IUser | null = req.user as IUser;
  try {
    const order: IOrder | null = await getOrderById(id);
    if (!order) {
      next(ApiError.notFound('Order not found'));
      return;
    }
    if (order.organization !== user.organization && !user.admin) {
      next(ApiError.notFound('Not part of order Orgnaization'));
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

const fetchUsedTimes = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    // get the lead time from settings
    const settings: ISettings | null = await Settings.findOne();
    if (!settings) {
      next(ApiError.internal('Unable to fetch settings.'));
      return;
    }
    const { leadTime } = settings;

    const orders: IOrder[] = await getAllOrders();
    // filter orders by pickup time such that pickup time is greater than current time + lead time and less than current time + lead time + 14 days
    const currentTime = new Date();
    const currentTimePlusLeadTime = new Date(
      currentTime.getTime() + leadTime * 24 * 60 * 60 * 1000,
    );
    const currentTimePlusLeadTimePlusTwoWeeks = new Date(
      currentTime.getTime() +
        leadTime * 24 * 60 * 60 * 1000 +
        14 * 24 * 60 * 60 * 1000,
    );
    orders.filter(
      (order) =>
        order.pickup > currentTimePlusLeadTime &&
        order.pickup < currentTimePlusLeadTimePlusTwoWeeks,
    );

    // make a map of every possible date from currentTimePlusLeadTime to currentTimePlusLeadTimePlusTwoWeeks and initialize all values to empty array
    const possibleTimes = new Map();
    for (
      let d = currentTimePlusLeadTime;
      d <= currentTimePlusLeadTimePlusTwoWeeks;
      d.setDate(d.getDate() + 1)
    ) {
      possibleTimes.set(d.toLocaleDateString(), []);
    }

    // for each order in orders, add the order's pickup time to the map based on date
    orders.forEach((order) => {
      const date = new Date(order.pickup);
      date.setHours(0, 0, 0, 0);
      const times = possibleTimes.get(date.toLocaleDateString());
      if (times) {
        times.push(order.pickup.toLocaleTimeString());
      }
    });
    res.status(StatusCode.OK).send(Object.fromEntries(possibleTimes));
  } catch (err) {
    next(ApiError.internal('Unable to fetch times.'));
  }
};

export {
  createOrder,
  fetchAllOrders,
  fetchOrdersByOrganization,
  fetchOrderById,
  updateOrder,
  fetchUsedTimes,
};
