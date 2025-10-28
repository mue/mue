import variables from 'config/variables';
import { memo, useState, useCallback, useRef } from 'react';
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import EventBus from 'utils/eventbus';

const Dropdown = memo((props) => {
  const [value, setValue] = useState(
    localStorage.getItem(props.name) || props.items[0].value,
  );
  const dropdown = useRef();

  const onChange = useCallback((e) => {
    const newValue = e.target.value;

    if (newValue === variables.getMessage('modals.main.loading')) {
      return;
    }

    variables.stats.postEvent('setting', `${props.name} from ${value} to ${newValue}`);

    setValue(newValue);

    if (!props.noSetting) {
      localStorage.setItem(props.name, newValue);
      localStorage.setItem(props.name2, props.value2);
    }

    if (props.onChange) {
      props.onChange(newValue);
    }

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', props.category);
  }, [value, props]);

  const id = 'dropdown' + props.name;
  const label = props.label || '';

  return (
    <FormControl fullWidth className={id}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        labelId={id}
        id={props.name}
        value={value}
        label={label}
        onChange={onChange}
        ref={dropdown}
        key={id}
      >
        {props.items.map((item) =>
          item !== null ? (
            <MenuItem key={id + item.value} value={item.value}>
              {item.text}
            </MenuItem>
          ) : null,
        )}
      </Select>
    </FormControl>
  );
});

Dropdown.displayName = 'Dropdown';

export { Dropdown as default, Dropdown };
