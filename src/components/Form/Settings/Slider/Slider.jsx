import variables from 'config/variables';
import { memo, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { MdRefresh } from 'react-icons/md';

import EventBus from 'utils/eventbus';

import './Slider.scss';

const SliderComponent = memo((props) => {
  const [value, setValue] = useState(localStorage.getItem(props.name) || props.default);
  const [hoverValue, setHoverValue] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);
  const animationRef = useRef(null);
  const sliderRef = useRef(null);

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
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = Number(value);
    const endValue = Number(props.default || 0);
    const duration = 300; // milliseconds
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const currentValue = startValue + (endValue - startValue) * easeOutCubic;
      const roundedValue =
        Math.round(currentValue / (Number(props.step) || 1)) * (Number(props.step) || 1);

      localStorage.setItem(props.name, roundedValue);
      setValue(roundedValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure we end exactly at the target value
        localStorage.setItem(props.name, endValue);
        setValue(endValue);
        EventBus.emit('refresh', props.category);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    toast(variables.getMessage('toasts.reset'));
  }, [value, props]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!sliderRef.current || props.disabled) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

      const range = Number(props.max) - Number(props.min);
      const rawValue = (percentage / 100) * range + Number(props.min);
      const step = Number(props.step) || 1;
      const snappedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.max(Number(props.min), Math.min(Number(props.max), snappedValue));

      setHoverPosition(percentage);
      setHoverValue(clampedValue);
    },
    [props],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverValue(null);
  }, []);

  const percentage =
    ((Number(value) - Number(props.min)) / (Number(props.max) - Number(props.min))) * 100;

  return (
    <div className="slider-container">
      <div className="slider-header">
        <span className="slider-value">{Number(value)}</span>
        <span className="slider-reset" onClick={resetItem}>
          <MdRefresh />
          {variables.getMessage('modals.main.settings.buttons.reset')}
        </span>
      </div>
      <div className="slider-wrapper" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <input
          ref={sliderRef}
          type="range"
          className="slider-input"
          value={Number(value)}
          onChange={handleChange}
          min={Number(props.min)}
          max={Number(props.max)}
          step={Number(props.step) || 1}
          style={{ '--slider-percentage': `${percentage}%` }}
          aria-label={props.title}
          aria-valuemin={Number(props.min)}
          aria-valuemax={Number(props.max)}
          aria-valuenow={Number(value)}
          disabled={props.disabled || false}
        />
        {hoverValue !== null && !props.disabled && (
          <>
            <div className="slider-hover-indicator" style={{ left: `${hoverPosition}%` }} />
            <div className="slider-hover-tooltip" style={{ left: `${hoverPosition}%` }}>
              {hoverValue}
            </div>
          </>
        )}
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
