import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import useAlert from '../util/hooks/useAlert';

function AlertPopup() {
  const { state, text } = useAlert();

  if (text && state) {
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message="Notification"
        open
        autoHideDuration={5000}
        key={text}
      >
        <Alert
          severity={state === 'success' ? 'success' : 'error'}
          sx={{ width: '100%' }}
          key={text}
        >
          {text}
        </Alert>
      </Snackbar>
    );
  }
  return <div />;
}

export default AlertPopup;
