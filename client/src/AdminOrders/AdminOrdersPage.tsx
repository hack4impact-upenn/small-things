import React from 'react';
import { Typography, Grid } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import AdminOrderTabs from './AdminOrderTabs';
import Navbar from '../components/NavBar';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function AdminOrdersPage() {
  return (
    <>
      <Navbar />
      <ScreenGrid>
        <Grid justifyContent="flex-start" alignItems="stretch">
          <Grid>
            <Typography variant="h2">Orders</Typography>
          </Grid>
          <Grid>
            <div style={{ height: '60vh', width: '60vw' }}>
              <AdminOrderTabs />
            </div>
          </Grid>
        </Grid>
      </ScreenGrid>
    </>
  );
}

export default AdminOrdersPage;
