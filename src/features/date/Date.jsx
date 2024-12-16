import { useState, useEffect, useRef, useCallback } from 'react';

import { convertTimezone } from 'utils/date';
import EventBus from 'utils/eventbus';
import defaults from './options/default';

import { WeekNumber } from './components/WeekNumber';
import { ShortDate } from './components/ShortDate';
import { LongDate } from './components/LongDate';

import './date.scss';

const DateWidget = ({ isPreview = false, staticDate }) => {
  const [date, setDate] = useState('');
  const [weekNumber, setWeekNumber] = useState('');
  const dateRef = useRef();

  const getDate = useCallback(() => {
    let currentDate = isPreview ? staticDate : new Date();

    const timezone = localStorage.getItem('timezone');
    if (!isPreview && timezone && timezone !== 'auto') {
      currentDate = convertTimezone(currentDate, timezone);
    }

    if (localStorage.getItem('dateType') === 'short') {
      setDate(ShortDate(currentDate));
    } else {
      setDate(LongDate(currentDate));
    }

    setWeekNumber(WeekNumber(currentDate));
  }, [isPreview, staticDate]);

  useEffect(() => {
    if (!isPreview) {
      const handleRefresh = (data) => {
        if (data === 'date' || data === 'timezone') {
          if (localStorage.getItem('date') === 'false') {
            dateRef.current.style.display = 'none';
            return;
          }

          dateRef.current.style.display = 'block';
          dateRef.current.style.fontSize = `${Number(
            (localStorage.getItem('zoomDate') || defaults.zoomDate) / 100,
          )}em`;
          getDate();
        }
      };

      EventBus.on('refresh', handleRefresh);
      dateRef.current.style.fontSize = `${Number((localStorage.getItem('zoomDate') || defaults.zoomDate) / 100)}em`;

      return () => {
        EventBus.off('refresh', handleRefresh);
      };
    }

    getDate();
  }, [getDate, isPreview]);

  return (
    <div className="flex flex-col" ref={dateRef}>
      <span className="date">{date}</span>
      <span className="date">{weekNumber}</span>
    </div>
  );
};

export { DateWidget as default, DateWidget };
