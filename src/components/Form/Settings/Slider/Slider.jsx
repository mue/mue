import variables from 'config/variables';
import { useState, useCallback, memo, useMemo } from 'react';
import { toast } from 'react-toastify';
import ReactSlider from 'react-slider';
import { MdRefresh, MdEdit } from 'react-icons/md';
import EventBus from 'utils/eventbus';
import clsx from 'clsx';

// Style definitions split into logical groups for better readability
const buttonStyles = {
  base: 'inline-flex items-center text-sm px-3 py-1.5 rounded-md font-medium',
  colors: 'bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400',
  darkMode: 'dark:bg-white/10 dark:hover:bg-white/15 dark:active:bg-white/20',
  text: 'text-neutral-800 dark:text-white',
  transitions: 'transition-colors duration-200',
};

const inputStyles = {
  base: 'w-20 text-sm px-3 py-1.5 rounded-md font-medium text-center',
  colors: 'bg-neutral-200 hover:bg-neutral-300 focus:bg-neutral-300',
  darkMode: 'dark:bg-white/10 dark:hover:bg-white/15 dark:focus:bg-white/15',
  text: 'text-neutral-800 dark:text-white',
  focus: 'focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-white/40',
  transitions: 'transition-colors duration-200',
};

const thumbStyles = {
  base: [
    'w-5 h-5 rounded-full cursor-pointer',
    'absolute top-1/2 transform -translate-y-1/2',
    'flex items-center justify-center',
  ],
  colors: 'bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-white dark:to-neutral-100',
  interactions: [
    'hover:from-neutral-100 hover:to-neutral-300',
    'dark:hover:from-white dark:hover:to-neutral-200',
    'focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-white/40',
    'active:scale-95',
  ],
  effects: 'shadow-lg shadow-black/10 dark:shadow-black/25 transition-all duration-200',
  tooltip: [
    'before:content-[attr(aria-valuenow)]',
    'before:absolute before:top-[-28px]',
    'before:text-xs before:bg-neutral-800 dark:before:bg-black/90',
    'before:text-white before:px-2 before:py-1 before:rounded-md',
    'before:opacity-0 hover:before:opacity-100',
    'before:transition-all before:duration-200 before:whitespace-nowrap',
    'before:shadow-lg',
  ],
};

const markStyles = {
  base: [
    'h-3 w-1.5 rounded-full cursor-pointer select-none',
    'absolute top-1/2 transform -translate-y-1/2',
  ],
  colors: 'bg-neutral-400 dark:bg-white/30',
  hover: 'hover:bg-neutral-600 dark:hover:bg-white/50 hover:scale-110',
  transitions: 'hover:transition-transform hover:duration-200',
  label: [
    'after:content-[attr(data-value)]',
    'after:absolute after:top-5',
    'after:text-xs after:opacity-85',
    'after:transform after:-translate-x-1/2',
    'after:whitespace-nowrap after:pointer-events-none',
    'after:font-medium',
    'after:text-neutral-700 dark:after:text-white/85',
  ],
};

const MULTIPLIER_MARKS = {
  10: '0.1x',
  100: '1x',
  200: '2x',
  400: '4x',
};

// Memoized value display component
const ValueDisplay = memo(({ value, display, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    const newValue = Number(inputValue);
    if (!isNaN(newValue)) {
      onChange(newValue);
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(value);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={clsx(
          inputStyles.base,
          inputStyles.colors,
          inputStyles.darkMode,
          inputStyles.text,
          inputStyles.focus,
          inputStyles.transitions,
        )}
        autoFocus
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm bg-neutral-200 dark:bg-white/15 text-neutral-800 dark:text-white px-3 py-1.5 rounded-md font-medium">
        {value}
        {display}
      </span>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1.5 rounded-md hover:bg-neutral-300 dark:hover:bg-white/15 transition-colors duration-200"
        aria-label="Edit value"
      >
        <MdEdit className="w-4 h-4 text-neutral-600 dark:text-white/70" />
      </button>
    </div>
  );
});
// Memoized reset button component
const ResetButton = memo(({ onClick, defaultValue }) => (
  <button
    onClick={onClick}
    className={clsx(
      buttonStyles.base,
      buttonStyles.colors,
      buttonStyles.darkMode,
      buttonStyles.text,
      buttonStyles.transitions,
      'group focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-white/40',
    )}
    aria-label={`Reset to default value: ${defaultValue}`}
  >
    <MdRefresh className="w-4 h-4 mr-1.5 group-hover:rotate-180 transition-transform duration-300" />
    {variables.getMessage('settings:buttons.reset')}
  </button>
));

function SliderComponent(props) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(props.name);
      return stored ? Number(stored) : Number(props.default);
    } catch (e) {
      return Number(props.default);
    }
  });

  const handleChange = useCallback(
    (newValue) => {
      if (typeof newValue !== 'number') return;
      const clampedValue = Math.min(Math.max(newValue, props.min), props.max);

      // Update state immediately for smooth UI
      setValue(clampedValue);

      // Batch heavy operations in requestAnimationFrame
      requestAnimationFrame(() => {
        try {
          localStorage.setItem(props.name, clampedValue);

          if (props.element && !document.querySelector(props.element)) {
            const reminderElement = document.querySelector('.reminder-info');
            if (reminderElement) {
              reminderElement.style.display = 'flex';
              localStorage.setItem('showReminder', true);
              return;
            }
          }

          EventBus.emit('refresh', props.category);
        } catch (e) {
          console.error('Error updating slider:', e);
        }
      });
    },
    [props.min, props.max, props.name, props.element, props.category],
  );

  const resetItem = useCallback(() => {
    handleChange(Number(props.default));
    toast(variables.getMessage('toasts.reset'));
  }, [props.default, handleChange]);

  const handleMarkClick = useCallback(
    (markValue) => {
      handleChange(markValue);
    },
    [handleChange],
  );

  // Memoized render functions to prevent unnecessary re-renders
  const renderThumb = useMemo(
    () => (thumbProps, state) => (
      <div
        {...thumbProps}
        aria-label={`Slider value: ${state.valueNow}%`}
        aria-valuenow={`${state.valueNow}${props.display}`}
        role="slider"
        aria-valuemin={state.valueMin}
        aria-valuemax={state.valueMax}
      />
    ),
    [props.display],
  );

  const renderMark = useMemo(
    () => (markProps) => {
      if (!MULTIPLIER_MARKS[markProps.key]) return null;

      return (
        <div
          {...markProps}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleMarkClick(markProps.key);
          }}
          onMouseDown={(e) => e.preventDefault()}
          data-value={MULTIPLIER_MARKS[markProps.key]}
          role="button"
          tabIndex={0}
          aria-label={`Set zoom to ${MULTIPLIER_MARKS[markProps.key]}`}
          className={`${markProps.className} cursor-pointer`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleMarkClick(markProps.key);
            }
          }}
        />
      );
    },
    [handleMarkClick],
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-800 dark:text-white">{props.title}</span>
        <div className="flex items-center gap-2 justify-between w-full">
          <ValueDisplay value={value} display={props.display} onChange={handleChange} />
          <ResetButton onClick={resetItem} defaultValue={props.default} />
        </div>
      </div>

      <ReactSlider
        value={value}
        onChange={handleChange}
        min={Number(props.min)}
        max={Number(props.max)}
        step={Number(props.step) || 1}
        marks={Object.keys(MULTIPLIER_MARKS).map(Number)}
        snapPoints={Object.keys(MULTIPLIER_MARKS).map(Number)}
        snap
        className="h-14 flex items-center"
        thumbClassName={clsx([
          ...thumbStyles.base,
          thumbStyles.colors,
          ...thumbStyles.interactions,
          thumbStyles.effects,
          ...thumbStyles.tooltip,
        ])}
        trackClassName="h-2 bg-neutral-300 dark:bg-white/15 rounded-full absolute top-1/2 transform -translate-y-1/2"
        markClassName={clsx([
          ...markStyles.base,
          markStyles.colors,
          markStyles.hover,
          markStyles.transitions,
          ...markStyles.label,
        ])}
        renderThumb={renderThumb}
        renderMark={renderMark}
      />
    </div>
  );
}

// Export memoized version for better performance when parent components re-render
export const Slider = memo(SliderComponent);
export default Slider;
