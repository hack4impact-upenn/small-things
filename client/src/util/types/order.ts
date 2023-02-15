/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Interface for the order data type return from the backend
 */
interface IRetailRescueItem {
  item: string;
  comment?: string;
}

interface IOrder {
  _id: string;
  advanced: boolean;
  organization: string;
  produce: number;
  meat: any;
  vito: any;
  dry: any;
  retailRescue: Array<IRetailRescueItem>;
  comment: string;
  status: string;
  pickup: Date;
}

export type { IOrder, IRetailRescueItem };
