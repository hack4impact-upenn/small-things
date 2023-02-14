/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import {
  DesktopDatePicker,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

interface WeekPickerProps {
  selectedDate: Dayjs | null;
  updateDate: (date: Dayjs) => void;
}

function WeekPicker({ selectedDate, updateDate }: WeekPickerProps) {
  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      updateDate(newValue);
    }
  };

  const renderWeekPickerDay = (
    date: Dayjs,
    selectedDates: Array<Dayjs | null>,
    pickersDayProps: PickersDayProps<Dayjs>,
  ) => {
    if (!selectedDate) {
      return <PickersDay {...pickersDayProps} />;
    }

    const start = selectedDate.startOf('week');
    const end = selectedDate.endOf('week');

    const dayIsBetween = date.isBetween(start, end, null, '[]');
    const isFirstDay = date.isSame(start, 'day');
    const isLastDay = date.isSame(end, 'day');
    const baseStyle = dayIsBetween && {
      borderRadius: 0,
      backgroundColor: '#029B8F',
      color: 'white',
      '&:hover, &:focus': {
        backgroundColor: 'rgb(1 108 100)',
      },
    };
    const firstDayStyle = isFirstDay && {
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
    };
    const lastDayStyle = isLastDay && {
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    };
    const fullStyle = { ...baseStyle, ...firstDayStyle, ...lastDayStyle };
    return <PickersDay sx={fullStyle} {...pickersDayProps} disableMargin />;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label="Week picker"
        value={selectedDate}
        onChange={handleDateChange}
        closeOnSelect={false}
        showDaysOutsideCurrentMonth
        renderInput={(params: TextFieldProps) => <TextField {...params} />}
        renderDay={renderWeekPickerDay}
        inputFormat="Week of MMM D"
      />
    </LocalizationProvider>
  );
}

export default WeekPicker;
