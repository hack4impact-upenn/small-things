import React from 'react';
import { Box, Link, Paper } from '@mui/material';
import NewOrderForm from './NewOrderForm';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function NewOrderFormPage() {
  return (
    <div style={{ backgroundColor: '#D9D9D9', minHeight: '100vh' }}>
      <Box
        sx={{
          paddingTop: '7vh',
          paddingBottom: '20px',
        }}
      >
        <Paper
          sx={{
            margin: 'auto',
            width: '50vw',
            borderRadius: '25px',
          }}
        >
          <Box
            sx={{
              paddingLeft: '5vw',
              paddingTop: '5vh',
            }}
          >
            <Link href="/home"> {'<'} Back to Orders Page</Link>
          </Box>

          <NewOrderForm />
        </Paper>
      </Box>
    </div>
  );
}

export default NewOrderFormPage;
