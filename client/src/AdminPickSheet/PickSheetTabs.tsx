import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useAlert from '../util/hooks/useAlert';
import PickSheetTable from './PickSheetTable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
        <Box sx={{}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function AdminOrderTabs() {
  const { setAlert } = useAlert();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
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
      <TabPanel value={value} index={0}>
        <PickSheetTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography>Hello1</Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography>Hello2</Typography>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography>Hello3</Typography>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Typography>Hello4</Typography>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Typography>Hello5</Typography>
      </TabPanel>
    </Box>
  );
}

export default AdminOrderTabs;
