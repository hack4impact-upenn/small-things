/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

import { PaginationTable, TColumn } from '../components/PaginationTable';
import { useData } from '../util/api';
import { IOrder } from '../util/types/order';

interface AdminOrderTableProps {
  propStatus: string;
}

interface AdminOrderTableRow {
  key: string;
  pickupDate: string;
  pickupTime: string;
  organization: string;
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
function AdminOrderTable({ propStatus }: AdminOrderTableProps) {
  // define columns for the table
  const allOrders = useData('order/all');
  const columns: TColumn[] = [
    { id: 'pickupDate', label: 'Pick-up Date' },
    { id: 'pickupTime', label: 'Pick-up Time' },
    { id: 'organization', label: 'Organization' },
    { id: 'produce', label: 'Produce' },
    { id: 'meat', label: 'Meat' },
    { id: 'dry', label: 'Dry' },
    { id: 'vito', label: 'Vito' },
    { id: 'retail', label: 'RR' },
    { id: 'view', label: 'View Order' },
  ];

  // Used to create the data type to create a row in the table
  function createPartnerOrderTableRow(order: IOrder): AdminOrderTableRow {
    const {
      _id,
      pickup,
      organization,
      produce,
      meat,
      dry,
      vito,
      retailRescue,
    } = order;
    const myDate = new Date(pickup);
    return {
      key: _id,
      pickupDate: myDate.toDateString(),
      pickupTime: myDate.toLocaleTimeString(),
      organization,
      produce: produce.count,
      meat: meat.count,
      dry: dry.count,
      vito: vito.count,
      retail: retailRescue.length,
      view: (
        <Button variant="contained" href={`/order/${_id}`}>
          View Order
        </Button>
      ),
    };
  }

  const [orderList, setOrderList] = useState<IOrder[]>([]);
  useEffect(() => {
    setOrderList(
      allOrders?.data.filter((order: IOrder) => order.status === propStatus),
    );
  }, [allOrders, propStatus]);

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

export default AdminOrderTable;
