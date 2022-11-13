import { useState, memo, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

function ChipSelect({ label, options, name }) {
  const [optionsSelected, setoptionsSelected] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setoptionsSelected(
      typeof value === 'string' ? value.split(',') : value,
    );
    localStorage.setItem('apiCategories', optionsSelected)
  };
  console.log(localStorage.getItem('apiCategories'))


  return (
    <div>
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
              {option.name.charAt(0).toUpperCase() + option.name.slice(1)} ({option.count})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default memo(ChipSelect);
