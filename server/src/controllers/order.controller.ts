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
  getAllApprovedOrders,
} from '../services/order.service';
import { emailApproveOrder, emailRejectOrder } from '../services/mail.service';
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
  const {
    organization,
    produce,
    meat,
    vito,
    dry,
    pickup,
    retailRescue,
    comment,
  } = req.body;
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
  const organizationUser: IUser | null = req.user as IUser;

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
      comment,
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

const approveOrder = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  const order = req.body;
  if (!order) {
    next(ApiError.missingFields(['status']));
  }
  const currentOrder: IOrder | null = await getOrderById(id);
  if (!currentOrder) {
    next(ApiError.notFound('Order not found'));
    return;
  }

  if (currentOrder.status !== 'PENDING') {
    next(ApiError.notFound('Order not pending'));
    return;
  }

  currentOrder.status = 'APPROVED';

  const organizationUser: IUser | null = req.user as IUser;

  if (!organizationUser) {
    next(ApiError.notFound('User/Organization not found'));
    return;
  }

  updateOrderById(id, currentOrder)
    .then(() => {
      emailApproveOrder(organizationUser.email, currentOrder)
        .then(() =>
          res.status(StatusCode.CREATED).send({
            message: `Email has been sent to ${organizationUser.email}`,
          }),
        )
        .catch(() => {
          next(ApiError.internal('Failed to send approved order email.'));
        });
    })
    .catch(() => {
      next(ApiError.internal('Unable to approve order.'));
    });
};

const modifyAndApproveOrder = async (
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

  const currentOrder: IOrder | null = await getOrderById(id);
  if (!currentOrder) {
    next(ApiError.notFound('Order not found'));
    return;
  }

  if (currentOrder.status !== 'PENDING') {
    next(ApiError.notFound('Order not pending'));
    return;
  }

  order.status = 'APPROVED';

  const organizationUser: IUser | null = req.user as IUser;

  if (!organizationUser) {
    next(ApiError.notFound('User/Organization not found'));
    return;
  }

  updateOrderById(id, order)
    .then(() => {
      emailApproveOrder(organizationUser.email, order)
        .then(() =>
          res.status(StatusCode.CREATED).send({
            message: `Email has been sent to ${organizationUser.email}`,
          }),
        )
        .catch(() => {
          next(ApiError.internal('Failed to send modify order email.'));
        });
    })
    .catch(() => {
      next(ApiError.internal('Unable to modify order.'));
    });
};

const modifyOrder = async (
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

  const currentOrder: IOrder | null = await getOrderById(id);
  if (!currentOrder) {
    next(ApiError.notFound('Order not found'));
    return;
  }

  if (currentOrder.status !== 'PENDING') {
    next(
      ApiError.notFound('Order status is not pending so it cannot be modfied'),
    );
    return;
  }

  const organizationUser: IUser | null = req.user as IUser;

  if (!organizationUser) {
    next(ApiError.notFound('User/Organization not found'));
    return;
  }

  order.status = 'PENDING';

  updateOrderById(id, order)
    .then(() => {
      res.status(StatusCode.CREATED).send({
        message: 'Order has been modified',
      });
    })
    .catch(() => {
      next(ApiError.internal('Unable to modify order.'));
    });
};

const rejectOrder = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  const order = req.body;
  if (!order) {
    next(ApiError.missingFields(['status']));
  }
  const currentOrder: IOrder | null = await getOrderById(id);
  if (!currentOrder) {
    next(ApiError.notFound('Order not found'));
    return;
  }

  if (currentOrder.status !== 'PENDING') {
    next(ApiError.notFound('Order not pending'));
    return;
  }

  currentOrder.status = 'REJECTED';

  const organizationUser: IUser | null = req.user as IUser;

  if (!organizationUser) {
    next(ApiError.notFound('User/Organization not found'));
    return;
  }

  updateOrderById(id, currentOrder)
    .then(() => {
      emailRejectOrder(organizationUser.email, currentOrder)
        .then(() =>
          res.status(StatusCode.CREATED).send({
            message: `Email has been sent to ${organizationUser.email}`,
          }),
        )
        .catch(() => {
          next(ApiError.internal('Failed to send order rejection email.'));
        });
    })
    .catch(() => {
      next(ApiError.internal('Unable to reject order.'));
    });
};

const cancelOrder = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  const order = req.body;
  if (!order) {
    next(ApiError.missingFields(['status']));
  }
  const currentOrder: IOrder | null = await getOrderById(id);
  if (!currentOrder) {
    next(ApiError.notFound('Order not found'));
    return;
  }

  if (currentOrder.status !== 'PENDING') {
    next(ApiError.notFound('Order status is not pending'));
    return;
  }

  currentOrder.status = 'CANCELED';

  const organizationUser: IUser | null = req.user as IUser;

  if (!organizationUser) {
    next(ApiError.notFound('User/Organization not found'));
    return;
  }

  updateOrderById(id, currentOrder)
    .then(() => {
      res.status(StatusCode.OK).send({
        message: `Order has been sent to canceled`,
      });
    })
    .catch(() => {
      next(ApiError.internal('Unable to cancel order.'));
    });
};

const fetchPickSheet = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const dates = req.body;
  if (!dates) {
    next(ApiError.missingFields(['date range']));
  }

  const startDate = new Date(dates.startDate);
  const endDate = new Date(dates.endDate);

  if (!startDate) {
    next(ApiError.missingFields(['start date']));
  }

  if (!endDate) {
    next(ApiError.missingFields(['end date']));
  }

  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  try {
    let orders: IOrder[] = await getAllApprovedOrders();
    orders = orders.filter(
      (order) =>
        order.pickup.getTime() <= endTime &&
        order.pickup.getTime() >= startTime,
    );
    const result = Object.create(null);

    for (let loopTime = startTime; loopTime < endTime; loopTime += 86400000) {
      const loopDay = new Date(loopTime);
      const picks = orders.filter(
        (order) =>
          order.pickup.getDate() === loopDay.getDate() &&
          order.pickup.getMonth() === loopDay.getMonth() &&
          order.pickup.getFullYear() === loopDay.getFullYear(),
      );
      const month = loopDay.getMonth() + 1;
      let entry = '';
      entry = entry.concat(
        month.toString(),
        '/',
        loopDay.getDate().toString(),
        '/',
        loopDay.getFullYear().toString(),
      );

      result[entry] = picks;
    }

    res.status(StatusCode.OK).send(result);
  } catch (err) {
    next(ApiError.internal('Unable to fetch all orders.'));
  }
};

export {
  createOrder,
  fetchAllOrders,
  fetchAllCompletedOrders,
  fetchOrdersByOrganization,
  fetchOrderById,
  updateOrder,
  fetchUsedTimes,
  approveOrder,
  modifyAndApproveOrder,
  modifyOrder,
  rejectOrder,
  fetchPickSheet,
  cancelOrder,
};
