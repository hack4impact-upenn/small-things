/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  TextField,
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
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import moment from 'moment';
import FormRow from '../components/form/FormRow';
import ISettings from '../util/types/settings';
import { IRetailRescueItem, IOrder } from '../util/types/order';
import useAlert from '../util/hooks/useAlert';
import { weekendTimes, weekTimes } from '../util/constants';

interface Date {
  [key: string]: string[];
}

interface ModifyOrderFormProps {
  settings: ISettings;
  dates: Date;
  order: IOrder;
  handleSave: (order: IOrder | undefined) => void;
  cancel: () => void;
}

function ModifyOrderForm({
  settings,
  order,
  dates,
  handleSave,
  cancel,
}: ModifyOrderFormProps) {
  const originalValues = {
    meat: order.meat,
    dryGoods: order.dry,
    produce: order.produce,
    vitoPallets: order.vito,
  };

  const { setAlert } = useAlert();
  const [values, setValueState] = useState(originalValues);
  const [retailItems, setRetailItems] = useState<IRetailRescueItem[]>(
    order.retailRescue,
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [orderComments, setOrderComments] = useState<string>(order.comment);
  const [date, setDate] = useState<Dayjs | null>(dayjs(order.pickup));
  const [time, setTime] = useState<string>(
    dayjs(order.pickup).format('LT').toString(),
  );
  const [selectedItem, setSelectedItem] = useState(false);

  const canSubmit =
    date !== null &&
    time !== '' &&
    (values.meat !== 0 ||
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

  const removeRetailItem = (index: number) => {
    setRetailItems(retailItems.filter((item, i) => i !== index));
    setSelectedItems(selectedItems.filter((item, i) => i !== index));
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

  const buildOrder = () => {
    if (!date) {
      setAlert('Please select a date', 'error');
      return undefined;
    }
    const formatedTime = moment(time, 'LT');
    const pickup = date
      .set('hour', formatedTime.hour())
      .set('minutes', formatedTime.minute())
      .toDate();

    const modifiedOrder: IOrder = {
      // eslint-disable-next-line no-underscore-dangle
      _id: order._id,
      advanced: order.advanced,
      email: order.email,
      organization: order.organization,
      status: order.status,
      produce: values.produce,
      meat: values.meat,
      vito: values.vitoPallets,
      dry: values.dryGoods,
      retailRescue: retailItems,
      comment: orderComments,
      pickup,
    };
    return modifiedOrder;
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
          <Grid item>
            <FormControl>
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
            </FormControl>
          </Grid>
        </Grid>

        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Vito</FormLabel>
          </Grid>
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
        </Grid>

        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Meat</FormLabel>
          </Grid>
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
        </Grid>
        <FormRow>
          <Grid item container justifyContent="center">
            <FormLabel>Retail Rescue Items</FormLabel>
          </Grid>
        </FormRow>
        {retailItems.map((item, index) => (
          <FormRow key={item.item}>
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
                    {settings.retailRescueItems
                      .filter((rrItem: string) => {
                        return (
                          !selectedItems.includes(rrItem) ||
                          selectedItems[index] === rrItem
                        );
                      })
                      .map((rrItem: string) => {
                        return (
                          <MenuItem key={rrItem} value={rrItem}>
                            {rrItem}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={4} item>
                <FormControl>
                  <TextField
                    value={retailItems[index].comment}
                    fullWidth
                    type="text"
                    label="Comments"
                    onChange={(e) =>
                      updateRetailItemComments(index, e.target.value)
                    }
                  />
                </FormControl>
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
              shouldDisableDate={(day: Dayjs) => day.day() === 0}
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
                      .filter(
                        (pickupTime: string) =>
                          !dates[date.format('M/DD/YYYY').toString()].includes(
                            moment(pickupTime, 'LT').format('LTS'),
                          ) || pickupTime === time,
                      )
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
                          !dates[date.format('M/DD/YYYY').toString()].includes(
                            moment(pickupTime, 'LT').format('LTS'),
                          ) || pickupTime === time,
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
          <Grid
            item
            container
            direction="row"
            justifyContent="flex-end"
            spacing={1}
          >
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleSave(buildOrder())}
                disabled={!canSubmit}
              >
                Save Changes
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="error"
                fullWidth
                onClick={cancel}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </FormRow>
      </FormControl>
    </Grid>
  );
}

export default ModifyOrderForm;
