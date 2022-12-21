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
} from '@mui/material';
import FormRow from '../components/form/FormRow';
import ISettings from '../util/types/settings';
import { IOrder, IRetailRescueItem } from '../util/types/order';

interface NewOrderFormProps {
  settings: ISettings;
  order: IOrder;
}

function ModifyOrderForm({ settings, order }: NewOrderFormProps) {
  const originalValues = {
    meat: order.meat.count,
    dryGoods: order.dry.count,
    produce: order.produce.count,
    vitoPallets: order.vito.count,
  };

  const [values, setValueState] = useState(originalValues);
  const [retailItems, setRetailItems] = useState<IRetailRescueItem[]>(
    order.retailRescue,
  );
  const [orderComments, setOrderComments] = useState(order.comment);

  const addRetailItem = () => {
    setRetailItems([...retailItems, { item: '', comment: '' }]);
  };

  const removeRetailItem = (index: number) => {
    setRetailItems(retailItems.filter((item, i) => i !== index));
  };

  const updateRetailItemName = (index: number, value: string) => {
    const newRetailItems = [...retailItems];
    newRetailItems[index].item = value;
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

  return (
    <Grid
      container
      sx={{
        paddingTop: '30px',
        paddingBottom: '30px',
      }}
      rowSpacing={2}
    >
      <FormControl>
        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Produce</FormLabel>
          </Grid>
          <Grid item>
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
          </Grid>
        </Grid>
        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Dry Goods</FormLabel>
          </Grid>
          <Grid item>
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
          </Grid>
        </Grid>

        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Vito</FormLabel>
          </Grid>
          <Grid item>
            <Select
              value={values.vitoPallets}
              autoWidth
              onChange={(e) =>
                setValue('vitoPallets', e.target.value as string)
              }
            >
              {Array.from(Array(settings.maxNumOfVito + 1).keys()).map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        <Grid container item direction="column">
          <Grid item>
            <FormLabel>Meat</FormLabel>
          </Grid>
          <Grid item>
            <Select
              value={values.meat}
              autoWidth
              onChange={(e) => setValue('meat', e.target.value as string)}
            >
              {Array.from(Array(settings.maxNumOfMeat + 1).keys()).map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        <FormRow>
          <Grid item container justifyContent="center">
            <FormLabel>Retail Rescue Items</FormLabel>
          </Grid>
        </FormRow>
        {retailItems.map((item, index) => (
          <FormRow>
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
                    {settings.retailRescueItems.map((rrItem: string) => (
                      <MenuItem value={rrItem}>{rrItem}</MenuItem>
                    ))}
                    {retailItems.map((rrObj) => (
                      <MenuItem value={rrObj.item}>{rrObj.item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={4} item>
                <TextField
                  fullWidth
                  type="text"
                  label="Comments"
                  onChange={(e) =>
                    updateRetailItemComments(index, e.target.value)
                  }
                />
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
            <Button variant="contained" onClick={addRetailItem}>
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
      </FormControl>
    </Grid>
  );
}

export default ModifyOrderForm;
