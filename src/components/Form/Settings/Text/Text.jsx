import variables from 'config/variables';
import { memo, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';
import { MdRefresh } from 'react-icons/md';

import EventBus from 'utils/eventbus';

const Text = memo((props) => {
  const [value, setValue] = useState(localStorage.getItem(props.name) || '');

  const handleChange = useCallback((e) => {
    let { value } = e.target;

    // Alex wanted font to work with montserrat and Montserrat, so I made it work
    if (props.upperCaseFirst === true) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    localStorage.setItem(props.name, value);
    setValue(value);

    // Call parent onChange if provided
    if (props.onChange) {
      props.onChange(value);
    }

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', props.category);
  }, [props.name, props.upperCaseFirst, props.element, props.category, props.onChange]);

  const resetItem = useCallback(() => {
    handleChange({
      target: {
        value: props.default || '',
      },
    });
    toast(variables.getMessage('toasts.reset'));
  }, [handleChange, props.default]);

  return (
    <>
      {props.textarea === true ? (
        <TextField
          label={props.title}
          value={value}
          onChange={handleChange}
          varient="outlined"
          className={props.customcss ? 'customcss' : ''}
          multiline
          spellCheck={false}
          minRows={4}
          maxRows={10}
          InputLabelProps={{ shrink: true }}
        />
      ) : (
        <TextField
          label={props.title}
          value={value}
          onChange={handleChange}
          varient="outlined"
          InputLabelProps={{ shrink: true }}
          placeholder={props.placeholder || ''}
        />
      )}
      <span className="link" onClick={resetItem}>
        <MdRefresh />
        {variables.getMessage('modals.main.settings.buttons.reset')}
      </span>
    </>
  );
});

Text.displayName = 'Text';

export { Text as default, Text };
