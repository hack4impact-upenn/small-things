import React from 'react';
import { Button, Typography, Grid } from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import PartnerOrderTable from '../components/PartnerOrderTable';

function PartnerOrderPage() {
  return (
    <ScreenGrid>
      <Grid
        item
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
      >
        <Typography variant="h2">My Orders</Typography>

        {/* <Button variant="contained" href="/order/new">+ NEW ORDER</Button> */}
        <div style={{ height: '60vh', width: '60vw' }}>
          <PartnerOrderTable />
        </div>
      </Grid>
    </ScreenGrid>
  );
}

export default PartnerOrderPage;
