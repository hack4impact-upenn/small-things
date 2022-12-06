import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { FormControl, Grid, TextField } from '@mui/material';

interface ChipData {
  key: number;
  label: string;
}

interface RetailRescueItemsProps {
  itemArray?: string[];
  parentCallback: (itemArray: string[]) => void;
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function RetailRescueItems(props: RetailRescueItemsProps) {
  const { itemArray, parentCallback } = props;
  const [input, setInput] = React.useState('');
  const [chipData, setChipData] = React.useState<readonly ChipData[]>(
    itemArray
      ? itemArray.map((item, index) => ({ key: index, label: item }))
      : [],
  );

  const handleDelete = (chipToDelete: ChipData) => () => {
    console.log(chipData);
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key),
    );
    parentCallback(chipData.map((chip) => chip.label));
  };

  return (
    <Grid container direction="column" width="75vh" spacing={2}>
      <Grid item>
        <Paper
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            m: 0,
          }}
          component="ul"
        >
          {chipData.map((data) => {
            let icon;

            return (
              <ListItem key={data.key}>
                <Chip
                  icon={icon}
                  label={data.label}
                  onDelete={
                    data.label === 'React' ? undefined : handleDelete(data)
                  }
                />
              </ListItem>
            );
          })}
        </Paper>
      </Grid>
      <Grid item>
        <FormControl>
          <TextField
            id="add-item"
            label="Add Item"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                if (input !== '') {
                  setChipData((items) =>
                    items.concat([{ key: chipData.length, label: input }]),
                  );
                  console.log(chipData);
                  console.log(chipData.map((chip) => chip.label));
                  parentCallback(chipData.map((chip) => chip.label));
                  setInput('');
                }

                ev.preventDefault();
              }
            }}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
}
