import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Paper } from '@mui/material';
import Navbar from '../components/NavBar';
import AdminSettingsForm from './AdminSettingsForm';
import { useData } from '../util/api';
import ISettings from '../util/types/settings';

/**
 * A page only accessible to admins that displays a control panel allowing
 * Admins to change the integer number of max pallets for dry goods, produce,
 * vito boxes, and meat, as well as the lead time of orders and the list of
 * retail rescue items.
 */

function AdminSettingsPage() {
  const [settings, setSettings] = useState<ISettings>();
  const currentSettings = useData('admin/settings');
  useEffect(() => {
    setSettings(currentSettings?.data);
  }, [currentSettings]);
  return (
    <div style={{ backgroundColor: '#D9D9D9' }}>
      <Navbar />
      <Box
        sx={{
          marginTop: '5vh',
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
          {!settings ? (
            <div style={{ width: '0', margin: 'auto' }}>
              <CircularProgress size={80} />
            </div>
          ) : (
            <AdminSettingsForm settings={settings} />
          )}
        </Paper>
      </Box>
    </div>
  );
}

export default AdminSettingsPage;
