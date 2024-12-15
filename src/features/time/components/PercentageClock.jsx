import { useState, useEffect } from 'react';
import { useTimeUpdate } from '../hooks/useTimeUpdate';
import { useTime } from '../context/TimeContext';

export const PercentageClock = () => {
  const [percentage, setPercentage] = useState('');
  const { currentDate, updateTime } = useTime();

  useTimeUpdate(updateTime);

  useEffect(() => {
    setPercentage((currentDate.getHours() / 24).toFixed(2).replace('0.', '') + '%');
  }, [currentDate]);

  return <span className="clock clock-container">{percentage}</span>;
};
