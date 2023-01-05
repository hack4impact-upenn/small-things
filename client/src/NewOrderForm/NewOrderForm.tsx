/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  TextField,
  Typography,
  Grid,
  Select,
  InputLabel,
  MenuItem,
  Button,
  FormControl,
  FormLabel,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from 'react-router-dom';
import FormRow from '../components/form/FormRow';
import ISettings from '../util/types/settings';
import { postData } from '../util/api';
import { IRetailRescueItem } from '../util/types/order';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';

interface Date {
  [key: string]: string[];
}

interface NewOrderFormProps {
  settings: ISettings;
  dates: Date;
}

function NewOrderForm({ settings, dates }: NewOrderFormProps) {
  const defaultValues = {
    meat: 0,
    dryGoods: 0,
    produce: 0,
    vitoPallets: 0,
  };

  const user = useAppSelector(selectUser);

  const [values, setValueState] = useState(defaultValues);
  const [retailItems, setRetailItems] = useState<IRetailRescueItem[]>([]);
  const [orderComments, setOrderComments] = useState('');
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDateChange = (newValue: Dayjs | null) => {
    setDate(newValue);
  };

  const addRetailItem = () => {
    setRetailItems([...retailItems, { item: '', comment: '' }]);
  };

  const removeRetailItem = (index: number) => {
    setRetailItems(retailItems.filter((item, i) => i !== index));
  };

  const updateRetailItemName = (index: number, value: string) => {
    const newRetailItems = [...retailItems];
    newRetailItems[index].item = value;
    setRetailItems(newRetailItems);
  };

  const updateRetailItemComments = (index: number, value: string) => {
    const newRetailItems = [...retailItems];
    newRetailItems[index].comment = value;
    setRetailItems(newRetailItems);
  };

  // Helper functions for changing only one field in a state object
  const setValue = (field: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };

  const submitOrder = () => {
    setLoading(true);
    const order = {
      organization: user.organization,
      produce: { count: values.produce },
      meat: { count: values.meat },
      vito: { count: values.vitoPallets },
      dry: { count: values.dryGoods },
      retailRescue: retailItems,
      comment: orderComments,
      pickup: date,
    };
    postData('order/create', order)
      .then((res) => {
        if (res.error) {
          console.log(res.error.message);
        } else {
          setLoading(false);
          navigate('/home');
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Grid
      container
      sx={{
        paddingTop: '30px',
        paddingBottom: '30px',
      }}
      justifyContent="space-evenly"
      alignItems="center"
      rowSpacing={2}
    >
      <FormControl>
        <Grid item>
          <Typography variant="h2">New Order Form</Typography>
        </Grid>
        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Produce</FormLabel>
          </Grid>
          <Grid item>
            <Select
              value={values.produce}
              autoWidth
              onChange={(e) => setValue('produce', e.target.value as string)}
            >
              {Array.from(Array(settings.maxNumOfProduce + 1).keys()).map(
                (x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ),
              )}
            </Select>
          </Grid>
        </Grid>
        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Dry Goods</FormLabel>
          </Grid>
          <Grid item>
            <Select
              value={values.dryGoods}
              autoWidth
              onChange={(e) => setValue('dryGoods', e.target.value as string)}
            >
              {Array.from(Array(settings.maxNumOfDryGoods + 1).keys()).map(
                (x) => (
                  <MenuItem key={x} value={x}>
                    {x}
                  </MenuItem>
                ),
              )}
            </Select>
          </Grid>
        </Grid>

        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Vito</FormLabel>
          </Grid>
          <Grid item>
            <Select
              value={values.vitoPallets}
              autoWidth
              onChange={(e) =>
                setValue('vitoPallets', e.target.value as string)
              }
            >
              {Array.from(Array(settings.maxNumOfVito + 1).keys()).map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Meat</FormLabel>
          </Grid>
          <Grid item>
            <Select
              value={values.meat}
              autoWidth
              onChange={(e) => setValue('meat', e.target.value as string)}
            >
              {Array.from(Array(settings.maxNumOfMeat + 1).keys()).map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        <FormRow>
          <Grid item container justifyContent="center">
            <FormLabel>Retail Rescue Items</FormLabel>
          </Grid>
        </FormRow>
        {retailItems.map((item, index) => (
          <FormRow>
            <Grid
              spacing={1}
              container
              sx={{
                paddingTop: '10px',
              }}
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid xs={6} item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Retail Rescure Item
                  </InputLabel>
                  <Select
                    label="Retail Rescure Item"
                    value={retailItems[index].item}
                    placeholder="Select"
                    onChange={(e) =>
                      updateRetailItemName(index, e.target.value)
                    }
                  >
                    {settings.retailRescueItems.map((rrItem: string) => (
                      <MenuItem value={rrItem}>{rrItem}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={4} item>
                <TextField
                  fullWidth
                  type="text"
                  label="Comments"
                  onChange={(e) =>
                    updateRetailItemComments(index, e.target.value)
                  }
                />
              </Grid>
              <Grid xs={2} item>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => removeRetailItem(index)}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </FormRow>
        ))}

        <FormRow>
          <Grid
            sx={{
              paddingTop: '10px',
            }}
            item
          >
            <Button variant="contained" onClick={addRetailItem}>
              Add Retail Rescue Item
            </Button>
          </Grid>
        </FormRow>
        <FormRow>
          <Grid item container justifyContent="center">
            <FormLabel>Order Comments</FormLabel>
          </Grid>
        </FormRow>
        <FormRow>
          <Grid item width="1">
            <TextField
              sx={{ width: '40vw' }}
              fullWidth
              id="outlined-multiline-static"
              multiline
              rows={4}
              placeholder="Type order comments here"
              value={orderComments}
              onChange={(e) => setOrderComments(e.target.value)}
            />
          </Grid>
        </FormRow>
        <FormRow>
          <Grid item container justifyContent="center">
            <FormLabel>Pickup</FormLabel>
          </Grid>
        </FormRow>
        <FormRow>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              minDate={dayjs(Object.keys(dates).at(0))}
              maxDate={dayjs(Object.keys(dates).at(-1))}
              label="Schedule Pick-up"
              value={date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
              shouldDisableTime={(timeValue, clockType) => {
                if (clockType === 'minutes' && timeValue % 30) {
                  return true;
                }
                return false;
              }}
            />
          </LocalizationProvider>
        </FormRow>
        <FormRow>
          <Grid item container direction="row" justifyContent="flex-end">
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                onClick={submitOrder}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </FormRow>
      </FormControl>
    </Grid>
  );
}

export default NewOrderForm;
