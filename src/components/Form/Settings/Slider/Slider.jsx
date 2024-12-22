import variables from 'config/variables';
import { useState, useCallback, memo, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import ReactSlider from 'react-slider';
import { MdRefresh, MdEdit } from 'react-icons/md';
import EventBus from 'utils/eventbus';
import clsx from 'clsx';
import debounce from 'lodash/debounce';

// Style definitions split into logical groups for better readability
const buttonStyles = {
  base: 'inline-flex items-center text-sm px-3 py-1.5 rounded-md font-medium',
  colors: 'bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400',
  darkMode: 'dark:bg-white/10 dark:hover:bg-white/15 dark:active:bg-white/20',
  text: 'text-neutral-800 dark:text-white',
  transitions: 'transition-colors duration-200',
};

const thumbStyles = {
  base: [
    'w-5 h-5 rounded-full cursor-pointer',
    'absolute top-1/2',
    'flex items-center justify-center',
    '-translate-y-1/2', // Keep only Y transform in classes
  ],
  colors: 'bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-white dark:to-neutral-100',
  interactions: [
    'hover:from-neutral-100 hover:to-neutral-300',
    'dark:hover:from-white dark:hover:to-neutral-200',
    'focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-white/40',
  ],
  // Remove transition-all which was causing lag
  effects: 'shadow-lg shadow-black/10 dark:shadow-black/25',
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
    'after:left-1/2', // Add this to position relative to center
    'after:transform after:-translate-x-1/2', // Center the label
    'after:whitespace-nowrap after:pointer-events-none',
    'after:font-medium',
    'after:text-center', // Ensure text is centered
    'after:text-neutral-700 dark:after:text-white/85',
  ],
};

const MULTIPLIER_MARKS = {
  10: '0.1x',
  100: '1x',
  200: '2x',
  400: '4x',
};

// Update ValueDisplay component to show edit affordance
const ValueDisplay = memo(({ value, display, onChange, min, max }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e) => {
    // Allow typing any numeric input, validate on blur
    const numericValue = e.target.value.replace(/[^\d.-]/g, '');
    setInputValue(numericValue);
  };

  const handleBlur = () => {
    setEditing(false);
    const numValue = Number(inputValue);

    // Only validate and clamp on blur
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(Math.max(numValue, min), max);
      setInputValue(clampedValue);
      onChange(clampedValue);
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditing(false);
      setInputValue(value);
    }
  };

  return editing ? (
    <input
      type="number" // Change to number type
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      min={min} // Optional: add min/max if needed
      max={max}
      step="any" // Allow decimal values
      className="w-20 text-sm bg-neutral-200 dark:bg-white/15 text-neutral-800 dark:text-white 
                px-3 py-1.5 rounded-md font-medium outline-none focus:ring-2 
                focus:ring-neutral-400 dark:focus:ring-white/40
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                transition-colors duration-200" // Added transition
      autoFocus
    />
  ) : (
    <div
      onClick={() => setEditing(true)}
      className="group relative flex items-center gap-2 text-sm bg-neutral-200 dark:bg-white/15 
                text-neutral-800 dark:text-white px-3 py-1.5 rounded-md font-medium cursor-pointer 
                hover:bg-neutral-300 dark:hover:bg-white/20 transition-colors duration-200"
    >
      <span className="flex items-center">
        {value}
        <span className="text-neutral-500 dark:text-white/50 ml-0.5">{display}</span>
      </span>
      <MdEdit className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
      <span
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 
                     dark:bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 
                     transition-opacity duration-200 whitespace-nowrap"
      >
        Click to edit
      </span>
    </div>
  );
});

// Memoized reset button component
const ResetButton = memo(({ onClick }) => (
  <button
    onClick={onClick}
    className={clsx(
      buttonStyles.base,
      buttonStyles.colors,
      buttonStyles.darkMode,
      buttonStyles.text,
      buttonStyles.transitions,
    )}
  >
    <MdRefresh className="w-4 h-4 mr-1.5" />
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

  const isDraggingRef = useRef(false);
  const lastUpdateRef = useRef(value);

  // Separated storage update from visual update
  const updateStorage = useCallback(
    (newValue) => {
      try {
        localStorage.setItem(props.name, newValue);
        lastUpdateRef.current = newValue;

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
    },
    [props.element, props.category],
  );

  // More efficient debounced storage update
  const debouncedUpdate = useMemo(() => debounce(updateStorage, 150), [updateStorage]);

  const handleChange = useCallback(
    (newValue) => {
      if (typeof newValue !== 'number') return;
      const clampedValue = Math.min(Math.max(newValue, props.min), props.max);

      // Always update visual state immediately
      setValue(clampedValue);

      // Only update storage if we're not actively dragging
      if (!isDraggingRef.current) {
        debouncedUpdate(clampedValue);
      }
    },
    [props.min, props.max, debouncedUpdate],
  );

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
    // Ensure final value is stored
    if (lastUpdateRef.current !== value) {
      updateStorage(value);
    }
  }, [value, updateStorage]);

  // Update thumbStyles to include performance optimizations
  const enhancedThumbStyles = {
    ...thumbStyles,
    performance: [
      'will-change-transform',
      'transform translate3d(0,0,0)',
      'backface-visibility-hidden',
    ],
  };

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
        style={{
          ...thumbProps.style,
          left: thumbProps.style.left,
          marginLeft: 0,
          transform: 'translateY(-50%)', // Only handle Y transform here
        }}
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
          <ValueDisplay
            value={value}
            display={props.display}
            onChange={handleChange}
            min={Number(props.min)}
            max={Number(props.max)}
          />
          <ResetButton onClick={resetItem} />
        </div>
      </div>

      <ReactSlider
        value={value}
        onChange={handleChange}
        onBeforeChange={handleDragStart}
        onAfterChange={handleDragEnd}
        min={Number(props.min)}
        max={Number(props.max)}
        step={Number(props.step) || 1}
        marks={Object.keys(MULTIPLIER_MARKS).map(Number)}
        snapPoints={Object.keys(MULTIPLIER_MARKS).map(Number)}
        snap
        className="h-14 flex items-center touch-none"
        thumbClassName={clsx([
          ...thumbStyles.base,
          thumbStyles.colors,
          ...thumbStyles.interactions,
          thumbStyles.effects,
          ...thumbStyles.tooltip,
          'touch-none',
          'left-0', // Add this to ensure proper positioning
        ])}
        trackClassName="h-2 bg-neutral-300 dark:bg-white/15 rounded-full absolute top-1/2 transform -translate-y-1/2 touch-none"
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
const Slider = memo(SliderComponent);
Slider.displayName = 'Slider';

export { Slider as default, Slider };
