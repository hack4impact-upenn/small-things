/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { PaginationTable, TColumn } from './PaginationTable';
import { useData } from '../util/api';
import IOrder from '../util/types/order';

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
  ];

  // Used to create the data type to create a row in the table
  function createPartnerOrderTableRow(order: IOrder): PartnerOrderTableRow {
    const { _id, pickup, status, produce, meat, dry, vito, retailRescue } =
      order;
    return {
      key: _id,
      pickupDate: pickup.toLocaleDateString(),
      pickupTime: pickup.toLocaleTimeString(),
      status,
      produce: produce.amount,
      meat: meat.amount,
      dry: dry.amount,
      vito: vito.amount,
      retail: retailRescue.length,
    };
  }

  const [orderList, setOrderList] = useState<IOrder[]>([]);

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
