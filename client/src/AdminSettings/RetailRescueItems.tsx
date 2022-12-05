import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { FormControl, Grid, TextField } from '@mui/material';

interface ChipData {
  key: number;
  label: string;
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function RetailRescueItems() {
  const [input, setInput] = React.useState('');
  const [chipData, setChipData] = React.useState<readonly ChipData[]>([
    { key: 0, label: 'Beverages' },
    { key: 1, label: 'Milk' },
    { key: 2, label: 'Wipes' },
  ]);

  const handleDelete = (chipToDelete: ChipData) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key),
    );
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