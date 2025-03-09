import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedNames, theme) {
  return {
    fontWeight: selectedNames.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelectChip({ names, selectedValues, handleChange, label }) {
  const theme = useTheme();

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id={`demo-multiple-chip-label-${label}`}>{label}</InputLabel>
      <Select
        labelId={`demo-multiple-chip-label-${label}`}
        id={`demo-multiple-chip-${label}`}
        multiple
        value={selectedValues}
        onChange={handleChange}
        input={<OutlinedInput id={`select-multiple-chip-${label}`} label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => {
              const name = names.find(item => item.id === value)?.name;
              return <Chip key={value} label={name} />;
            })}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {names.map((item) => (
          <MenuItem
            key={item.id}
            value={item.id}
            style={getStyles(item.id, selectedValues, theme)}
          >
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
