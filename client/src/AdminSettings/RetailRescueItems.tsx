import React, { useState, useCallback } from 'react';
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
  const [input, setInput] = useState('');
  const [chipData, setChipData] = useState<readonly ChipData[]>(
    itemArray
      ? itemArray.map((item, index) => ({ key: index, label: item }))
      : [],
  );

  const handleDelete = (chipToDelete: ChipData) => () => {
    parentCallback(
      chipData
        .filter((chip) => chip.key !== chipToDelete.key)
        .map((chip) => chip.label),
    );
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key),
    );
  };

  useCallback(() => {
    parentCallback(chipData.map((chip) => chip.label));
  }, [chipData, parentCallback]);

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
                  onDelete={handleDelete(data)}
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
                  parentCallback(
                    [...chipData, { key: chipData.length, label: input }].map(
                      (item) => item.label,
                    ),
                  );
                  setChipData([
                    ...chipData,
                    { key: chipData.length, label: input },
                  ]);
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
