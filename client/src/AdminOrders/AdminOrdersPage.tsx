import React from 'react';
import { Typography, Grid } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import AdminOrderTabs from './AdminOrderTabs';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function AdminOrdersPage() {
  return (
    <ScreenGrid>
      <Grid
        item
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
      >
        <Typography variant="h2">Orders</Typography>
        <div style={{ height: '60vh', width: '60vw' }}>
          <AdminOrderTabs />
        </div>
      </Grid>
    </ScreenGrid>
  );
}

export default AdminOrdersPage;
