import React, { useState } from 'react';
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
  const [chipData, setChipData] = useState<ChipData[]>(
    itemArray
      ? itemArray.map((item, index) => ({ key: index, label: item }))
      : [],
  );

  const handleDelete = (chipToDelete: ChipData) => () => {
    const updatedChipData = chipData.filter(
      (chip) => chip.key !== chipToDelete.key,
    );
    setChipData(updatedChipData);
    parentCallback(updatedChipData.map((chip) => chip.label));
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
            minHeight: '50px',
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
                  const updatedChipData = [
                    ...chipData,
                    { key: chipData.length, label: input },
                  ];
                  setChipData(updatedChipData);
                  parentCallback(updatedChipData.map((chip) => chip.label));
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
