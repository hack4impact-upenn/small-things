/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import { IOrder } from '../util/types/order';

interface PickSheetTableProps {
  orders?: IOrder[];
}

interface PickSheetTableRow {
  key: string;
  pickupDate: string;
  pickupTime: string;
  organization: string;
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
function PickSheetTable({ orders }: PickSheetTableProps) {
  const [orderList, setOrderList] = useState<IOrder[]>([]);

  // if the orderlist is not yet populated, display a loading spinner
  if (!orderList) {
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Pick-up Time</TableCell>
            <TableCell>Organization</TableCell>
            <TableCell>Dry</TableCell>
            <TableCell>Produce</TableCell>
            <TableCell>Vito</TableCell>
            <TableCell>Meat</TableCell>
            <TableCell>Retail Rescue</TableCell>
            <TableCell>Comments</TableCell>
          </TableRow>
        </TableHead>
        {/* <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody> */}
      </Table>
    </TableContainer>
  );
}

export default PickSheetTable;
