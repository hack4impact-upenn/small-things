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
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAppDispatch } from '../util/redux/hooks';
import { login as loginRedux } from '../util/redux/userSlice';
import FormGrid from './form/FormGrid';
import FormCol from './form/FormCol';
import FormRow from './form/FormRow';
import { emailRegex, InputErrorMessage } from '../util/inputvalidation';
import AlertDialog from './AlertDialog';
import PrimaryButton from './buttons/PrimaryButton';
import ScreenGrid from './ScreenGrid';

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

  // Helper functions for changing only one field in a state object
  const setValue = (field: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };

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
