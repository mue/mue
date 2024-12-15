import { createContext, useContext, useState } from 'react';
import { convertTimezone } from 'utils/date';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const updateTime = () => {
    let now = new Date();
    const timezone = localStorage.getItem('timezone');

    if (timezone && timezone !== 'auto') {
      now = convertTimezone(now, timezone);
    }
    setCurrentDate(now);
  };

  return (
    <TimeContext.Provider value={{ currentDate, updateTime }}>{children}</TimeContext.Provider>
  );
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};
