/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

import { PaginationTable, TColumn } from './PaginationTable';
import { IOrder } from '../util/types/order';
import { useData } from '../util/api';
import { selectUser } from '../util/redux/userSlice';
import { useAppSelector } from '../util/redux/hooks';

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
      pickupTime: myDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status,
      produce,
      meat: order.advanced ? meat.length : meat,
      dry: order.advanced ? dry.length : dry,
      vito: order.advanced ? vito.length : vito,
      retail: retailRescue.length,
      view: (
        <Button variant="contained" color="secondary" href={`order/${_id}`}>
          View Order
        </Button>
      ),
    };
  }

  const user = useAppSelector(selectUser);
  const allOrders = useData(`order/${user.organization}/all`);
  const [orderList, setOrderList] = useState<IOrder[]>([]);
  useEffect(() => {
    setOrderList(allOrders?.data);
  }, [allOrders]);

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
      rows={orderList
        .sort((a, b) => {
          const aDate = new Date(a.pickup);
          const bDate = new Date(b.pickup);
          return bDate.valueOf() - aDate.valueOf();
        })
        .map((order: IOrder) => createPartnerOrderTableRow(order))}
      columns={columns}
    />
  );
}

export default PartnerOrderTable;
