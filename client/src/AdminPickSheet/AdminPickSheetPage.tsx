import React, { useState, useEffect, useRef } from 'react';
import { Typography, Grid, Box, Paper, Button } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import ScreenGrid from '../components/ScreenGrid';
import Navbar from '../components/NavBar';
import PickSheetTabs from './PickSheetTabs';
import WeekPicker from '../components/WeekPicker';
import { postData } from '../util/api';
import useAlert from '../util/hooks/useAlert';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function AdminPickSheetPage() {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const [weekOfOrders, setWeekOfOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setAlert } = useAlert();
  const handleDateChange = (newDate: Dayjs) => {
    setSelectedDate(newDate.day(1));
  };

  useEffect(() => {
    setIsLoading(true);
    postData('order/picksheet', {
      startDate: selectedDate.startOf('date'),
      endDate: selectedDate.add(7, 'day').endOf('date'),
    })
      .then((resp) => {
        setIsLoading(false);
        setWeekOfOrders(resp.data);
      })
      .catch((error) => setAlert(error.message, 'error'));
  }, [selectedDate, setAlert]);

  return (
    <div style={{ backgroundColor: '#D9D9D9' }}>
      <Navbar />
      <ScreenGrid>
        <Box
          sx={{
            paddingBottom: '20px',
            minHeight: '80vh',
          }}
        >
          <Paper
            sx={{
              margin: 'auto',
              borderRadius: '25px',
              minHeight: '70vh',
              padding: '5vw',
            }}
          >
            <Grid item>
              <Typography variant="h2">Pick Sheets</Typography>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <WeekPicker
                  selectedDate={selectedDate}
                  updateDate={handleDateChange}
                />
              </Grid>
              <Grid item>
                <Button
                  onClick={handlePrint}
                  variant="contained"
                  endIcon={<PrintIcon />}
                >
                  Print
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <div style={{ height: '60vh', width: '60vw' }}>
                <PickSheetTabs
                  ref={componentRef}
                  loading={isLoading}
                  orders={weekOfOrders}
                />
              </div>
            </Grid>
          </Paper>
        </Box>
      </ScreenGrid>
    </div>
  );
}

export default AdminPickSheetPage;
