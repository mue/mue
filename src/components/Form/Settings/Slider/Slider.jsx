import variables from 'config/variables';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Slider } from '@mui/material';
import { MdRefresh } from 'react-icons/md';

import EventBus from 'utils/eventbus';

function SliderComponent(props) {
  const [value, setValue] = useState(localStorage.getItem(props.name) || props.default);

  const handleChange = (e, text) => {
    let { value } = e.target;
    value = Number(value);

    if (text) {
      if (value === '') {
        return setValue(0);
      }

      if (value > props.max) {
        value = props.max;
      }

      if (value < props.min) {
        value = props.min;
      }
    }

    localStorage.setItem(props.name, value);
    setValue(value);

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', props.category);
  };

  const resetItem = () => {
    handleChange({
      target: {
        value: props.default || '',
      },
    });
    toast(variables.getMessage('toasts.reset'));
  };

  return (
    <>
      <span className={'sliderTitle'}>
        {props.title}
        <span>{Number(value)}</span>
        <span className="link" onClick={resetItem}>
          <MdRefresh />
          {variables.getMessage('settings:buttons.reset')}
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
}

export { SliderComponent as default, SliderComponent as Slider };
