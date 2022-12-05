import mongoose from 'mongoose';
import { retailRescueItem } from './order.model';

const SettingsSchema = new mongoose.Schema({
  maxNumOfMeat: {
    type: Number,
    required: true,
  },
  maxNumOfProduce: {
    type: Number,
    required: true,
  },
  maxNumOfVito: {
    type: Number,
    required: true,
  },
  maxNumOfDryGoods: {
    type: Number,
    required: true,
  },
  leadTime: {
    type: Number,
    required: true,
  },
  retailRescueItems: {
    type: [String],
    required: true,
  },
});

interface ISettings extends mongoose.Document {
  maxNumOfMeat: number;
  maxNumOfProduce: number;
  maxNumOfVito: number;
  maxNumOfDryGoods: number;
  leadTime: number;
  retailRescueItems: Array<retailRescueItem>;
}

const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);

export { ISettings, Settings };
