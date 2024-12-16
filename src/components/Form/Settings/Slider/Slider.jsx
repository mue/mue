import variables from 'config/variables';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ReactSlider from 'react-slider';
import { MdRefresh, MdSpeed } from 'react-icons/md';
import EventBus from 'utils/eventbus';

function SliderComponent(props) {
  const [value, setValue] = useState(
    Number(localStorage.getItem(props.name)) || Number(props.default),
  );

  const handleChange = (newValue) => {
    if (typeof newValue !== 'number') return;

    newValue = Math.min(Math.max(newValue, props.min), props.max);

    localStorage.setItem(props.name, newValue);
    setValue(newValue);

    if (props.element) {
      if (!document.querySelector(props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', props.category);
  };

  const resetItem = () => {
    handleChange(Number(props.default));
    toast(variables.getMessage('toasts.reset'));
  };

  const multiplierMarks = {
    10: '0.1x',
    100: '1x',
    200: '2x',
    400: '4x',
  };

  const handleMarkClick = (markValue) => {
    handleChange(markValue);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{props.title}</span>
        <div className="flex items-center gap-2 justify-between w-full">
          <span className="text-sm bg-white/15 px-3 py-1.5 rounded-md font-medium">
            {value}
            {props.display}
          </span>
          <button
            onClick={resetItem}
            className="inline-flex items-center text-sm px-3 py-1.5 rounded-md
              bg-white/10 hover:bg-white/15 active:bg-white/20
              dark:bg-white/5 dark:hover:bg-white/10 dark:active:bg-white/15
              transition-colors duration-200 font-medium"
          >
            <MdRefresh className="w-4 h-4 mr-1.5" />
            {variables.getMessage('settings:buttons.reset')}
          </button>
        </div>
      </div>
      <ReactSlider
        value={value}
        onChange={handleChange}
        min={Number(props.min)}
        max={Number(props.max)}
        step={Number(props.step) || 1}
        marks={Object.keys(multiplierMarks).map(Number)}
        snapPoints={Object.keys(multiplierMarks).map(Number)}
        snap
        className="h-14 flex items-center"
        thumbClassName={`
          w-5 h-5 rounded-full 
          bg-gradient-to-br from-white to-neutral-100
          cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-white/40
          hover:from-white hover:to-neutral-200
          active:scale-95
          transition-all duration-200
          flex items-center justify-center
          shadow-lg shadow-black/25
          absolute top-1/2 transform -translate-y-1/2
          before:content-[attr(aria-valuenow)]
          before:absolute before:top-[-28px]
          before:text-xs before:bg-black/90 before:text-white
          before:px-2 before:py-1 before:rounded-md
          before:opacity-0 hover:before:opacity-100
          before:transition-all before:duration-200 before:whitespace-nowrap
          before:shadow-lg
        `}
        trackClassName="h-2 bg-white/15 rounded-full absolute top-1/2 transform -translate-y-1/2"
        markClassName={`
          h-3 w-1.5 bg-white/30 rounded-full cursor-pointer
          hover:bg-white/50 hover:scale-110
          hover:transition-transform hover:duration-200
          absolute top-1/2 transform -translate-y-1/2
          after:content-[attr(data-value)]
          after:absolute after:top-5
          after:text-xs after:opacity-85
          after:transform after:-translate-x-1/2
          after:whitespace-nowrap
          after:font-medium
          after:text-white/85
        `}
        renderThumb={(props, state) => (
          <div
            {...props}
            aria-label={`Slider value: ${state.valueNow}%`}
            aria-valuenow={state.valueNow}
            role="slider"
            aria-valuemin={state.valueMin}
            aria-valuemax={state.valueMax}
          />
        )}
        renderMark={(props) => {
          if (multiplierMarks[props.key]) {
            return (
              <div
                {...props}
                onClick={() => handleMarkClick(props.key)}
                data-value={multiplierMarks[props.key]}
                role="button"
                tabIndex={0}
                aria-label={`Set zoom to ${multiplierMarks[props.key]}`}
                className={`${props.className} cursor-pointer`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleMarkClick(props.key);
                  }
                }}
              />
            );
          }
          return null;
        }}
      />
    </div>
  );
}

export { SliderComponent as default, SliderComponent as Slider };
