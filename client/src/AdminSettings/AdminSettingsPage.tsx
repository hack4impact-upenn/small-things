import React from 'react';
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormHelperText,
  Chip,
  Stack,
} from '@mui/material';
import ScreenGrid from '../components/ScreenGrid';
import RetailRescueItems from './RetailRescueItems';

/**
 * A page only accessible to admins that displays a control panel allowing
 * Admins to change the integer number of max pallets for dry goods, produce,
 * vito boxes, and meat, as well as the lead time of orders and the list of
 * retail rescue items.
 */

const SETTING_MAXIMUMS = {
  dryGoods: 10,
  produce: 10,
  vito: 10,
  meat: 10,
  leadTime: 10,
};

function AdminSettingsPage() {
  const [dryGoodsMax, setDryGoodsMax] = React.useState(0);
  const [produceMax, setProduceMax] = React.useState(0);
  const [vitoMax, setVitoMax] = React.useState(0);
  const [meatMax, setMeatMax] = React.useState(0);
  const [leadTime, setLeadTime] = React.useState(0);
  const [rescueItems, setRescueItems] = React.useState([]);

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

  return (
    <FormControl sx={{ maxWidth: 240 }}>
      <Typography variant="h3">Settings</Typography>

      <Typography variant="h2">Dry Goods</Typography>
      <Select
        labelId="dry-goods-label"
        id="dry-goods-select"
        value={String(dryGoodsMax)}
        label="Dry Goods"
        onChange={handleDryGoodsChange}
      >
        {Array.from(Array(SETTING_MAXIMUMS.dryGoods + 1).keys()).map((x, i) => (
          <MenuItem value={x}>{x}</MenuItem>
        ))}
      </Select>
      <FormHelperText>Maximum Pallets</FormHelperText>

      <Typography variant="h2">Produce</Typography>
      <Select
        labelId="product-label"
        id="product-select"
        value={String(produceMax)}
        label="Produce"
        onChange={handleProduceChange}
      >
        {Array.from(Array(SETTING_MAXIMUMS.produce + 1).keys()).map((x, i) => (
          <MenuItem value={x}>{x}</MenuItem>
        ))}
      </Select>
      <FormHelperText>Maximum Pallets</FormHelperText>

      <Typography variant="h2">Vito</Typography>
      <Select
        labelId="vito-label"
        id="vito-select"
        value={String(vitoMax)}
        label="Vito"
        onChange={handleVitoChange}
      >
        {Array.from(Array(SETTING_MAXIMUMS.vito + 1).keys()).map((x, i) => (
          <MenuItem value={x}>{x}</MenuItem>
        ))}
      </Select>
      <FormHelperText>Maximum Pallets</FormHelperText>

      <Typography variant="h2">Meat</Typography>
      <Select
        labelId="meat-label"
        id="meat-select"
        value={String(meatMax)}
        label="Meat"
        onChange={handleMeatChange}
      >
        {Array.from(Array(SETTING_MAXIMUMS.meat + 1).keys()).map((x, i) => (
          <MenuItem value={x}>{x}</MenuItem>
        ))}
      </Select>
      <FormHelperText>Maximum Pallets</FormHelperText>

      <Typography variant="h2">Lead Time</Typography>
      <Select
        labelId="lead-time-label"
        id="lead-time-select"
        value={String(leadTime)}
        label="Lead Time"
        onChange={handleLeadTimeChange}
      >
        {Array.from(Array(SETTING_MAXIMUMS.leadTime + 1).keys()).map((x, i) => (
          <MenuItem value={x}>{x}</MenuItem>
        ))}
      </Select>
      <FormHelperText>Days</FormHelperText>

      <Typography variant="h2">Retail Rescue</Typography>

      <RetailRescueItems />
    </FormControl>
  );
}

export default AdminSettingsPage;
