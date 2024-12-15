import React, { useState, useEffect } from 'react';
import { useTimeUpdate } from '../hooks/useTimeUpdate';
import { useClockZoom } from '../hooks/useClockZoom';
import { useTime } from '../context/TimeContext';
import defaults from '../options/default';

export const VerticalClock = () => {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [seconds, setSeconds] = useState('');
  const { elementRef } = useClockZoom();
  const { currentDate, updateTime } = useTime();

  useTimeUpdate(updateTime);

  useEffect(() => {
    const zero = localStorage.getItem('zero');
    const showSeconds = localStorage.getItem('seconds') === 'true';

    let hours = currentDate.getHours();
    const minutes = ('00' + currentDate.getMinutes()).slice(-2);

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
      setSeconds(('00' + currentDate.getSeconds()).slice(-2));
    }
  }, [currentDate]);

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
