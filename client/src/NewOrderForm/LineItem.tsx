import React from 'react';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import FormRow from '../components/form/FormRow';

interface LineItemProps {
  item: string;
  updateSelection: (index: number, comment: string) => void;
  updateComment: (index: number, value: string) => void;
  index: number;
  removeItem: (index: number) => void;
  options: Array<string>;
  selectedItems: Array<string>;
}

function LineItem({
  item,
  updateComment,
  index,
  removeItem,
  updateSelection,
  options,
  selectedItems,
}: LineItemProps) {
  return (
    <FormRow key={item}>
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
            <InputLabel id="demo-simple-select-label">Item</InputLabel>
            <Select
              label="Item"
              value={item}
              placeholder="Select"
              onChange={(e) => updateSelection(index, e.target.value)}
            >
              {options
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
              fullWidth
              type="text"
              label="Comments"
              onChange={(e) => updateComment(index, e.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid xs={2} item>
          <Button
            color="error"
            variant="contained"
            onClick={() => removeItem(index)}
          >
            Remove
          </Button>
        </Grid>
      </Grid>
    </FormRow>
  );
}

export default LineItem;
