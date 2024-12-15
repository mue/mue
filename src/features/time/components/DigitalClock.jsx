import React, { useState } from 'react';
import { useTimeUpdate } from '../hooks/useTimeUpdate';
import { useClockZoom } from '../hooks/useClockZoom';
import { convertTimezone } from 'utils/date';

export const DigitalClock = () => {
  const [time, setTime] = useState('');
  const [ampm, setAmpm] = useState('');
  const { elementRef } = useClockZoom();

  const updateTime = () => {
    let now = new Date();
    const timezone = localStorage.getItem('timezone');
    const zero = localStorage.getItem('zero');
    const showSeconds = localStorage.getItem('seconds') === 'true';

    if (timezone && timezone !== 'auto') {
      now = convertTimezone(now, timezone);
    }

    let timeStr = '';
    let hours = now.getHours();
    const minutes = ('00' + now.getMinutes()).slice(-2);
    const seconds = showSeconds ? `:${('00' + now.getSeconds()).slice(-2)}` : '';

    if (localStorage.getItem('timeformat') === 'twentyfourhour') {
      timeStr =
        zero === 'false'
          ? `${hours}:${minutes}${seconds}`
          : `${('00' + hours).slice(-2)}:${minutes}${seconds}`;
      setAmpm('');
    } else {
      if (hours > 12) {
        hours -= 12;
      } else if (hours === 0) {
        hours = 12;
      }
      timeStr =
        zero === 'false'
          ? `${hours}:${minutes}${seconds}`
          : `${('00' + hours).slice(-2)}:${minutes}${seconds}`;
      setAmpm(now.getHours() > 11 ? 'PM' : 'AM');
    }
    setTime(timeStr);
  };

  useTimeUpdate(updateTime);

  return (
    <span className="clock clock-container" ref={elementRef}>
      {time}
      <span className="ampm">{ampm}</span>
    </span>
  );
};
