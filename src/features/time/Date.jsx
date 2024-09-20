import variables from 'config/variables';
import { useState, useEffect, useRef, useCallback } from 'react';

import { appendNth, convertTimezone } from 'utils/date';
import EventBus from 'utils/eventbus';
import defaults from './options/default';

import './date.scss';

const DateWidget = () => {
  const [date, setDate] = useState('');
  const [weekNumber, setWeekNumber] = useState(null);
  const dateRef = useRef();

  /**
   * Get the week number of the year for the given date.
   * @param {Date} date
   */
  const getWeekNumber = useCallback((date) => {
    const dateToday = new Date(date.valueOf());
    const dayNumber = (dateToday.getDay() + 6) % 7;

    dateToday.setDate(dateToday.getDate() - dayNumber + 3);
    const firstThursday = dateToday.valueOf();
    dateToday.setMonth(0, 1);

    if (dateToday.getDay() !== 4) {
      dateToday.setMonth(0, 1 + ((4 - dateToday.getDay() + 7) % 7));
    }

    setWeekNumber(
      `${variables.getMessage('widgets.date.week')} ${
        1 + Math.ceil((firstThursday - dateToday) / 604800000)
      }`,
    );
  }, []);

  const getDate = useCallback(() => {
    let currentDate = new Date();
    const timezone = localStorage.getItem('timezone');
    if (timezone && timezone !== 'auto') {
      currentDate = convertTimezone(currentDate, timezone);
    }

    if (localStorage.getItem('weeknumber') === 'true') {
      getWeekNumber(currentDate);
    } else if (weekNumber !== null) {
      setWeekNumber(null);
    }

    if (localStorage.getItem('dateType') === 'short') {
      const dateDay = currentDate.getDate();
      const dateMonth = currentDate.getMonth() + 1;
      const dateYear = currentDate.getFullYear();

      const zero = localStorage.getItem('datezero') === 'true';

      let day = zero ? ('00' + dateDay).slice(-2) : dateDay;
      let month = zero ? ('00' + dateMonth).slice(-2) : dateMonth;
      let year = dateYear;

      switch (localStorage.getItem('dateFormat')) {
        case 'MDY':
          day = dateMonth;
          month = dateDay;
          break;
        case 'YMD':
          day = dateYear;
          year = dateDay;
          break;
        // DMY
        default:
          break;
      }

      let format;
      switch (localStorage.getItem('shortFormat')) {
        case 'dots':
          format = `${day}.${month}.${year}`;
          break;
        case 'dash':
          format = `${day}-${month}-${year}`;
          break;
        case 'gaps':
          format = `${day} - ${month} - ${year}`;
          break;
        case 'slashes':
          format = `${day}/${month}/${year}`;
          break;
        default:
          break;
      }

      setDate(format);
    } else {
      // Long date
      const lang = variables.locale_id.split('-')[0];

      const datenth =
        localStorage.getItem('datenth') === 'true'
          ? appendNth(currentDate.getDate())
          : currentDate.getDate();

      const dateDay =
        localStorage.getItem('dayofweek') === 'true'
          ? currentDate.toLocaleDateString(lang, { weekday: 'long' })
          : '';
      const dateMonth = currentDate.toLocaleDateString(lang, { month: 'long' });
      const dateYear = currentDate.getFullYear();

      let day = dateDay + ' ' + datenth;
      let month = dateMonth;
      let year = dateYear;
      switch (localStorage.getItem('longFormat')) {
        case 'MDY':
          day = dateMonth;
          month = dateDay + ' ' + datenth;
          break;
        case 'YMD':
          day = dateYear;
          year = dateDay + ' ' + datenth;
          break;
        // DMY
        default:
          break;
      }

      setDate(`${day} ${month} ${year}`);
    }
  }, [getWeekNumber, weekNumber]);

  useEffect(() => {
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
    getDate();

    return () => {
      EventBus.off('refresh', handleRefresh);
    };
  }, [getDate]);

  return (
    <div className="flex flex-col" ref={dateRef}>
      <span className="date">{date}</span>
      <span className="date">{weekNumber}</span>
    </div>
  );
};

export { DateWidget as default, DateWidget };
