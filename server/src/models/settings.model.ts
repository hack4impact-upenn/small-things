import mongoose from 'mongoose';

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
  advanced: {
    type: Boolean,
    required: true,
  },
  dryGoodOptions: {
    type: [String],
    required: true,
  },
  vitoOptions: {
    type: [String],
    required: true,
  },
  meatOptions: {
    type: [String],
    required: true,
  },
  disabledDates: {
    type: [Date],
    required: false,
  },
});

interface ISettings extends mongoose.Document {
  maxNumOfMeat: number;
  maxNumOfProduce: number;
  maxNumOfVito: number;
  maxNumOfDryGoods: number;
  leadTime: number;
  retailRescueItems: Array<string>;
  advanced: boolean;
  dryGoodOptions: Array<string>;
  vitoOptions: Array<string>;
  meatOptions: Array<string>;
  disabledDates: Array<Date>;
}

const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);

export { ISettings, Settings };
