/**
 * Defines the Order model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';

interface retailRescueItem {
  item: string;
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

const OrderSchema = new mongoose.Schema({
  advanced: {
    type: Boolean,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  produce: {
    type: Number,
    required: true,
  },
  meat: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  vito: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  dry: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  retailRescue: {
    type: [retailRescueItemSchema],
    required: false,
  },
  comment: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: [
      'PENDING',
      'APPROVED',
      'RELEASED',
      'COMPLETED',
      'CANCELED',
      'REJECTED',
    ],
    default: 'PENDING',
  },
  pickup: {
    type: Date,
    required: true,
  },
});

interface IOrder extends mongoose.Document {
  _id: string;
  advanced: boolean;
  organization: string;
  produce: number;
  meat: number | Array<retailRescueItem>;
  vito: number | Array<retailRescueItem>;
  dry: number | Array<retailRescueItem>;
  retailRescue: Array<retailRescueItem>;
  comment: string;
  status: string;
  pickup: Date;
}

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export { IOrder, Order, retailRescueItem };
