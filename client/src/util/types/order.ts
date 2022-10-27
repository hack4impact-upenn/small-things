
/**
 * Interface for the order data type return from the backend
 */
 interface IOrder {
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
  
  export default IOrder;
  