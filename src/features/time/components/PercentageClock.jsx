import { useState, useEffect } from 'react';
import { useTimeUpdate } from '../hooks/useTimeUpdate';
import { convertTimezone } from 'utils/date';

export const PercentageClock = () => {
  const [percentage, setPercentage] = useState('');

  const updateTime = () => {
    let now = new Date();
    const timezone = localStorage.getItem('timezone');

    if (timezone && timezone !== 'auto') {
      now = convertTimezone(now, timezone);
    }

    setPercentage((now.getHours() / 24).toFixed(2).replace('0.', '') + '%');
  };

  useTimeUpdate(updateTime);

  return <span className="clock clock-container">{percentage}</span>;
};
