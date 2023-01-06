import {
  IOrder,
  menuItem,
  Order,
  retailRescueItem,
} from '../models/order.model';

/**
 * Creates a new order in the database.
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

const getOrderById = async (id: string) => {
  const order = await Order.findById(id).exec();
  return order;
};

const getAllOrders = async () => {
  const orders = await Order.find({}).sort({ pickup: -1 }).exec();
  return orders;
};

const getAllCompletedOrders = async () => {
  const orders = await Order.find({ status: 'COMPLETED' }).exec();
  return orders;
};

const getAllApprovedOrders = async () => {
  const orders = await Order.find({ status: 'APPROVED' }).exec();
  return orders;
};

const getAllOrdersForOrganization = async (org: string) => {
  const orders = await Order.find({ organization: org }).exec();
  return orders;
};

/**
 * A function that updates a user's status.
 * @param id The id of the user to update.
 * @param organization - string representing name of the organization creating the order
 * @param produce - {@link menuItem} of produce requested
 * @param meat - {@link menuItem} of meat requested
 * @param dry - {@link menuItem} of dry requested
 * @param vito - {@link menuItem} of vito requested
 * @param retailRescue - array of {@link retailRescueItem} requested
 * @param status - enum ('PENDING', 'APPROVED', 'RELEASED', 'COMPLETED') representing the status of the order
 * @param pickup - Datetime of when the order is schedueld to be picked-up
 * @returns The updated {@link User}
 */
const updateOrderById = async (id: string, newOrder: IOrder) => {
  const order = await Order.findByIdAndUpdate(id, newOrder).exec();
  return order;
};

export {
  createNewOrder,
  getOrderByTimeSlot,
  getAllOrders,
  getAllCompletedOrders,
  getAllOrdersForOrganization,
  getOrderById,
  updateOrderById,
  getAllApprovedOrders,
};
