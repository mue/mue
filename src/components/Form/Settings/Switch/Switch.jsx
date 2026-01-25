import variables from 'config/variables';
import { memo, useState, useCallback } from 'react';

import EventBus from 'utils/eventbus';

import './Switch.scss';

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
    <div className="switch-wrapper">
      {!props.header && <span className="switch-label">{props.text}</span>}
      <div className={`switch-track ${checked ? 'checked' : ''}`} onClick={handleChange}>
        <div className="switch-thumb" />
      </div>
      <input
        type="checkbox"
        name={props.name}
        checked={checked}
        onChange={handleChange}
        className="switch-input"
        aria-hidden="true"
      />
    </div>
  );
});

Switch.displayName = 'Switch';

export { Switch as default, Switch };
