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
    <FormGrid>
      <FormCol>
        <Grid item container justifyContent="center">
          <Typography variant="h2">New Order Form</Typography>
        </Grid>
        <Grid
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          direction="row"
          container
        >
          <Grid xs={2} item>
            <InputLabel id="demo-simple-select-label">Meat</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.meat}
              label="Meat"
              autoWidth
              onChange={(e) => setValue('meat', e.target.value as string)}
            >
              {dropDownOptions}
            </Select>
          </Grid>
        </Grid>
        <FormRow>
          <Grid xs={2} item>
            <InputLabel id="demo-simple-select-label">Dry Goods</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.dryGoods}
              label="Dry Goods"
              onChange={(e) => setValue('dryGoods', e.target.value)}
            >
              {dropDownOptions}
            </Select>
          </Grid>
        </FormRow>
        <FormRow>
          <Grid item width=".25">
            <InputLabel id="demo-simple-select-label">Produce</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.produce}
              label="Produce"
              onChange={(e) => setValue('produce', e.target.value)}
            >
              {dropDownOptions}
            </Select>
          </Grid>
        </FormRow>
        <FormRow>
          <Grid item>
            <InputLabel id="demo-simple-select-label">Vito</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.vitoPallets}
              label="Vito Pallets"
              onChange={(e) => setValue('vitoPallets', e.target.value)}
            >
              {dropDownOptions}
            </Select>
          </Grid>
        </FormRow>
        <FormRow>
          <Grid item container justifyContent="center">
            <Typography>Retail Rescue Items</Typography>
          </Grid>
        </FormRow>
        {retailItems.map((item, index) => (
          <FormRow>
            <Grid
              spacing={1}
              container
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid xs={6} item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Retail Rescure Item
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
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
                  size="medium"
                  type="text"
                  label="Comments"
                  onChange={(e) =>
                    updateRetailItemComments(index, e.target.value)
                  }
                />
              </Grid>
              <Grid xs={2} item>
                <Button
                  size="large"
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
          <Button onClick={addRetailItem}>Add Retail Rescue Item</Button>
        </FormRow>
        <FormRow>
          <Grid item container justifyContent="center">
            <Typography>Order Comments</Typography>
          </Grid>
        </FormRow>
        <FormRow>
          <Grid item width="1">
            <TextField
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
            <Typography>Pickup</Typography>
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
          <Grid>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </FormRow>
      </FormCol>
    </FormGrid>
  );
}

export default NewOrderForm;
