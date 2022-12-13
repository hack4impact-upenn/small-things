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
import FormGrid from '../components/form/FormGrid';
import FormCol from '../components/form/FormCol';
import FormRow from '../components/form/FormRow';

interface RetailItem {
  name: string;
  comments: string;
}

function NewOrderForm() {
  const defaultValues = {
    meat: '',
    meatComments: '',
    dryGoods: '',
    dryGoodsComments: '',
    produce: '',
    produceComments: '',
    vitoPallets: '',
    vitoPalletsComments: '',
  };

  const [values, setValueState] = useState(defaultValues);

  const [retailItems, setRetailItems] = useState<RetailItem[]>([]);

  const [orderComments, setOrderComments] = useState('');

  const [date, setDate] = React.useState<Dayjs | null>(dayjs());

  const handleDateChange = (newValue: Dayjs | null) => {
    setDate(newValue);
  };

  const addRetailItem = () => {
    setRetailItems([...retailItems, { name: '', comments: '' }]);
  };

  const removeRetailItem = (index: number) => {
    setRetailItems(retailItems.filter((item, i) => i !== index));
  };

  const updateRetailItemName = (index: number, value: string) => {
    const newRetailItems = [...retailItems];
    newRetailItems[index].name = value;
    setRetailItems(newRetailItems);
  };

  const updateRetailItemComments = (index: number, value: string) => {
    const newRetailItems = [...retailItems];
    newRetailItems[index].comments = value;
    setRetailItems(newRetailItems);
  };

  // Helper functions for changing only one field in a state object
  const setValue = (field: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };

  const MAX_ITEM = 5;

  const dropDownOptions = Array.from(Array(MAX_ITEM + 1).keys()).map((x) => (
    <MenuItem key={x} value={x}>
      {x}
    </MenuItem>
  ));

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
              {dropDownOptions}
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
              {dropDownOptions}
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
              {dropDownOptions}
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
              {dropDownOptions}
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
                    value={retailItems[index].name}
                    placeholder="Select"
                    onChange={(e) =>
                      updateRetailItemName(index, e.target.value)
                    }
                  >
                    <MenuItem value={10}>Dairy</MenuItem>
                    <MenuItem value={20}>Cereal</MenuItem>
                    <MenuItem value={30}>Cleaning Products</MenuItem>
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
              label="Schedule Pick-up"
              value={date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
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
