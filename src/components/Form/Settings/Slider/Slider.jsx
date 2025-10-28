import variables from 'config/variables';
import { memo, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Slider } from '@mui/material';
import { MdRefresh } from 'react-icons/md';

import EventBus from 'utils/eventbus';

const SliderComponent = memo((props) => {
  const [value, setValue] = useState(localStorage.getItem(props.name) || props.default);

  const handleChange = useCallback((e, text) => {
    let newValue = e.target.value;
    newValue = Number(newValue);

    if (text) {
      if (newValue === '') {
        setValue(0);
        return;
      }

      if (newValue > props.max) {
        newValue = props.max;
      }

      if (newValue < props.min) {
        newValue = props.min;
      }
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
  }, [props]);

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
      <span className={'sliderTitle'}>
        {props.title}
        <span>{Number(value)}</span>
        <span className="link" onClick={resetItem}>
          <MdRefresh />
          {variables.getMessage('modals.main.settings.buttons.reset')}
        </span>
      </span>
      <Slider
        value={Number(value)}
        onChange={handleChange}
        valueLabelDisplay="auto"
        default={Number(props.default)}
        min={Number(props.min)}
        max={Number(props.max)}
        step={Number(props.step) || 1}
        getAriaValueText={(value) => `${value}`}
        marks={props.marks || []}
      />
    </>
  );
});

SliderComponent.displayName = 'SliderComponent';

export { SliderComponent as default, SliderComponent as Slider };
