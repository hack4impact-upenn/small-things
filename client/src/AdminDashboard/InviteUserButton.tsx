import React, { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { createInvite } from './api';
import useAlert from '../util/hooks/useAlert';

function InviteUserButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAlert } = useAlert();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInvite = async () => {
    setLoading(true);
    await new Promise((r) => {
      setTimeout(r, 2000);
    });
    createInvite(email).then((res) => {
      if (res.error) {
        setError(res.error.message);
      } else {
        setOpen(false);
      }
      setLoading(false);
      setAlert(`${email} successfully invited!`, 'success');
    });
  };

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setEmail(event.target.value);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Button variant="contained" onClick={handleClickOpen}>
        Invite User
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            Please enter the email address of the user you would like to invite.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            onChange={updateEmail}
          />
          <DialogContentText sx={{ color: 'red' }}>{error}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button disabled={loading} onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton loading={loading} onClick={handleInvite}>
            Invite
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InviteUserButton;
