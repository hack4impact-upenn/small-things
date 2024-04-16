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
  TextFieldProps,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import FormRow from '../components/form/FormRow';
import ISettings from '../util/types/settings';
import { postData } from '../util/api';
import { IRetailRescueItem } from '../util/types/order';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import useAlert from '../util/hooks/useAlert';
import { weekendTimes, weekTimes } from '../util/constants';
import LineItem from './LineItem';

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
  const { setAlert } = useAlert();

  const [values, setValueState] = useState(defaultValues);
  const [retailItems, setRetailItems] = useState<IRetailRescueItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [orderComments, setOrderComments] = useState<string>('');
  const [date, setDate] = useState<Dayjs | null>(null);
  const [time, setTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);
  const navigate = useNavigate();
  const [dryGoods, setDryGoods] = useState<IRetailRescueItem[]>([]);
  const [meat, setMeat] = useState<IRetailRescueItem[]>([]);
  const [vito, setVito] = useState<IRetailRescueItem[]>([]);

  const canSubmit =
    date !== null &&
    time !== '' &&
    (values.meat !== 0 ||
      meat.length > 0 ||
      dryGoods.length > 0 ||
      vito.length > 0 ||
      values.dryGoods !== 0 ||
      values.produce !== 0 ||
      values.vitoPallets !== 0 ||
      (retailItems.length > 0 && retailItems[0].item !== ''));

  const handleDateChange = (newValue: Dayjs | null) => {
    setDate(newValue);
  };

  const addRetailItem = () => {
    setRetailItems([...retailItems, { item: '', comment: '' }]);
    setSelectedItem(true);
  };

  const addDryGoodsItem = () => {
    setDryGoods([...dryGoods, { item: '', comment: '' }]);
  };

  const addVitoItem = () => {
    setVito([...vito, { item: '', comment: '' }]);
  };

  const addMeatItem = () => {
    setMeat([...meat, { item: '', comment: '' }]);
  };

  const removeRetailItem = (index: number) => {
    setRetailItems(retailItems.filter((item, i) => i !== index));
    setSelectedItems(selectedItems.filter((item, i) => i !== index));
  };

  const removeDryGoodItem = (index: number) => {
    setDryGoods(dryGoods.filter((item, i) => i !== index));
  };

  const removeVitoItem = (index: number) => {
    setVito(vito.filter((item, i) => i !== index));
  };

  const removeMeatItem = (index: number) => {
    setMeat(meat.filter((item, i) => i !== index));
  };

  const updateRetailItemName = (index: number, value: string) => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index] = value;
    setSelectedItems(newSelectedItems);
    const newRetailItems = [...retailItems];
    newRetailItems[index].item = value;
    setSelectedItem(false);
    setRetailItems(newRetailItems);
  };

  const updateVitoSelection = (index: number, value: string) => {
    const newSelectedItems = [...vito];
    newSelectedItems[index].item = value;
    setVito(newSelectedItems);
  };

  const updateDryGoodSelection = (index: number, value: string) => {
    const newSelectedDryGoods = [...dryGoods];
    newSelectedDryGoods[index].item = value;
    setDryGoods(newSelectedDryGoods);
  };

  const updateMeatSelection = (index: number, value: string) => {
    const newSelectedItems = [...meat];
    newSelectedItems[index].item = value;
    setMeat(newSelectedItems);
  };

  const updateRetailItemComments = (index: number, value: string) => {
    const newRetailItems = [...retailItems];
    newRetailItems[index].comment = value;
    setRetailItems(newRetailItems);
  };

  const updateDryGoodComment = (index: number, value: string) => {
    const newSelectedItems = [...dryGoods];
    newSelectedItems[index].comment = value;
    setDryGoods(newSelectedItems);
  };

  const updateVitoComment = (index: number, value: string) => {
    const newSelectedItems = [...vito];
    newSelectedItems[index].comment = value;
    setVito(newSelectedItems);
  };

  const updateMeatComment = (index: number, value: string) => {
    const newSelectedItems = [...meat];
    newSelectedItems[index].comment = value;
    setMeat(newSelectedItems);
  };

  // Helper functions for changing only one field in a state object
  const setValue = (field: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };

  const submitOrder = () => {
    if (!date) {
      setAlert('Please choose a date.', 'error');
      return;
    }
    const formatedTime = moment(time, 'LT');
    const pickup = date
      .set('hour', formatedTime.hour())
      .set('minutes', formatedTime.minute());

    const order = {
      email: user.email,
      advanced: settings.advanced,
      organization: user.organization,
      produce: values.produce,
      meat: settings.advanced ? meat : values.meat,
      vito: settings.advanced ? vito : values.vitoPallets,
      dry: settings.advanced ? dryGoods : values.dryGoods,
      retailRescue: retailItems,
      comment: orderComments,
      pickup,
    };
    setLoading(true);
    postData('order/create', order)
      .then((res) => {
        if (res.error) {
          setLoading(false);
          setAlert(res.error.message, 'error');
        } else {
          setLoading(false);
          setAlert('Order Created', 'success');
          navigate('/home');
        }
      })
      .catch((error) => setAlert(error, 'error'));
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
            <FormControl>
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
            </FormControl>
          </Grid>
        </Grid>

        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Dry Goods</FormLabel>
          </Grid>
          {settings.advanced ? (
            <div>
              {dryGoods.map((dryGood: IRetailRescueItem, index: number) => (
                <LineItem
                  key={dryGood.item}
                  item={dryGood.item}
                  updateSelection={updateDryGoodSelection}
                  updateComment={updateDryGoodComment}
                  index={index}
                  removeItem={removeDryGoodItem}
                  options={settings.dryGoodOptions}
                  selectedItems={dryGoods.map((item) => item.item)}
                />
              ))}
              <FormRow>
                <Grid
                  sx={{
                    paddingTop: '10px',
                  }}
                  item
                >
                  <Button
                    variant="contained"
                    onClick={addDryGoodsItem}
                    disabled={
                      dryGoods.length === settings.dryGoodOptions.length ||
                      dryGoods.some((item) => item.item === '')
                    }
                  >
                    Add Dry Good Item
                  </Button>
                </Grid>
              </FormRow>
            </div>
          ) : (
            <Grid item>
              <FormControl>
                <Select
                  value={values.dryGoods}
                  autoWidth
                  onChange={(e) =>
                    setValue('dryGoods', e.target.value as string)
                  }
                >
                  {Array.from(Array(settings.maxNumOfDryGoods + 1).keys()).map(
                    (x) => (
                      <MenuItem key={x} value={x}>
                        {x}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>

        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Vito</FormLabel>
          </Grid>
          {settings.advanced ? (
            <div>
              {vito.map((vitoOption: IRetailRescueItem, index: number) => (
                <LineItem
                  key={vitoOption.item}
                  item={vitoOption.item}
                  updateSelection={updateVitoSelection}
                  updateComment={updateVitoComment}
                  index={index}
                  removeItem={removeVitoItem}
                  options={settings.vitoOptions}
                  selectedItems={vito.map((item) => item.item)}
                />
              ))}
              <FormRow>
                <Grid
                  sx={{
                    paddingTop: '10px',
                  }}
                  item
                >
                  <Button
                    variant="contained"
                    onClick={addVitoItem}
                    disabled={
                      vito.length === settings.vitoOptions.length ||
                      vito.some((item) => item.item === '')
                    }
                  >
                    Add Vito Item
                  </Button>
                </Grid>
              </FormRow>
            </div>
          ) : (
            <Grid item>
              <FormControl>
                <Select
                  value={values.vitoPallets}
                  autoWidth
                  onChange={(e) =>
                    setValue('vitoPallets', e.target.value as string)
                  }
                >
                  {Array.from(Array(settings.maxNumOfVito + 1).keys()).map(
                    (x) => (
                      <MenuItem key={x} value={x}>
                        {x}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>

        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Meat</FormLabel>
          </Grid>
          {settings.advanced ? (
            <div>
              {meat.map((meatOption: IRetailRescueItem, index: number) => (
                <LineItem
                  key={meatOption.item}
                  item={meatOption.item}
                  updateSelection={updateMeatSelection}
                  updateComment={updateMeatComment}
                  index={index}
                  removeItem={removeMeatItem}
                  options={settings.meatOptions}
                  selectedItems={meat.map((item) => item.item)}
                />
              ))}
              <FormRow>
                <Grid
                  sx={{
                    paddingTop: '10px',
                  }}
                  item
                >
                  <Button
                    variant="contained"
                    onClick={addMeatItem}
                    disabled={
                      meat.length === settings.meatOptions.length ||
                      meat.some((item) => item.item === '')
                    }
                  >
                    Add Meat Item
                  </Button>
                </Grid>
              </FormRow>
            </div>
          ) : (
            <Grid item>
              <FormControl>
                <Select
                  value={values.meat}
                  autoWidth
                  onChange={(e) => setValue('meat', e.target.value as string)}
                >
                  {Array.from(Array(settings.maxNumOfMeat + 1).keys()).map(
                    (x) => (
                      <MenuItem key={x} value={x}>
                        {x}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
        <FormRow>
          <Grid item container justifyContent="center">
            <FormLabel>Retail Rescue Items</FormLabel>
          </Grid>
        </FormRow>
        {retailItems.map((item, index) => (
          <LineItem
            item={item.item}
            updateSelection={updateRetailItemName}
            updateComment={updateRetailItemComments}
            index={index}
            removeItem={removeRetailItem}
            options={settings.retailRescueItems}
            selectedItems={selectedItems}
          />
        ))}

        <FormRow>
          <Grid
            sx={{
              paddingTop: '10px',
            }}
            item
          >
            <Button
              variant="contained"
              onClick={addRetailItem}
              disabled={
                selectedItem ||
                selectedItems.length === settings.retailRescueItems.length
              }
            >
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
            <DesktopDatePicker
              label="Pick-up Date"
              value={date}
              onChange={handleDateChange}
              renderInput={(params: TextFieldProps) => (
                <TextField {...params} />
              )}
              minDate={dayjs(Object.keys(dates).at(0))}
              maxDate={dayjs(Object.keys(dates).at(-1))}
              shouldDisableDate={(day: Dayjs) =>
                day.day() <= 1 ||
                settings.disabledDates.some((disabledDate) =>
                  dayjs(disabledDate).isSame(day),
                )
              }
            />
          </LocalizationProvider>
        </FormRow>
        {date && (
          <>
            <FormRow>
              <Grid item container justifyContent="center">
                <FormLabel>Pickup Time</FormLabel>
              </Grid>
            </FormRow>
            <FormRow>
              <FormControl fullWidth>
                <InputLabel id="pickup-time-select-label">
                  Pick-up Time
                </InputLabel>
                {date.day() === 6 ? (
                  <Select
                    label="Pick-up Time"
                    labelId="pickup-time-select-label"
                    id="pickup-time-select"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    {weekendTimes
                      .filter((pickupTime: string) => {
                        return !dates[
                          date.format('M/D/YYYY').toString()
                        ].includes(moment(pickupTime, 'LT').format('LTS'));
                      })
                      .map((pickupTime: string) => (
                        <MenuItem key={pickupTime} value={pickupTime}>
                          {pickupTime}
                        </MenuItem>
                      ))}
                  </Select>
                ) : (
                  <Select
                    label="Pick-up Time"
                    labelId="pickup-time-select-label"
                    id="pickup-time-select"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    {weekTimes
                      .filter(
                        (pickupTime: string) =>
                          !dates[date.format('M/D/YYYY').toString()].includes(
                            moment(pickupTime, 'LT').format('LTS'),
                          ),
                      )
                      .map((pickupTime: string) => (
                        <MenuItem key={pickupTime} value={pickupTime}>
                          {pickupTime}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              </FormControl>
            </FormRow>
          </>
        )}
        <FormRow>
          <Grid item container direction="row" justifyContent="flex-end">
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                onClick={submitOrder}
                disabled={!canSubmit || loading}
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
