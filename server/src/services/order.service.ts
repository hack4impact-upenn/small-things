import { menuItem, Order, retailRescueItem } from '../models/order.model';

/**
 * Creates a new user in the database.
 * @param organization - string representing name of the organization creating the order
 * @param produce - {@link menuItem} of produce requested
 * @param meat - {@link menuItem} of meat requested
 * @param dry - {@link menuItem} of dry requested
 * @param vito - {@link menuItem} of vito requested
 * @param retailRescue - array of {@link retailRescueItem} requested
 * @param status - enum ('PENDING', 'APPROVED', 'RELEASED', 'COMPLETED') representing the status of the order
 * @param pickup - Datetime of when the order is schedueld to be picked-up
 * @returns The created {@link User}
 */
const createNewOrder = async (
  organization: string,
  produce: menuItem,
  meat: menuItem,
  vito: menuItem,
  dry: menuItem,
  retailRescue: Array<retailRescueItem>,
  status: string,
  pickup: Date,
) => {
  const newOrder = new Order({
    organization,
    produce,
    meat,
    vito,
    dry,
    retailRescue,
    status,
    pickup,
  });
  const order = await newOrder.save();
  return order;
};

const getOrderByTimeSlot = async (pickup: Date) => {
  const user = await Order.findOne({ pickup }).exec();
  return user;
};

export { createNewOrder, getOrderByTimeSlot };
