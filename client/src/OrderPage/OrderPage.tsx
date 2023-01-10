import React, { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Paper,
  Box,
  Button,
  Link,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack } from '@mui/system';
import { putData, useData } from '../util/api';
import { IOrder } from '../util/types/order';
import Navbar from '../components/NavBar';
import { selectUser } from '../util/redux/userSlice';
import { useAppSelector } from '../util/redux/hooks';
import ModifyOrderForm from './ModifyOrderForm';
import ISettings from '../util/types/settings';
import useAlert from '../util/hooks/useAlert';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function OrderPage() {
  const defaultOrder: IOrder = {
    _id: '',
    organization: '',
    produce: {
      count: 0,
    },
    meat: {
      count: 0,
    },
    vito: {
      count: 0,
    },
    dry: {
      count: 0,
    },
    retailRescue: [],
    status: '',
    comment: '',
    pickup: new Date(),
  };

  const { id } = useParams();
  const { admin } = useAppSelector(selectUser);

  const [order, setOrder] = useState<IOrder>(defaultOrder);
  const [isLoading, setLoading] = useState(true);
  const [isModifying, setModifying] = useState(false);
  const [settings, setSettings] = useState<ISettings>();
  const [dates, setDates] = useState();
  const { setAlert } = useAlert();
  const navigate = useNavigate();

  const handleCancel = () => {
    putData(`order/${id}/reject`, { organization: order.organization })
      .then((res) => {
        if (res.error) {
          setAlert(res.error.message, 'error');
        } else {
          setLoading(false);
          setAlert('Order Cancled', 'success');
          navigate('/home');
        }
      })
      .catch((error) => setAlert(error, 'error'));
  };

  const handleModification = (newOrder: IOrder | undefined) => {
    console.log(newOrder);
    setLoading(true);
    // eslint-disable-next-line no-underscore-dangle
    putData(`order/${order._id}/modify`, newOrder)
      .then((res) => {
        if (res.error) {
          setAlert(res.error.message, 'error');
        } else {
          setLoading(false);
          if (newOrder) {
            setOrder(newOrder);
          }
          setAlert('Order Modifed', 'success');
          setModifying(false);
        }
      })
      .catch((error) => setAlert(error, 'error'));
  };

  const currentOrder = useData(`order/${id}`);
  const currentSettings = useData('admin/settings');
  const currentDates = useData('order/settings/times');

  useEffect(() => {
    if (currentOrder) {
      setOrder(currentOrder?.data);
      setSettings(currentSettings?.data);
      setLoading(false);
    }
    if (currentDates) {
      setDates(currentDates?.data);
    }
  }, [currentOrder, currentSettings, currentDates]);

  if (isLoading) {
    <div style={{ width: '0', margin: 'auto' }}>
      <CircularProgress size={80} />
    </div>;
  }

  if (!order || !settings) {
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
  }
  const pickUpDate = new Date(order.pickup);
  return (
    <div style={{ backgroundColor: '#D9D9D9', minHeight: '100vh' }}>
      {admin && <Navbar />}
      <Box
        sx={{
          paddingTop: '5vh',
          paddingBottom: '10px',
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
              padding: '20px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link href="/home">{'<'} Back to Orders</Link>
            <Typography variant="h5">Order Information</Typography>
            <Typography variant="h6">Organization:</Typography>
            <Typography variant="body1">{order.organization}</Typography>
            <Typography variant="h6">Order Status:</Typography>
            <Typography variant="body1">{order.status}</Typography>
            <Box
              sx={{
                paddingTop: '20px',
              }}
            >
              <Typography variant="h5">Order Details:</Typography>
              {isModifying && dates && settings && order ? (
                <ModifyOrderForm
                  order={order}
                  settings={settings}
                  dates={dates}
                  handelSave={handleModification}
                  cancel={() => setModifying(false)}
                />
              ) : (
                <>
                  <Typography variant="h6">Produce:</Typography>
                  <Typography variant="body1">{order.produce.count}</Typography>

                  <Typography variant="h6">Dry Goods:</Typography>
                  <Typography variant="body1">{order.dry.count}</Typography>

                  <Typography variant="h6">Vito:</Typography>
                  <Typography variant="body1">{order.vito.count}</Typography>

                  <Typography variant="h6">Meat:</Typography>
                  <Typography variant="body1">{order.meat.count}</Typography>

                  <Typography variant="h6">Retail Rescue Items:</Typography>
                  {order.retailRescue.map((item) => (
                    <Typography variant="body1" key={item.item}>
                      {item.item} {item.comment ? `- ${item.comment}` : ''}
                    </Typography>
                  ))}
                  <Typography variant="h6">Order Comments:</Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      paddingBottom: '30px',
                    }}
                  >
                    {order.comment}
                  </Typography>
                  <Typography variant="h6">Scheduled Pick-up:</Typography>
                  <Typography variant="body1">
                    {pickUpDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                    })}
                    {', '}
                    {pickUpDate.toLocaleDateString()} at{' '}
                    {pickUpDate.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                  <Box sx={{ marginTop: '15px' }}>
                    <Stack spacing={2} direction="row">
                      {admin && <Button variant="contained">Approve</Button>}
                      {admin ? (
                        <>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setModifying(true)}
                          >
                            Modify
                          </Button>
                          <Button variant="contained" color="error">
                            Reject
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setModifying(true)}
                          >
                            Modify Order
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={handleCancel}
                          >
                            Cancel Order
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

export default OrderPage;
