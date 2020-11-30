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
    const dateFormat = localStorage.getItem('dateFormat');

    if (short === 'true') {
      const dateDay = date.getDate();
      const dateMonth = date.getMonth() + 1;
      const dateYear = date.getFullYear();

      let day = dateDay, month = dateMonth, year = dateYear;

      switch (dateFormat) {
        case 'MDY':
          day = dateMonth;
          month = dateDay;
          break;
        case 'YMD':
          day = dateYear;
          year = dateDay;
          break;
        default: break; // DMY
      }

      let format;
      switch (localStorage.getItem('shortFormat')) {
        case 'dash': format = `${day}-${month}-${year}`; break;
        case 'gaps': format = `${day} - ${month} - ${year}`; break;
        default: format = `${day}/${month}/${year}`;
      }

      this.setState({ date: format });
    } else { // full date
      const lang = localStorage.getItem('language');

      const day = date.toLocaleDateString(lang, { weekday: 'long' });
      const nth = (localStorage.getItem('datenth') === 'true') ? dtf.nth(date.getDate()) : date.getDate();
      const month = date.toLocaleDateString(lang, { month: 'long' });
      const year = date.getFullYear();

      this.setState({ date: `${day} ${nth} ${month} ${year}` });
    }
  }

  componentDidMount() {
    if (localStorage.getItem('date') === 'false') return;
    this.getDate();
  }

  render() {
    return <span style={{ 'textTransform': 'capitalize', 'fontWeight': 'bold' }}>{this.state.date}</span>
  }
}