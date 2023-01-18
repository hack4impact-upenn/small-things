import React from 'react';
import { AppBar, Toolbar, CssBaseline, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import LogOutButton from './buttons/LogOutButton';

function Navbar() {
  return (
    <AppBar position="static">
      <CssBaseline />
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Small Things
        </Typography>
        <Button color="inherit" href="/orders">
          Orders
        </Button>
        <Button color="inherit" href="/orders/past">
          Past Orders
        </Button>
        <Button color="inherit" href="/users">
          Users
        </Button>
        <Button color="inherit" href="/settings">
          Settings
        </Button>
        <LogOutButton />
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
