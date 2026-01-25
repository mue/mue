import variables from 'config/variables';
import { memo, useState, useCallback } from 'react';
import { useTranslation } from 'contexts/TranslationContext';

import EventBus from 'utils/eventbus';

import './Radio.scss';

const Radio = memo((props) => {
  const { changeLanguage } = useTranslation();
  const [value, setValue] = useState(localStorage.getItem(props.name));

  const handleChange = useCallback(
    async (newValue) => {
      if (newValue === 'loading') {
        return;
      }

      if (props.name === 'language') {
        changeLanguage(newValue);
        setValue(newValue);

        variables.stats.postEvent('setting', `${props.name} from ${value} to ${newValue}`);

        if (props.onChange) {
          props.onChange(newValue);
        }

        EventBus.emit('refresh', props.category);
        return;
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
    },
    [value, props, changeLanguage],
  );

  return (
    <div className="radio-group">
      {props.title && (
        <legend className={props.smallTitle ? 'radio-title-small' : 'radio-title'}>
          {props.title}
        </legend>
      )}
      <div className="radio-options" role="radiogroup" aria-label={props.name}>
        {props.options.map((option) => (
          <label
            key={option.value}
            className={`radio-option ${value === option.value ? 'selected' : ''}`}
            onClick={() => handleChange(option.value)}
          >
            <span className="radio-label">{option.name}</span>
            <div className="radio-circle">
              {value === option.value && <div className="radio-dot" />}
            </div>
            <input
              type="radio"
              name={props.name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              className="radio-input"
            />
          </label>
        ))}
      </div>
    </div>
  );
});

Radio.displayName = 'Radio';

export { Radio as default, Radio };
