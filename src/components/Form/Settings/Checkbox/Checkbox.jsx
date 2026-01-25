import variables from 'config/variables';
import { memo, useState, useCallback } from 'react';
import { MdCheck } from 'react-icons/md';

import EventBus from 'utils/eventbus';

import './Checkbox.scss';

const Checkbox = memo((props) => {
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
      `${props.name} ${value ? 'enabled' : 'disabled'}`,
    );

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', props.category);
  }, [checked, props]);

  const handleKeyDown = useCallback((e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !props.disabled) {
      e.preventDefault();
      handleChange();
    }
  }, [handleChange, props.disabled]);

  return (
    <div className={`checkbox-wrapper ${props.disabled ? 'disabled' : ''}`}>
      <span className="checkbox-label">{props.text}</span>
      <input
        type="checkbox"
        name={props.name}
        checked={checked}
        onChange={handleChange}
        disabled={props.disabled || false}
        className="checkbox-input"
        aria-label={props.text}
        onKeyDown={handleKeyDown}
      />
      <div className={`checkbox-box ${checked ? 'checked' : ''}`}>
        {checked && <MdCheck />}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox as default, Checkbox };
