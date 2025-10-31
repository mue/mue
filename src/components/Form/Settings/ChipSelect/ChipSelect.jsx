import { useState, memo } from 'react';

import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

function ChipSelect({ label, options, onChange }) {
  let start = (localStorage.getItem('apiCategories') || '').split(',');
  if (start[0] === '') {
    start = [];
  }

  const [optionsSelected, setoptionsSelected] = useState(start);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setoptionsSelected(typeof value === 'string' ? value.split(',') : value);
    localStorage.setItem('apiCategories', value);

    // Call parent onChange if provided
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <FormControl>
      <InputLabel id="chipSelect-label">{label}</InputLabel>
      <Select
        labelId="chipSelect-label"
        id="chipSelect"
        multiple
        value={optionsSelected}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label={label} />}
        renderValue={(optionsSelected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {optionsSelected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.name} value={option.name}>
            {option.name.charAt(0).toUpperCase() + option.name.slice(1)}{' '}
            {option.count && `(${option.count})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

const MemoizedChipSelect = memo(ChipSelect);
export { ChipSelect as default, MemoizedChipSelect as ChipSelect };
