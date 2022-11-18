/**
 * Defines the Order model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';

interface retailRescueItem {
  item: string;
  comment?: string;
}

interface menuItem {
  count: number;
  comment?: string;
}

const retailRescueItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
});

const menuItemSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0,
  },
  comment: {
    type: String,
    required: false,
  },
});

const OrderSchema = new mongoose.Schema({
  organization: {
    type: String,
    required: true,
  },
  produce: {
    type: menuItemSchema,
    required: true,
  },
  meat: {
    type: menuItemSchema,
    required: true,
  },
  vito: {
    type: menuItemSchema,
    required: true,
  },
  dry: {
    type: menuItemSchema,
    required: true,
  },
  retailRescue: {
    type: [retailRescueItemSchema],
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'APPROVED', 'RELEASED', 'COMPLETED'],
    default: 'PENDING',
  },
  pickup: {
    type: Date,
    required: true,
  },
});

interface IOrder extends mongoose.Document {
  _id: string;
  organization: string;
  produce: menuItem;
  meat: menuItem;
  vito: menuItem;
  dry: menuItem;
  retailRescue: Array<retailRescueItem>;
  status: string;
  pickup: Date;
}

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export { IOrder, Order, menuItem, retailRescueItem };
