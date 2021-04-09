import React from 'react';

import dtf from '@eartharoid/dtf';

export default class DateWidget extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      date: ''
    };
  }

  getDate() {
    const date = new Date();
    const type = localStorage.getItem('dateType');

    if (type === 'short') {
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
        default: break;
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
        default: break;
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
      const year = date.getFullYear();

      this.setState({
        date: `${day} ${nth} ${month} ${year}`
      });
    }
  }

  componentDidMount() {
    this.getDate();
  }

  render() {
    return <span style={{ 'textTransform': 'capitalize', 'fontWeight': 'bold' }}>{this.state.date}</span>;
  }
}
