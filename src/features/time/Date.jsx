import variables from 'config/variables';
import { useState, useEffect, useRef } from 'react';

import { nth, convertTimezone } from 'utils/date';
import EventBus from 'utils/eventbus';

import './date.scss';

const DateWidget = () => {
  const [date, setDate] = useState('');
  const [weekNumber, setWeekNumber] = useState(null);
  const [display, setDisplay] = useState('block');
  const [fontSize, setFontSize] = useState('1em');
  const dateRef = useRef();

  /**
   * Get the week number of the year for the given date.
   * @param {Date} date
   */
  const getWeekNumber = (date) => {
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
  };

  const getDate = () => {
    let date = new Date();
    const timezone = localStorage.getItem('timezone');
    if (timezone && timezone !== 'auto') {
      date = convertTimezone(date, timezone);
    }

    if (localStorage.getItem('weeknumber') === 'true') {
      getWeekNumber(date);
    } else if (weekNumber !== null) {
      setWeekNumber(null);
    }

    if (localStorage.getItem('dateType') === 'short') {
      const dateDay = date.getDate();
      const dateMonth = date.getMonth() + 1;
      const dateYear = date.getFullYear();

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
      const lang = variables.languagecode.split('_')[0];
      const datenth =
        localStorage.getItem('datenth') === 'true' ? nth(date.getDate()) : date.getDate();
      const dateDay =
        localStorage.getItem('dayofweek') === 'true'
          ? date.toLocaleDateString(lang, { weekday: 'long' })
          : '';
      const dateMonth = date.toLocaleDateString(lang, { month: 'long' });
      const dateYear = date.getFullYear();

      let formattedDate;

      switch (localStorage.getItem('longFormat')) {
        case 'MDY':
          formattedDate = `${dateMonth} ${datenth}, ${dateYear}${dateDay ? `, ${dateDay}` : ''}`;
          break;
        case 'YMD':
          formattedDate = `${dateYear} ${dateMonth} ${datenth}${dateDay ? `, ${dateDay}` : ''}`;
          break;
        // DMY
        default:
          formattedDate = `${datenth} ${dateMonth} ${dateYear}${dateDay ? `, ${dateDay}` : ''}`;
          break;
      }

      setDate(formattedDate);
    }
  };

  useEffect(() => {
    const handleRefresh = (data) => {
      if (data === 'date' || data === 'timezone') {
        if (localStorage.getItem('date') === 'false') {
          setDisplay('none');
          return;
        }

        setDisplay('block');
        setFontSize(`${Number((localStorage.getItem('zoomDate') || 100) / 100)}em`);
        getDate();
      }
    };

    setFontSize(`${Number((localStorage.getItem('zoomDate') || 100) / 100)}em`);
    getDate();

    EventBus.on('refresh', handleRefresh);
    return () => {
      EventBus.off('refresh');
    };
  }, []);

  return (
    <span className="date" ref={dateRef} style={{ display, fontSize }}>
      {date}
      <br />
      {weekNumber}
    </span>
  );
};

export { DateWidget as default, DateWidget };
