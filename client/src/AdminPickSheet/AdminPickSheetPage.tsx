import React from 'react';
import { Typography, Grid, Box, Paper } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import Navbar from '../components/NavBar';
import PickSheetTabs from './PickSheetTabs';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function AdminPickSheetPage() {
  return (
    <div style={{ backgroundColor: '#D9D9D9' }}>
      <Navbar />
      <ScreenGrid>
        <Box
          sx={{
            paddingBottom: '20px',
            minHeight: '80vh',
          }}
        >
          <Paper
            sx={{
              margin: 'auto',
              borderRadius: '25px',
              minHeight: '70vh',
              padding: '5vw',
            }}
          >
            <Grid item>
              <Typography variant="h2">Pick Sheets</Typography>
            </Grid>
            <Grid item>
              <div style={{ height: '60vh', width: '60vw' }}>
                <PickSheetTabs />
              </div>
            </Grid>
          </Paper>
        </Box>
      </ScreenGrid>
    </div>
  );
}

export default AdminPickSheetPage;
