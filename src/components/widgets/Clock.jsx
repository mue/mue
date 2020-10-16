import React from 'react';
import Analog from 'react-clock';

export default class Clock extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.timer = undefined;
    this.state = {
      time: '',
      ampm: ''
    };
  }

  startTime(time = localStorage.getItem('seconds') === 'true' || localStorage.getItem('analog') === 'true' ? (1000 - Date.now() % 1000) : (60000 - Date.now() % 60000)) {
    this.timer = setTimeout(() => {
      const now = new Date();

      // Analog clock
      if (localStorage.getItem('analog') === 'true') this.setState({ time: now });
      else {
        let sec = '';

        // Extra 0
        const zero = localStorage.getItem('zero');

        if (localStorage.getItem('seconds') === 'true') {
          if (zero === 'false') sec = `:${now.getSeconds()}`;
          else sec = `:${('00' + now.getSeconds()).slice(-2)}`;
        }

        if (localStorage.getItem('24hour') === 'true') {
          let time = '';
          if (zero === 'false') time = `${now.getHours()}:${now.getMinutes()}${sec}`;
          else time = `${('00' + now.getHours()).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}${sec}`;

          this.setState({ time: time });
        } else {
          // 12 hour support
          let hours = now.getHours();
          if (hours > 12) hours -= 12;

          // Toggle AM/PM
          let ampm = now.getHours() > 11 ? 'PM' : 'AM';
          if (localStorage.getItem('ampm') === 'false') ampm = '';

          let time = '';
          if (zero === 'false') time = `${hours}:${now.getMinutes()}${sec}`;
          else time = `${('00' + hours).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}${sec}`;

          this.setState({
            time: time,
            ampm: ampm
          });
        }
      }

      this.startTime();
    }, time);
  }

  componentDidMount() {
    if (localStorage.getItem('time') === 'false') return;
    this.startTime(0);
  }

  render() {
    if (localStorage.getItem('time') === 'false') return null;

    let clockHTML = <h1 className='clock'>{this.state.time}<span className='ampm'>{this.state.ampm}</span> </h1>;
    if (localStorage.getItem('analog') === 'true') clockHTML = <Analog className='analogclock' value={this.state.time} renderHourMarks={false} renderMinuteMarks={false} />;

    return clockHTML;
  }
}
