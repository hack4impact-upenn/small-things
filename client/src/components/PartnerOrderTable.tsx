/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

import { PaginationTable, TColumn } from './PaginationTable';
import IOrder from '../util/types/order';

import { useData } from '../util/api';
import AdminOrdersPage from '../AdminOrders/AdminOrdersPage';

interface PartnerOrderTableRow {
  key: string;
  pickupDate: string;
  pickupTime: string;
  status: string;
  produce: number;
  meat: number;
  dry: number;
  vito: number;
  retail: number;
  view: JSX.Element;
}

/**
 * The standalone table component for holding information about the orders in
 * the database and allowing organizations to view orders themselves.
 */
function PartnerOrderTable() {
  // define columns for the table
  const columns: TColumn[] = [
    { id: 'pickupDate', label: 'Pick-up Date' },
    { id: 'pickupTime', label: 'Pick-up Time' },
    { id: 'status', label: 'Status' },
    { id: 'produce', label: 'Produce' },
    { id: 'meat', label: 'Meat' },
    { id: 'dry', label: 'Dry' },
    { id: 'vito', label: 'Vito' },
    { id: 'retail', label: 'RR' },
    { id: 'view', label: 'View Order' },
  ];

  // Used to create the data type to create a row in the table
  function createPartnerOrderTableRow(order: IOrder): PartnerOrderTableRow {
    const { _id, pickup, status, produce, meat, dry, vito, retailRescue } =
      order;
    const myDate = new Date(pickup);
    return {
      key: _id,
      pickupDate: myDate.toDateString(),
      pickupTime: myDate.toLocaleTimeString(),
      status,
      produce: produce.count,
      meat: meat.count,
      dry: dry.count,
      vito: vito.count,
      retail: retailRescue.length,
      view: <div />, // <Button variant="contained" href={`/order/${_id}`}>View Order</Button>,
    };
  }

  const [orderList, setOrderList] = useState<IOrder[]>([]);
  const orders = useData('order/Hack4Impact/all');

  useEffect(() => {
    setOrderList(
      orders?.data.filter(
        (entry: IOrder) => entry && entry.organization,
        // Need to check for entry.organization == self.organization (not yet able to fetch)
      ),
    );
  }, [orders]);

  // need to create the viewOrderButton as well
  // if the orderlist is not yet populated, display a loading spinner
  if (!orderList) {
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
  }
  return (
    <PaginationTable
      rows={orderList.map((order: IOrder) => createPartnerOrderTableRow(order))}
      columns={columns}
    />
  );
}

export default PartnerOrderTable;
