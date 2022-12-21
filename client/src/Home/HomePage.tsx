import React from 'react';
import { Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import ScreenGrid from '../components/ScreenGrid';

/**
 * The HomePage of the user dashboard. Displays a welcome message, a logout button and a button to promote the user to admin if they are not already an admin. If the user is an admin, the button will navigate them to the admin dashboard. This utilizes redux to access the current user's information.
 */
function HomePage() {
  const user = useAppSelector(selectUser);

  if (user.admin) {
    return <Navigate to="/orders" />;
  }
  const message = `Welcome to the Boilerplate, ${user.firstName} ${user.lastName}!`;
  return (
    <ScreenGrid>
      <Typography variant="h2">{message}</Typography>
    </ScreenGrid>
  );
}

export default HomePage;
