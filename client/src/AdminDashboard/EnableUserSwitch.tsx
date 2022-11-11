import React, { useState } from 'react';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import { upgradePrivilege } from './api';
import LoadingButton from '../components/buttons/LoadingButton';
import ConfirmationModal from '../components/ConfirmationModal';

interface EnableUserSwitchProps {
  admin: boolean;
  email: string;
  enableUser: (email: string) => void;
}

/**
 * The button component which, when clicked, will enable or disable a user.
 * @param admin - whether the user is an admin
 * @param email - the email of the user to enable/disable
 * FIX THIS
 * @param updatesAdmin - a function which updates whether the user is an admin
 * on the frontend representation of the set of users. This function is called
 * upon successfully deletion of user from the database.
 */
function EnableUserSwitch({ admin, email, enableUser }: EnableUserSwitchProps) {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
}

export default EnableUserSwitch;
