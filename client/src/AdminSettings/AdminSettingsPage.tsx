import React from 'react';
import {
  Typography,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormHelperText,
  Grid,
  Button,
} from '@mui/material';
import RetailRescueItems from './RetailRescueItems';
import ScreenGrid from '../components/ScreenGrid';

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
    <ScreenGrid>
      <FormControl>
        <Grid container item spacing={2}>
          <Grid item>
            <Typography variant="h2">Dry Goods</Typography>
          </Grid>
          <Grid item>
            <Select
              labelId="dry-goods-label"
              id="dry-goods-select"
              value={String(dryGoodsMax)}
              label="Dry Goods"
              onChange={handleDryGoodsChange}
            >
              {Array.from(Array(SETTING_MAXIMUMS.dryGoods + 1).keys()).map(
                (x) => (
                  <MenuItem value={x}>{x}</MenuItem>
                ),
              )}
            </Select>
            <FormHelperText>Maximum Pallets</FormHelperText>
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item>
            <Typography variant="h2">Produce</Typography>
          </Grid>
          <Grid item>
            <Select
              labelId="product-label"
              id="product-select"
              value={String(produceMax)}
              label="Produce"
              onChange={handleProduceChange}
            >
              {Array.from(Array(SETTING_MAXIMUMS.produce + 1).keys()).map(
                (x) => (
                  <MenuItem value={x}>{x}</MenuItem>
                ),
              )}
            </Select>
            <FormHelperText>Maximum Pallets</FormHelperText>
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item>
            <Typography variant="h2">Vito</Typography>
          </Grid>
          <Grid item>
            <Select
              labelId="vito-label"
              id="vito-select"
              value={String(vitoMax)}
              label="Vito"
              onChange={handleVitoChange}
            >
              {Array.from(Array(SETTING_MAXIMUMS.vito + 1).keys()).map((x) => (
                <MenuItem value={x}>{x}</MenuItem>
              ))}
            </Select>
            <FormHelperText>Maximum Pallets</FormHelperText>
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item>
            <Typography variant="h2">Meat</Typography>
          </Grid>
          <Grid item>
            <Select
              labelId="meat-label"
              id="meat-select"
              value={String(meatMax)}
              label="Meat"
              onChange={handleMeatChange}
            >
              {Array.from(Array(SETTING_MAXIMUMS.meat + 1).keys()).map((x) => (
                <MenuItem value={x}>{x}</MenuItem>
              ))}
            </Select>
            <FormHelperText>Maximum Pallets</FormHelperText>
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item>
            <Typography variant="h2">Lead Time</Typography>
          </Grid>
          <Grid item>
            <Select
              labelId="lead-time-label"
              id="lead-time-select"
              value={String(leadTime)}
              label="Lead Time"
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
            <Typography variant="h2">Retail Rescue</Typography>
          </Grid>
          <Grid item>
            <RetailRescueItems />
          </Grid>
        </Grid>
        <Grid item container direction="row" justifyContent="flex-end">
          <Grid item>
            <Button variant="contained">Save</Button>
          </Grid>
        </Grid>
      </FormControl>
    </ScreenGrid>
  );
}

export default AdminSettingsPage;
