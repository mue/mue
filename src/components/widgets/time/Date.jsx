import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';

import { nth, convertTimezone } from '../../../modules/helpers/date';
import EventBus from 'modules/helpers/eventbus';

import './date.scss';

export default class DateWidget extends PureComponent {
  constructor() {
    super();
    this.state = {
      date: '',
      weekNumber: null,
    };
    this.date = createRef();
  }

  /**
   * Get the week number of the year for the given date.
   * @param {Date} date
   */
  getWeekNumber(date) {
    const dateToday = new Date(date.valueOf());
    const dayNumber = (dateToday.getDay() + 6) % 7;

    dateToday.setDate(dateToday.getDate() - dayNumber + 3);
    const firstThursday = dateToday.valueOf();
    dateToday.setMonth(0, 1);

    if (dateToday.getDay() !== 4) {
      dateToday.setMonth(0, 1 + ((4 - dateToday.getDay() + 7) % 7));
    }

    this.setState({
      weekNumber: `${variables.getMessage('widgets.date.week')} ${
        1 + Math.ceil((firstThursday - dateToday) / 604800000)
      }`,
    });
  }

  getDate() {
    let date = new Date();
    const timezone = localStorage.getItem('timezone');
    if (timezone && timezone !== 'auto') {
      date = convertTimezone(date, timezone);
    }

    if (localStorage.getItem('weeknumber') === 'true') {
      this.getWeekNumber(date);
    } else if (this.state.weekNumber !== null) {
      this.setState({
        weekNumber: null,
      });
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

      this.setState({
        date: format,
      });
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

      this.setState({
        date: `${day} ${month} ${year}`,
      });
    }
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'date' || data === 'timezone') {
        if (localStorage.getItem('date') === 'false') {
          return (this.date.current.style.display = 'none');
        }

        this.date.current.style.display = 'block';
        this.date.current.style.fontSize = `${Number(
          (localStorage.getItem('zoomDate') || 100) / 100,
        )}em`;
        this.getDate();
      }
    });

    this.date.current.style.fontSize = `${Number(
      (localStorage.getItem('zoomDate') || 100) / 100,
    )}em`;
    this.getDate();
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    return (
      <span className="date" ref={this.date}>
        {this.state.date}
        <br />
        {this.state.weekNumber}
      </span>
    );
  }
}
