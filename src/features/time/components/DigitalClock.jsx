import React, { useState, useMemo, useEffect } from 'react';
import { useTimeUpdate } from '../hooks/useTimeUpdate';
import { useClockZoom } from '../hooks/useClockZoom';
import { useTime } from '../context/TimeContext';

const getTimeSettings = () => {
  const settings = {
    timeformat: localStorage.getItem('timeformat'),
    timezone: localStorage.getItem('timezone'),
    zero: localStorage.getItem('zero'),
    showSeconds: localStorage.getItem('seconds') === 'true',
  };
  return settings;
};

export const DigitalClock = React.memo(() => {
  const [time, setTime] = useState('');
  const [ampm, setAmpm] = useState('');
  const { elementRef } = useClockZoom();
  const { currentDate, updateTime } = useTime();
  const timeSettings = useMemo(getTimeSettings, []);

  useTimeUpdate(updateTime);

  useEffect(() => {
    const { zero, showSeconds, timeformat } = timeSettings;
    let hours = currentDate.getHours();
    const minutes = ('00' + currentDate.getMinutes()).slice(-2);
    const seconds = showSeconds ? `:${('00' + currentDate.getSeconds()).slice(-2)}` : '';

    let timeStr = '';
    if (timeformat === 'twentyfourhour') {
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
      setAmpm(currentDate.getHours() > 11 ? 'PM' : 'AM');
    }
    setTime(timeStr);
  }, [currentDate, timeSettings]);

  return (
    <span className="clock clock-container" ref={elementRef}>
      {time}
      <span className="ampm">{ampm}</span>
    </span>
  );
});
