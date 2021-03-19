import React from 'react';

import dtf from '@eartharoid/dtf';

export default class DateWidget extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      date: ''
    };
  }

  getDate() {
    const date = new Date();
    const short = localStorage.getItem('short');

    if (short === 'true') {
      const dateDay = date.getDate();
      const dateMonth = date.getMonth() + 1;
      const dateYear = date.getFullYear();

      let day = dateDay;
      let month = dateMonth;
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
      }

      this.setState({
        date: format
      });
    } else {
      // Full date
      const lang = localStorage.getItem('language');

      const nth = (localStorage.getItem('datenth') === 'true') ? dtf.nth(date.getDate()) : date.getDate();

      const day = (localStorage.getItem('dayofweek') === 'true') ? date.toLocaleDateString(lang, { weekday: 'long' }) : '';
      const month = date.toLocaleDateString(lang, { month: 'long' });
      const year = date.getFullYear();

      this.setState({
        date: `${day} ${nth} ${month} ${year}`
      });
    }
  }

  // based on https://gist.github.com/IamSilviu/5899269#gistcomment-2773524
  getWeekNumber() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  componentDidMount() {
    this.getDate();
  }

  render() {
    return (
      <div>
        <span style={{ 'textTransform': 'capitalize', 'fontWeight': 'bold' }}>{this.state.date}</span>
        {(localStorage.getItem('weeknumber') === 'true') ?
          <span style={{ 'textTransform': 'capitalize', 'fontWeight': 'bold' }}><br/>
            {'Week ' + this.getWeekNumber()}
          </span>
        :null}
      </div>
    )
  }
}
