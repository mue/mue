import { useT } from 'contexts';
import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { MdRefresh } from 'react-icons/md';
import { toast } from 'react-toastify';

import EventBus from 'utils/eventbus';

import './ColourPicker.scss';

const ColourPicker = memo(
  ({ name, label, category, defaultValue = '#ffffff', value: controlledValue, onChange }) => {
    const t = useT();
    const inputRef = useRef(null);
    const debounceTimerRef = useRef(null);
    const [internalValue, setInternalValue] = useState(
      () => localStorage.getItem(name) || defaultValue,
    );

    const value = controlledValue !== undefined ? controlledValue : internalValue;

    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    const handleChange = useCallback(
      (e) => {
        const colour = e.target.value;

        if (controlledValue === undefined) {
          setInternalValue(colour);
          localStorage.setItem(name, colour);

          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }

          debounceTimerRef.current = setTimeout(() => {
            EventBus.emit('refresh', category);
          }, 500);
        }

        if (onChange) {
          onChange(e);
        }
      },
      [name, category, onChange, controlledValue],
    );

    const resetColour = useCallback(
      (e) => {
        e?.stopPropagation();
        const resetEvent = { target: { value: defaultValue } };
        handleChange(resetEvent);
        toast(t('toasts.reset'));
      },
      [handleChange, defaultValue, t],
    );

    const openPicker = useCallback((e) => {
      e.stopPropagation();
      inputRef.current?.click();
    }, []);

    return (
      <div className="colour-picker">
        {label && (
          <div className="colour-picker-header">
            <label className="colour-picker-label">{label}</label>
            <span className="colour-picker-reset" onClick={resetColour}>
              <MdRefresh />
              {t('modals.main.settings.buttons.reset')}
            </span>
          </div>
        )}
        <div className="colour-picker-control" onClick={openPicker}>
          <div className="colour-picker-swatch" style={{ backgroundColor: value }} />
          <span className="colour-picker-value">{value}</span>
          <input
            ref={inputRef}
            type="color"
            name={name}
            value={value}
            onChange={handleChange}
            className="colour-picker-input"
          />
        </div>
      </div>
    );
  },
);

ColourPicker.displayName = 'ColourPicker';

export { ColourPicker as default, ColourPicker };
