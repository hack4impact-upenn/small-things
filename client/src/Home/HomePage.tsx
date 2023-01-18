import React from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import ScreenGrid from '../components/ScreenGrid';
import PartnerOrderTable from '../components/PartnerOrderTable';
import LogOutButton from '../components/buttons/LogOutButton';

/**
 * The HomePage of the user dashboard. Displays a welcome message, a logout button and a button to promote the user to admin if they are not already an admin. If the user is an admin, the button will navigate them to the admin dashboard. This utilizes redux to access the current user's information.
 */
function HomePage() {
  const user = useAppSelector(selectUser);

  if (user.admin) {
    return <Navigate to="/orders" />;
  }
  return (
    <div style={{ backgroundColor: '#D9D9D9' }}>
      <ScreenGrid>
        <Box
          sx={{
            paddingBottom: '20px',
            minHeight: '80vh',
          }}
        >
          <Grid item container justifyContent="flex-end">
            <LogOutButton />
          </Grid>
          <Paper
            sx={{
              margin: 'auto',
              borderRadius: '25px',
              minHeight: '70vh',
              padding: '5vw',
            }}
          >
            <Grid item>
              <Typography variant="h2">{user.organization} Orders</Typography>
            </Grid>
            <Grid item container justifyContent="flex-end">
              <div style={{ marginBottom: '10px' }}>
                <Button variant="contained" href="/order/new">
                  + NEW ORDER
                </Button>
              </div>
            </Grid>
            <Grid item>
              <div
                style={{ height: '60vh', maxWidth: '90vw', minWidth: '60vw' }}
              >
                <PartnerOrderTable />
              </div>
            </Grid>
          </Paper>
        </Box>
      </ScreenGrid>
    </div>
  );
}

export default HomePage;
