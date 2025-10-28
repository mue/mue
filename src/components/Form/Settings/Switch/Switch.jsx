import variables from 'config/variables';
import { memo, useState, useCallback } from 'react';
import { Switch as SwitchUI, FormControlLabel } from '@mui/material';

import EventBus from 'utils/eventbus';

const Switch = memo((props) => {
  const [checked, setChecked] = useState(localStorage.getItem(props.name) === 'true');

  const handleChange = useCallback(() => {
    const value = !checked;
    localStorage.setItem(props.name, value);
    setChecked(value);

    if (props.onChange) {
      props.onChange(value);
    }

    variables.stats.postEvent(
      'setting',
      `${props.name} ${checked ? 'enabled' : 'disabled'}`,
    );

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', props.category);
  }, [checked, props]);

  return (
    <FormControlLabel
      control={
        <SwitchUI
          name={props.name}
          color="primary"
          checked={checked}
          onChange={handleChange}
        />
      }
      label={props.header ? '' : props.text}
      labelPlacement="start"
    />
  );
});

Switch.displayName = 'Switch';

export { Switch as default, Switch };
