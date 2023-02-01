import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import PickSheetTable from './PickSheetTable';
import { IOrder } from '../util/types/order';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface PickSheetTabProps {
  orders: IOrder[];
  loading: boolean;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const AdminOrderTabs = React.forwardRef(
  ({ orders, loading }: PickSheetTabProps, ref) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    return (
      <Box ref={ref} sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="order tabs">
            <Tab label="Monday" id="order-tab-1" value={0} />
            <Tab label="Tuesday" id="order-tab-2" value={1} />
            <Tab label="Wednesday" id="order-tab-3" value={2} />
            <Tab label="Thursday" id="order-tab-3" value={3} />
            <Tab label="Friday" id="order-tab-3" value={4} />
            <Tab label="Saturday" id="order-tab-3" value={5} />
          </Tabs>
        </Box>
        {loading ? (
          <div style={{ width: '0', margin: 'auto' }}>
            <CircularProgress size={80} />
          </div>
        ) : (
          <>
            <TabPanel value={value} index={0}>
              <PickSheetTable
                orders={orders.filter(
                  (order: IOrder) => dayjs(order.pickup).day() === 1,
                )}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <PickSheetTable
                orders={orders.filter(
                  (order: IOrder) => dayjs(order.pickup).day() === 2,
                )}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <PickSheetTable
                orders={orders.filter(
                  (order: IOrder) => dayjs(order.pickup).day() === 3,
                )}
              />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <PickSheetTable
                orders={orders.filter(
                  (order: IOrder) => dayjs(order.pickup).day() === 4,
                )}
              />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <PickSheetTable
                orders={orders.filter(
                  (order: IOrder) => dayjs(order.pickup).day() === 5,
                )}
              />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <PickSheetTable
                orders={orders.filter(
                  (order: IOrder) => dayjs(order.pickup).day() === 6,
                )}
              />
            </TabPanel>
          </>
        )}
      </Box>
    );
  },
);

export default AdminOrderTabs;
