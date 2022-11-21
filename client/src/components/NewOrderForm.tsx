/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  TextField,
  Link,
  Typography,
  Grid,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useAppDispatch } from '../util/redux/hooks';
import { login as loginRedux } from '../util/redux/userSlice';
import FormGrid from './form/FormGrid';
import FormCol from './form/FormCol';
import FormRow from './form/FormRow';
import { emailRegex, InputErrorMessage } from '../util/inputvalidation';
import AlertDialog from './AlertDialog';
import PrimaryButton from './buttons/PrimaryButton';
import ScreenGrid from './ScreenGrid';

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

  console.log(retailItems);

  return (
    <ScreenGrid>
      <FormGrid>
        <FormCol>
          <Grid item container justifyContent="center">
            <Typography variant="h2">New Order Form</Typography>
          </Grid>
          <FormRow>
            <Grid item width=".25">
              <InputLabel id="demo-simple-select-label">Meat</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.meat}
                label="Meat"
                onChange={(e) => setValue('meat', e.target.value as string)}
              >
                <MenuItem value={10}>1</MenuItem>
                <MenuItem value={20}>2</MenuItem>
                <MenuItem value={30}>3</MenuItem>
              </Select>
            </Grid>
            <Grid item width=".7">
              <TextField
                fullWidth
                // error={showError.lastName}
                // helperText={errorMessage.lastName}
                size="small"
                type="text"
                required
                label="Comments"
                onChange={(e) => setValue('lastName', e.target.value)}
              />
            </Grid>
          </FormRow>
          <FormRow>
            <Grid item width=".25">
              <InputLabel id="demo-simple-select-label">Dry Goods</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.dryGoods}
                label="Dry Goods"
                onChange={(e) => setValue('dryGoods', e.target.value)}
              >
                <MenuItem value={10}>1</MenuItem>
                <MenuItem value={20}>2</MenuItem>
                <MenuItem value={30}>3</MenuItem>
              </Select>
            </Grid>
            <Grid item width=".7">
              <TextField
                fullWidth
                // error={showError.lastName}
                // helperText={errorMessage.lastName}
                size="small"
                type="text"
                required
                label="Comments"
                onChange={(e) => setValue('dryGoodsComments', e.target.value)}
              />
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
                <MenuItem value={10}>1</MenuItem>
                <MenuItem value={20}>2</MenuItem>
                <MenuItem value={30}>3</MenuItem>
              </Select>
            </Grid>
            <Grid item width=".7">
              <TextField
                fullWidth
                // error={showError.lastName}
                // helperText={errorMessage.lastName}
                size="small"
                type="text"
                required
                label="Comments"
                onChange={(e) => setValue('produceComments', e.target.value)}
              />
            </Grid>
          </FormRow>
          <FormRow>
            <Grid item width=".25">
              <InputLabel id="demo-simple-select-label">
                Vito Pallets
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.vitoPallets}
                label="Vito Pallets"
                onChange={(e) => setValue('vitoPallets', e.target.value)}
              >
                <MenuItem value={10}>1</MenuItem>
                <MenuItem value={20}>2</MenuItem>
                <MenuItem value={30}>3</MenuItem>
              </Select>
            </Grid>
            <Grid item width=".7">
              <TextField
                fullWidth
                // error={showError.lastName}
                // helperText={errorMessage.lastName}
                size="small"
                type="text"
                required
                label="Comments"
                onChange={(e) => setValue('dryGoodsComments', e.target.value)}
              />
            </Grid>
          </FormRow>
          <FormRow>
            <Grid item container justifyContent="center">
              <Typography>Retail Items</Typography>
            </Grid>
          </FormRow>
          {retailItems.map((item, index) => (
            <FormRow>
              <Grid item width=".2">
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={retailItems[index].name}
                  label="Vito Pallets"
                  onChange={(e) => updateRetailItemName(index, e.target.value)}
                >
                  <MenuItem value={10}>1</MenuItem>
                  <MenuItem value={20}>2</MenuItem>
                  <MenuItem value={30}>3</MenuItem>
                </Select>
              </Grid>
              <Grid item width=".6">
                <TextField
                  fullWidth
                  // error={showError.lastName}
                  // helperText={errorMessage.lastName}
                  size="small"
                  type="text"
                  required
                  label="Comments"
                  onChange={(e) =>
                    updateRetailItemComments(index, e.target.value)
                  }
                />
              </Grid>
              <Grid item width=".2">
                <Button onClick={() => removeRetailItem(index)}>Remove</Button>
              </Grid>
            </FormRow>
          ))}
          <FormRow>
            <Button onClick={addRetailItem}>Add Retail Item</Button>
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
              <DesktopDatePicker
                label="Date desktop"
                inputFormat="MM/DD/YYYY"
                value={date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormRow>
          {/* <Grid item width="1">
            <TextField
              fullWidth
              error={showError.email}
              helperText={errorMessage.email}
              size="small"
              type="text"
              required
              label="Email"
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
            />
          </Grid>
          <FormRow>
            <Grid item width=".5">
              <TextField
                fullWidth
                error={showError.password}
                helperText={errorMessage.password}
                size="small"
                type="password"
                required
                label="Password"
                value={values.password}
                onChange={(e) => setValue('password', e.target.value)}
              />
            </Grid>
            <Grid item container width=".5">
              <TextField
                fullWidth
                error={showError.confirmPassword}
                helperText={errorMessage.confirmPassword}
                size="small"
                type="password"
                required
                label=" Confirm Password"
                value={values.confirmPassword}
                onChange={(e) => setValue('confirmPassword', e.target.value)}
              />
            </Grid>
          </FormRow>
          <Grid item container justifyContent="center">
            <PrimaryButton
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
            >
              Register
            </PrimaryButton>
          </Grid>
          <FormRow>
            <Grid container justifyContent="center">
              <Link component={RouterLink} to="../">
                Back to Login
              </Link>
            </Grid>
          </FormRow> */}
        </FormCol>
        {/* The alert that pops up */}
        {/* <Grid item>
          <AlertDialog
            showAlert={showError.alert}
            title={alertTitle}
            message={errorMessage.alert}
            onClose={handleAlertClose}
          />
        </Grid> */}
      </FormGrid>
    </ScreenGrid>
  );
}

export default NewOrderForm;
