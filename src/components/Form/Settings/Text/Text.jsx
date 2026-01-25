import variables from 'config/variables';
import { memo, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { MdRefresh } from 'react-icons/md';

import EventBus from 'utils/eventbus';

import './Text.scss';

const Text = memo((props) => {
  const { name, upperCaseFirst, element, category, onChange, title, textarea, customcss, placeholder } = props;
  const defaultValue = props.default;
  const [value, setValue] = useState(localStorage.getItem(name) || '');

  const handleChange = useCallback(
    (e) => {
      let newValue = e.target.value;

      if (upperCaseFirst === true) {
        newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
      }

      localStorage.setItem(name, newValue);
      setValue(newValue);

      if (onChange) {
        onChange(newValue);
      }

      if (element) {
        if (!document.querySelector(element)) {
          document.querySelector('.reminder-info').style.display = 'flex';
          return localStorage.setItem('showReminder', true);
        }
      }

      EventBus.emit('refresh', category);
    },
    [name, upperCaseFirst, element, category, onChange],
  );

  const resetItem = useCallback(() => {
    handleChange({
      target: {
        value: defaultValue || '',
      },
    });
    toast(variables.getMessage('toasts.reset'));
  }, [handleChange, defaultValue]);

  return (
    <div className="text-field-container">
      {textarea === true ? (
        <div className={`text-field ${customcss ? 'customcss' : ''}`}>
          {title && (
            <div className="text-field-header">
              <label className="text-field-label">{title}</label>
              <span className="text-field-reset" onClick={resetItem}>
                <MdRefresh />
                {variables.getMessage('modals.main.settings.buttons.reset')}
              </span>
            </div>
          )}
          <textarea
            value={value}
            onChange={handleChange}
            spellCheck={false}
            rows={4}
            className="text-field-textarea"
          />
        </div>
      ) : (
        <div className="text-field">
          {title && (
            <div className="text-field-header">
              <label className="text-field-label">{title}</label>
              <span className="text-field-reset" onClick={resetItem}>
                <MdRefresh />
                {variables.getMessage('modals.main.settings.buttons.reset')}
              </span>
            </div>
          )}
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder || ''}
            className="text-field-input"
          />
        </div>
      )}
    </div>
  );
});

Text.displayName = 'Text';

export { Text as default, Text };
