/**
 * Interface for the order data type return from the backend
 */

interface IMenuItem {
  count: number;
  comment?: string;
}

interface IRetailRescueItem {
  item: string;
  comment?: string;
}

interface IOrder {
  _id: string;
  organization: string;
  produce: IMenuItem;
  meat: IMenuItem;
  vito: IMenuItem;
  dry: IMenuItem;
  retailRescue: Array<IRetailRescueItem>;
  comment: string;
  status: string;
  pickup: Date;
}

export default IOrder;
