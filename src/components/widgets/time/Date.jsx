import React from 'react';

import EventBus from '../../../modules/helpers/eventbus';

import dtf from '../../../modules/helpers/date';

import './date.scss';

export default class DateWidget extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      date: '',
      weekNumber: null
    };
  }

  getWeekNumber(date) {
    const dateToday = new Date(date.valueOf());
    const dayNumber = (dateToday.getDay() + 6) % 7;

    dateToday.setDate(dateToday.getDate() - dayNumber + 3);
    const firstThursday = dateToday.valueOf();
    dateToday.setMonth(0, 1);

    if (dateToday.getDay() !== 4) {
      dateToday.setMonth(0, 1 + ((4 - dateToday.getDay()) + 7) % 7);
    }

    this.setState({
      weekNumber: `${window.language.widgets.date.week} ${1 + Math.ceil((firstThursday - dateToday) / 604800000)}`
    });
  }

  getDate() {
    const date = new Date();

    if (localStorage.getItem('weeknumber') === 'true') {
      this.getWeekNumber(date);
    } else if (this.state.weekNumber !== null) {
      this.setState({
        weekNumber: null
      });
    }

    if (localStorage.getItem('dateType') === 'short') {
      const dateDay = date.getDate();
      const dateMonth = date.getMonth() + 1;
      const dateYear = date.getFullYear();

      const zero = (localStorage.getItem('datezero') === 'true');

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
        date: format
      });
    } else {
      // Long date
      const lang = localStorage.getItem('language').split('_')[0];

      const nth = (localStorage.getItem('datenth') === 'true') ? dtf.nth(date.getDate()) : date.getDate();

      const day = (localStorage.getItem('dayofweek') === 'true') ? date.toLocaleDateString(lang, { weekday: 'long' }) : '';
      const month = date.toLocaleDateString(lang, { month: 'long' });

      this.setState({
        date: `${day} ${nth} ${month} ${date.getFullYear()}`
      });
    }
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'date') {
        const element = document.querySelector('.date');

        if (localStorage.getItem('date') === 'false') {
          return element.style.display = 'none';
        }

        element.style.display = 'block';
        element.style.fontSize = `${Number((localStorage.getItem('zoomDate') || 100) / 100)}em`;
        this.getDate();
      }
    });

    document.querySelector('.date').style.fontSize = `${Number((localStorage.getItem('zoomDate') || 100) / 100)}em`;

    this.getDate();
  }

  componentWillUnmount() {
    EventBus.remove('refresh');
  }

  render() {
    return <span className='date'>{this.state.date} <br/> {this.state.weekNumber}</span>;
  }
}
