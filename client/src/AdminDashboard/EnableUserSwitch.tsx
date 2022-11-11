import React, { useState } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { upgradePrivilege } from './api';
import LoadingButton from '../components/buttons/LoadingButton';
import ConfirmationModal from '../components/ConfirmationModal';

interface EnableUserSwitchProps {
  enabled: boolean;
  email: string;
  updateEnable: (email: string) => void;
}

/**
 * The button component which, when clicked, will promote a user to admin.
 * If the user is already admin, the button will be unclickable.
 * @param admin - whether the user is an admin
 * @param email - the email of the user to promote
 * @param updatesEnable - a function which updates whether the user is an admin
 * on the frontend representation of the set of users. This function is called
 * upon successfully deletion of user from the database.
 */
function EnableUserSwitch({
  enabled,
  email,
  updateEnable,
}: EnableUserSwitchProps) {
  // const [isLoading, setLoading] = useState(false);

  // async function handleEnable() {
  //   setLoading(true);
  //   if (await upgradePrivilege(email)) {
  //     updateEnable(email);
  //   }
  //   setLoading(false);
  // }
  // if (isLoading) {
  //   return <LoadingButton />;
  // }
  // if (!enabled) {
  //   return (
  //     <ConfirmationModal
  //       buttonText="Enable User"
  //       title="Are you sure you want to enable this user?"
  //       body="This action will renable the user"
  //       onConfirm={() => handleEnable()}
  //     />
  //   );
  // }
  // return (
  //   <Switch
  //     checked={enabled}
  //     onChange={handleChange}
  //     inputProps={{ 'aria-label': 'controlled' }}
  //   />
  // );

  async function handleEnable() {
    if (await upgradePrivilege(email)) {
      updateEnable(email);
    }
  }

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleEnable();
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
