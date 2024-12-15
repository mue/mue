import React, { useState } from 'react';
import { useTimeUpdate } from '../hooks/useTimeUpdate';
import { useClockZoom } from '../hooks/useClockZoom';
import { convertTimezone } from 'utils/date';
import defaults from '../options/default';

export const VerticalClock = () => {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [seconds, setSeconds] = useState('');
  const { elementRef, updateZoom } = useClockZoom();

  const updateTime = () => {
    let now = new Date();
    const timezone = localStorage.getItem('timezone');
    const zero = localStorage.getItem('zero');
    const showSeconds = localStorage.getItem('seconds') === 'true';

    if (timezone && timezone !== 'auto') {
      now = convertTimezone(now, timezone);
    }

    let hours = now.getHours();
    const minutes = ('00' + now.getMinutes()).slice(-2);

    if (localStorage.getItem('timeformat') !== 'twentyfourhour') {
      if (hours > 12) {
        hours -= 12;
      } else if (hours === 0) {
        hours = 12;
      }
    }

    setHour(zero === 'false' ? `${hours}` : ('00' + hours).slice(-2));
    setMinute(minutes);
    if (showSeconds) {
      setSeconds(('00' + now.getSeconds()).slice(-2));
    }
  };

  useTimeUpdate(updateTime);

  const hourColour = localStorage.getItem('hourColour') || defaults.hourColour;
  const minuteColour = localStorage.getItem('minuteColour') || defaults.minuteColour;
  const secondColour = localStorage.getItem('secondColour') || defaults.secondColour;

  return (
    <span className="vertical-clock clock-container" ref={elementRef}>
      <div className="hour" style={{ color: hourColour }}>
        {hour}
      </div>
      <div className="minute" style={{ color: minuteColour }}>
        {minute}
      </div>
      {localStorage.getItem('seconds') === 'true' && (
        <div className="seconds" style={{ color: secondColour }}>
          {seconds}
        </div>
      )}
    </span>
  );
};
