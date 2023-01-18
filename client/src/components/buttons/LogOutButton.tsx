import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { logout as logoutAction } from '../../util/redux/userSlice';
import { useAppDispatch } from '../../util/redux/hooks';
import { logout as logoutApi } from '../../Home/api';
/**
 * A disabled button that displays a loading indicator.
 */
function LogOutButton() {
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const logoutDispatch = () => dispatch(logoutAction());
  const handleLogout = async () => {
    if (await logoutApi()) {
      logoutDispatch();
      navigator('/login', { replace: true });
    }
  };
  return (
    <Button onClick={handleLogout} color="inherit">
      Logout
    </Button>
  );
}

export default LogOutButton;
