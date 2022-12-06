import React from 'react';
import { Grid } from '@mui/material';
import NewOrderForm from './NewOrderForm';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function NewOrderFormPage() {
  return (
    <Grid
      item
      container
      xs={12}
      sx={{
        overflow: 'flex',
        paddingTop: '30px',
        paddingBottom: '30px',
      }}
      justifyContent="space-evenly"
      alignItems="center"
    >
      <NewOrderForm />
    </Grid>
  );
}

export default NewOrderFormPage;
