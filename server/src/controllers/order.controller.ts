/**
 * All the middleware functions related to authentication
 */
import express from 'express';
import ApiError from '../util/apiError';
import { IOrder } from '../models/order.model';
import StatusCode from '../util/statusCode';
import { IUser } from '../models/user.model';
import { createNewOrder, getOrderByTimeSlot } from '../services/order.service';
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

// eslint-disable-next-line import/prefer-default-export
export { createOrder };
