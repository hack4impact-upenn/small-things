/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import dayjs from 'dayjs';
import { IOrder, IRetailRescueItem } from '../util/types/order';

interface PickSheetTableProps {
  orders: IOrder[];
}

function PickSheetTable({ orders }: PickSheetTableProps) {
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
        <TableBody>
          {orders
            .sort(
              (a: IOrder, b: IOrder) =>
                dayjs(a.pickup).unix() - dayjs(b.pickup).unix(),
            )
            .map((row: IOrder) => {
              const newDate = new Date(row.pickup);
              return (
                // eslint-disable-next-line no-underscore-dangle
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {newDate.toLocaleString([], {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell align="left">{row.organization}</TableCell>
                  <TableCell align="left">
                    {row.advanced
                      ? row.dry.map((item: IRetailRescueItem) => (
                          <div key={item.item}>
                            {item.item} - {item.comment} <br />
                          </div>
                        ))
                      : row.dry}
                  </TableCell>
                  <TableCell align="left">{row.produce}</TableCell>
                  <TableCell align="left">
                    {row.advanced
                      ? row.vito.map((item: IRetailRescueItem) => (
                          <div key={item.item}>
                            {item.item} - {item.comment} <br />
                          </div>
                        ))
                      : row.vito}
                  </TableCell>
                  <TableCell>
                    {row.advanced
                      ? row.meat.map((item: IRetailRescueItem) => (
                          <div key={item.item}>
                            {item.item} - {item.comment} <br />
                          </div>
                        ))
                      : row.meat}
                  </TableCell>
                  <TableCell style={{ minWidth: 200 }}>
                    {row.retailRescue.map((rrItem) => (
                      <div key={rrItem.item}>
                        {rrItem.item} - {rrItem.comment} <br />
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{row.comment}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PickSheetTable;
