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
  FormLabel,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Navbar from '../components/NavBar';
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
  // add state for the advancedSettings as a boolean
  const [advancedSettings, setAdvancedSettings] = React.useState('basic');
  const [dryGoodsMax, setDryGoodsMax] = React.useState(0);
  const [dryGoodsAdvanced, setDryGoodsAdvanced] = React.useState<string[]>([]);
  const [produceMax, setProduceMax] = React.useState(0);
  const [vitoMax, setVitoMax] = React.useState(0);
  const [vitoAdvanced, setVitoAdvanced] = React.useState<string[]>([]);
  const [meatMax, setMeatMax] = React.useState(0);
  const [meatAdvanced, setMeatAdvanced] = React.useState<string[]>([]);
  const [leadTime, setLeadTime] = React.useState(0);
  const [rescueItems, setRescueItems] = React.useState<string[]>([]);

  const handleAdvancedSettingsChange = (event: SelectChangeEvent) => {
    setAdvancedSettings(event.target.value);
  };

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

  const handleSave = () => {
    console.log(dryGoodsAdvanced);
    console.log(vitoAdvanced);
    console.log(meatAdvanced);
    console.log(rescueItems);
  };

  return (
    <>
      <Navbar />

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
              value={advancedSettings}
              onChange={handleAdvancedSettingsChange}
            >
              <FormControlLabel
                value="basic"
                control={<Radio />}
                label="Basic"
              />
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
              {advancedSettings === 'basic' ? (
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
            {advancedSettings === 'basic' ? (
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
            {advancedSettings === 'basic' ? (
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
          </Grid>
          <Grid item container direction="row" justifyContent="flex-end">
            <Grid item>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </Grid>
    </>
  );
}

export default AdminSettingsPage;
