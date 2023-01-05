/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AdminOrderTable from '../components/AdminOrderTable';
import { IOrder } from '../util/types/order';
import { useData } from '../util/api';
import useAlert from '../util/hooks/useAlert';
import { CircularProgress } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `order-tab-${index}`,
    'aria-controls': `order-tabpanel-${index}`,
  };
}

function AdminOrderTabs() {
  const { setAlert } = useAlert();
  const [value, setValue] = useState(0);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const allOrders = useData('order/all');
  useEffect(() => {
    if (allOrders?.data) {
      setLoading(false);
      setOrders(allOrders?.data);
    }
    if (allOrders?.error) {
      setAlert('Could not fetch orders', 'error');
    }
  }, [allOrders]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return loading ? (
    <CircularProgress size={80} />
  ) : (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="order tabs"
          centered
        >
          <Tab label="Pending" {...a11yProps(0)} />
          <Tab label="Approved" {...a11yProps(1)} />
          <Tab label="Released" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AdminOrderTable
          orders={orders.filter((order) => order.status === 'PENDING')}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AdminOrderTable
          orders={orders.filter((order) => order.status === 'APPROVED')}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AdminOrderTable
          orders={orders.filter((order) => order.status === 'RELEASED')}
        />
      </TabPanel>
    </Box>
  );
}

export default AdminOrderTabs;
