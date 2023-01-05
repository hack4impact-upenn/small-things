import React, { useState, useEffect } from 'react';
import { Typography, Grid, CircularProgress } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import AdminOrderTable from '../components/AdminOrderTable';
import Navbar from '../components/NavBar';
import { IOrder } from '../util/types/order';
import { useData } from '../util/api';

function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const pastOrders = useData('order/completed');
  useEffect(() => {
    if (pastOrders?.data) {
      setLoading(false);
      setOrders(pastOrders?.data);
    }
  }, [pastOrders]);

  return (
    <>
      <Navbar />
      <ScreenGrid>
        <Grid justifyContent="flex-start" alignItems="stretch">
          <Grid>
            <Typography variant="h2">Past Orders</Typography>
          </Grid>
          {loading ? (
            <CircularProgress size={80} />
          ) : (
            <Grid>
              <div style={{ height: '60vh', width: '60vw' }}>
                <AdminOrderTable orders={orders} />
              </div>
            </Grid>
          )}
        </Grid>
      </ScreenGrid>
    </>
  );
}

export default AdminOrdersPage;
