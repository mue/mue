import variables from 'config/variables';
import { memo, useState, useCallback } from 'react';
import {
  Radio as RadioUI,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

import EventBus from 'utils/eventbus';
import { translations } from 'lib/translations';

const Radio = memo((props) => {
  const [value, setValue] = useState(localStorage.getItem(props.name));

  const handleChange = useCallback(async (e) => {
    const newValue = e.target.value;

    if (newValue === 'loading') {
      return;
    }

    if (props.name === 'language') {
      // old tab name
      if (localStorage.getItem('tabName') === variables.getMessage('tabname')) {
        localStorage.setItem('tabName', translations[newValue.replace('-', '_')].tabname);
      }
    }

    localStorage.setItem(props.name, newValue);
    setValue(newValue);

    if (props.onChange) {
      props.onChange(newValue);
    }

    variables.stats.postEvent('setting', `${props.name} from ${value} to ${newValue}`);

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', props.category);
  }, [value, props]);

  return (
    <FormControl component="fieldset">
      <FormLabel
        className={props.smallTitle ? 'radio-title-small' : 'radio-title'}
        component="legend"
      >
        {props.title}
      </FormLabel>
      <RadioGroup
        aria-label={props.name}
        name={props.name}
        onChange={handleChange}
        value={value}
      >
        {props.options.map((option) => (
          <FormControlLabel
            value={option.value}
            control={<RadioUI />}
            label={option.name}
            key={option.name}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
});

Radio.displayName = 'Radio';

export { Radio as default, Radio };
