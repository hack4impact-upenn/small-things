import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Link, Paper } from '@mui/material';
import NewOrderForm from './NewOrderForm';
import ISettings from '../util/types/settings';
import { useData } from '../util/api';
import Logo from '../assets/small-logo.svg';

function NewOrderFormPage() {
  const [settings, setSettings] = useState<ISettings>();
  const [dates, setDates] = useState();

  const currentSettings = useData('admin/settings');
  const currentDates = useData('order/settings/times');
  useEffect(() => {
    setSettings(currentSettings?.data);
    setDates(currentDates?.data);
  }, [currentSettings, currentDates]);

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
            <div style={{ display: 'block' }}>
              <img
                src={Logo}
                alt="logo"
                style={{
                  width: '125px',
                  float: 'right',
                  marginRight: '30px',
                }}
              />
              <Link href="/home"> {'<'} Back to Orders Page</Link>
            </div>
          </Box>
          {!settings || !dates ? (
            <div style={{ width: '0', margin: 'auto' }}>
              <CircularProgress size={80} />
            </div>
          ) : (
            <NewOrderForm settings={settings} dates={dates} />
          )}
        </Paper>
      </Box>
    </div>
  );
}

export default NewOrderFormPage;
