import React from 'react';
import { Typography, Grid } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import UserTable from './UserTable';
import InviteUserButton from './InviteUserButton';
import BasicTabs from '../components/PartnerTabs';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function AdminDashboardPage() {
  return (
    <ScreenGrid>
      <Grid
        item
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
      >
        <Typography variant="h2">Welcome to the Admin Dashboard</Typography>

        <div style={{ height: '60vh', width: '60vw' }}>
          <UserTable />
        </div>
        <InviteUserButton />
        <div style={{ height: '60vh', width: '60vw' }}>
          <BasicTabs />
        </div>
      </Grid>
    </ScreenGrid>
  );
}

export default AdminDashboardPage;
