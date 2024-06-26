import { IOrder, Order, retailRescueItem } from '../models/order.model';

/**
 * Creates a new order in the database.
 * @param organization - string representing name of the organization creating the order
 * @param produce - produce requested
 * @param meat - meat requested
 * @param dry - dry requested
 * @param vito -  vito requested
 * @param retailRescue - array of {@link retailRescueItem} requested
 * @param status - enum ('PENDING', 'APPROVED', 'RELEASED', 'COMPLETED', 'CANCLED', 'REJECTED') representing the status of the order
 * @param pickup - Datetime of when the order is schedueld to be picked-up
 * @returns The created {@link User}
 */
const createNewOrder = async (
  email: string,
  advanced: boolean,
  organization: string,
  produce: number,
  meat: number | Array<string>,
  vito: number | Array<string>,
  dry: number | Array<string>,
  retailRescue: Array<retailRescueItem>,
  status: string,
  comment: string,
  pickup: Date,
) => {
  const newOrder = new Order({
    email,
    advanced,
    organization,
    produce,
    meat,
    vito,
    dry,
    retailRescue,
    comment,
    status,
    pickup,
  });
  const order = await newOrder.save();
  return order;
};

const getOrderByTimeSlot = async (pickup: Date) => {
  const orders = await Order.find({ pickup }).exec();
  return orders;
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

const getAllApprovedOrdersInDateRange = async (start: Date, end: Date) => {
  const orders = await Order.find({
    status: { $in: ['APPROVED', 'RELEASED', 'COMPLETED'] },
    pickup: { $gte: start, $lte: end },
  }).exec();
  return orders;
};

const getAllActiveOrdersInDateRange = async (start: Date, end: Date) => {
  const orders = await Order.find({
    status: { $nin: ['COMPLETED', 'CANCELED', 'REJECTED'] },
    pickup: { $gte: start, $lte: end },
  }).exec();
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
 * @param produce - produce requested
 * @param meat - meat requested
 * @param dry -  dry requested
 * @param vito - vito requested
 * @param retailRescue - array of {@link retailRescueItem} requested
 * @param status - enum ('PENDING', 'APPROVED', 'RELEASED', 'COMPLETED') representing the status of the order
 * @param pickup - Datetime of when the order is schedueld to be picked-up
 * @returns The updated {@link order}
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
  getAllActiveOrdersInDateRange,
  getAllApprovedOrdersInDateRange,
};
