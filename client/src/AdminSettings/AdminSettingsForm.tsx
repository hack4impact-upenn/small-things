/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Typography,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormHelperText,
  Grid,
  Button,
  FormLabel,
  TextField,
  TextFieldProps,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  DesktopDatePicker,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import RetailRescueItems from './RetailRescueItems';
import ISettings from '../util/types/settings';
import { putData } from '../util/api';
import useAlert from '../util/hooks/useAlert';

const SETTING_MAXIMUMS = {
  dryGoods: 10,
  produce: 10,
  vito: 10,
  meat: 10,
  leadTime: 10,
};

interface SettingsFormProp {
  settings: ISettings;
}

function AdminSettingsForm({ settings }: SettingsFormProp) {
  const { setAlert } = useAlert();

  const [advancedSettings, setAdvancedSettings] = React.useState(
    settings.advanced,
  );
  const [dryGoodsMax, setDryGoodsMax] = React.useState(settings.maxNumOfVito);
  const [dryGoodsAdvanced, setDryGoodsAdvanced] = React.useState<string[]>(
    settings.dryGoodOptions,
  );
  const [produceMax, setProduceMax] = React.useState(settings.maxNumOfProduce);
  const [vitoMax, setVitoMax] = React.useState(settings.maxNumOfVito);
  const [vitoAdvanced, setVitoAdvanced] = React.useState<string[]>(
    settings.vitoOptions,
  );
  const [meatMax, setMeatMax] = React.useState(settings.maxNumOfMeat);
  const [meatAdvanced, setMeatAdvanced] = React.useState<string[]>(
    settings.meatOptions,
  );
  const [leadTime, setLeadTime] = React.useState(settings.leadTime);
  const [rescueItems, setRescueItems] = React.useState<string[]>(
    settings.retailRescueItems,
  );
  const [loading, setLoading] = React.useState(false);
  const [disabledDates, setDisabledDates] = useState(settings.disabledDates);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const handleDryGoodsChange = (event: SelectChangeEvent) => {
    setDryGoodsMax(Number(event.target.value));
  };

  const handleProduceChange = (event: SelectChangeEvent) => {
    setProduceMax(Number(event.target.value));
  };

  const handleVitoChange = (event: SelectChangeEvent) => {
    setVitoMax(Number(event.target.value));
  };

  const handleMeatChange = (event: SelectChangeEvent) => {
    setMeatMax(Number(event.target.value));
  };

  const handleLeadTimeChange = (event: SelectChangeEvent) => {
    setLeadTime(Number(event.target.value));
  };

  const dateDisabled = (date: Date) => {
    return disabledDates.some((disabledDate: Date) => {
      const disabledDateFormated = new Date(disabledDate);
      return disabledDateFormated.getTime() === date.getTime();
    });
  };

  const handleDisableDate = () => {
    if (selectedDate && !dateDisabled(selectedDate.toDate())) {
      const newDisabledDates = disabledDates;
      newDisabledDates.push(selectedDate.toDate());
      setDisabledDates(newDisabledDates);
      setSelectedDate(null);
      setAlert('Date disabled, make sure to save.', 'success');
    } else {
      setAlert('Please select a date to disable', 'error');
    }
  };

  const handleEnableDate = () => {
    if (selectedDate && dateDisabled(selectedDate.toDate())) {
      const newDisabledDates = disabledDates.filter((disabledDate: Date) => {
        const disabledDateFormated = new Date(disabledDate);
        return (
          disabledDateFormated.getTime() !== selectedDate.toDate().getTime()
        );
      });
      setDisabledDates(newDisabledDates);
      setSelectedDate(null);
      setAlert('Date enabled, make sure to save.', 'success');
    } else {
      setAlert('Please Select a date to enable', 'error');
    }
  };

  const handleSave = () => {
    setLoading(true);
    const newSettings: ISettings = {
      maxNumOfMeat: meatMax,
      maxNumOfProduce: produceMax,
      maxNumOfVito: vitoMax,
      maxNumOfDryGoods: dryGoodsMax,
      leadTime,
      retailRescueItems: rescueItems,
      advanced: advancedSettings,
      dryGoodOptions: dryGoodsAdvanced,
      vitoOptions: vitoAdvanced,
      meatOptions: meatAdvanced,
      disabledDates,
    };
    putData('admin/settings', newSettings).then((res) => {
      if (res.error) {
        setAlert(res.error.message, 'error');
      } else {
        setAlert('Settings saved', 'success');
      }
      setLoading(false);
    });
  };

  return (
    <Grid
      item
      container
      sx={{
        overflow: 'flex',
        paddingTop: '30px',
        paddingBottom: '30px',
      }}
      justifyContent="space-evenly"
      alignItems="center"
    >
      <FormControl>
        <Grid item>
          <Typography variant="h2">Admin Settings</Typography>
        </Grid>
        <Grid item>
          <FormLabel>Ordering Type</FormLabel>
          <RadioGroup
            value={advancedSettings ? 'advanced' : 'basic'}
            onChange={() => setAdvancedSettings(!advancedSettings)}
          >
            <FormControlLabel value="basic" control={<Radio />} label="Basic" />
            <FormControlLabel
              value="advanced"
              control={<Radio />}
              label="Advanced"
            />
          </RadioGroup>
        </Grid>
        <Grid item>
          <Typography variant="h2">Order Maximums</Typography>
        </Grid>
        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Produce</FormLabel>
          </Grid>
          <Grid item>
            <FormControl>
              <Select
                labelId="select-small"
                id="select-small"
                value={String(produceMax)}
                onChange={handleProduceChange}
              >
                {Array.from(Array(SETTING_MAXIMUMS.produce + 1).keys()).map(
                  (x) => (
                    <MenuItem value={x}>{x}</MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
            <FormHelperText>Maximum Pallets</FormHelperText>
          </Grid>
          <Grid container item direction="column">
            <Grid item>
              <FormLabel>Dry Goods</FormLabel>
            </Grid>
            {!advancedSettings ? (
              <Grid item>
                <FormControl>
                  <Select
                    labelId="select-small"
                    id="select-small"
                    value={String(dryGoodsMax)}
                    onChange={handleDryGoodsChange}
                  >
                    {Array.from(
                      Array(SETTING_MAXIMUMS.dryGoods + 1).keys(),
                    ).map((x) => (
                      <MenuItem value={x}>{x}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormHelperText>Maximum Pallets</FormHelperText>
              </Grid>
            ) : (
              <Grid item>
                <RetailRescueItems
                  itemArray={dryGoodsAdvanced}
                  parentCallback={setDryGoodsAdvanced}
                />
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Vito</FormLabel>
          </Grid>
          {!advancedSettings ? (
            <Grid item>
              <FormControl>
                <Select
                  labelId="select-small"
                  id="select-small"
                  value={String(vitoMax)}
                  onChange={handleVitoChange}
                >
                  {Array.from(Array(SETTING_MAXIMUMS.vito + 1).keys()).map(
                    (x) => (
                      <MenuItem value={x}>{x}</MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
              <FormHelperText>Maximum Pallets</FormHelperText>
            </Grid>
          ) : (
            <Grid item>
              <RetailRescueItems
                itemArray={vitoAdvanced}
                parentCallback={setVitoAdvanced}
              />
            </Grid>
          )}
        </Grid>

        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Meat</FormLabel>
          </Grid>
          {!advancedSettings ? (
            <Grid item>
              <FormControl>
                <Select
                  labelId="select-small"
                  id="select-small"
                  value={String(meatMax)}
                  onChange={handleMeatChange}
                >
                  {Array.from(Array(SETTING_MAXIMUMS.meat + 1).keys()).map(
                    (x) => (
                      <MenuItem value={x}>{x}</MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
              <FormHelperText>Maximum Pallets</FormHelperText>
            </Grid>
          ) : (
            <Grid item>
              <RetailRescueItems
                itemArray={meatAdvanced}
                parentCallback={setMeatAdvanced}
              />
            </Grid>
          )}
        </Grid>

        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Lead Time</FormLabel>
          </Grid>
          <Grid item>
            <Select
              labelId="lead-time-label"
              id="lead-time-select"
              value={String(leadTime)}
              onChange={handleLeadTimeChange}
            >
              {Array.from(Array(SETTING_MAXIMUMS.leadTime + 1).keys()).map(
                (x) => (
                  <MenuItem value={x}>{x}</MenuItem>
                ),
              )}
            </Select>
            <FormHelperText>Days</FormHelperText>
          </Grid>
        </Grid>
        <Grid item container direction="column">
          <Grid item>
            <FormLabel>Retail Rescue Items</FormLabel>
          </Grid>
          <Grid item>
            <RetailRescueItems
              itemArray={rescueItems}
              parentCallback={setRescueItems}
            />
          </Grid>
          <Grid item container direction="column" spacing={1}>
            <Grid item>
              <FormLabel>Disable Pick-up Dates</FormLabel>
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Select Date to Disable"
                  value={selectedDate}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                  }}
                  disablePast
                  shouldDisableDate={(day: Dayjs) => day.day() <= 1}
                  renderInput={(params: TextFieldProps) => (
                    <TextField {...params} />
                  )}
                  renderDay={(
                    date: Dayjs,
                    selectedDates: Array<Dayjs | null>,
                    pickersDayProps: PickersDayProps<Dayjs>,
                  ) => {
                    const isSelected = dateDisabled(date.toDate());
                    return (
                      <PickersDay {...pickersDayProps} selected={isSelected} />
                    );
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              {selectedDate &&
                (dateDisabled(selectedDate.toDate()) ? (
                  <Button variant="contained" onClick={handleEnableDate}>
                    Enable Date
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleDisableDate}>
                    Disable Date
                  </Button>
                ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item container direction="row" justifyContent="flex-end">
          <Grid item>
            <Button disabled={loading} variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Grid>
        </Grid>
      </FormControl>
    </Grid>
  );
}
export default AdminSettingsForm;
