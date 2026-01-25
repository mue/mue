import variables from 'config/variables';
import { memo, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { MdRefresh } from 'react-icons/md';

import EventBus from 'utils/eventbus';

import './Slider.scss';

const SliderComponent = memo((props) => {
  const [value, setValue] = useState(localStorage.getItem(props.name) || props.default);

  const handleChange = useCallback(
    (e) => {
      let newValue = e.target.value;
      newValue = Number(newValue);

      if (newValue > props.max) {
        newValue = props.max;
      }

      if (newValue < props.min) {
        newValue = props.min;
      }

      localStorage.setItem(props.name, newValue);
      setValue(newValue);

      if (props.element) {
        if (!document.querySelector(props.element)) {
          document.querySelector('.reminder-info').style.display = 'flex';
          return localStorage.setItem('showReminder', true);
        }
      }

      EventBus.emit('refresh', props.category);
    },
    [props],
  );

  const resetItem = useCallback(() => {
    handleChange({
      target: {
        value: props.default || '',
      },
    });
    toast(variables.getMessage('toasts.reset'));
  }, [handleChange, props.default]);

  const percentage =
    ((Number(value) - Number(props.min)) / (Number(props.max) - Number(props.min))) * 100;

  return (
    <div className="slider-container">
      <span className="sliderTitle">
        {props.title}
        <span>{Number(value)}</span>
        <span className="link" onClick={resetItem}>
          <MdRefresh />
          {variables.getMessage('modals.main.settings.buttons.reset')}
        </span>
      </span>
      <div className="slider-wrapper">
        <input
          type="range"
          className="slider-input"
          value={Number(value)}
          onChange={handleChange}
          min={Number(props.min)}
          max={Number(props.max)}
          step={Number(props.step) || 1}
          style={{ '--slider-percentage': `${percentage}%` }}
        />
        {props.marks && props.marks.length > 0 && (
          <div className="slider-marks">
            {props.marks.map((mark) => (
              <span
                key={mark.value}
                className="slider-mark"
                style={{
                  left: `${((mark.value - Number(props.min)) / (Number(props.max) - Number(props.min))) * 100}%`,
                }}
              >
                {mark.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

SliderComponent.displayName = 'SliderComponent';

export { SliderComponent as default, SliderComponent as Slider };
