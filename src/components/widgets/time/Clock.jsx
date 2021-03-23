import React from 'react';

import Analog from 'react-clock';

import './clock.scss';

export default class Clock extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.timer = undefined;
    this.state = {
      time: '',
      ampm: ''
    };
  }

  startTime(time = localStorage.getItem('seconds') === 'true' || localStorage.getItem('timeType') === 'analogue' ? (1000 - Date.now() % 1000) : (60000 - Date.now() % 60000)) {
    this.timer = setTimeout(() => {
      const now = new Date();

      const timeType = localStorage.getItem('timeType');

      switch (timeType) {
        case 'percentageComplete':
          this.setState({
            time: (now.getHours() / 24).toFixed(2).replace('0.', '') + '%'
          });
          break; 
        case 'analogue':
          // load analog clock css
          require('react-clock/dist/Clock.css');

          this.setState({
            time: now
          });
          break;
        default:
          // Default clock
          let time, sec = '';
          const zero = localStorage.getItem('zero');

          if (localStorage.getItem('seconds') === 'true') {
            if (zero === 'false') {
              sec = ':' + now.getSeconds();
            } else {
              sec = `:${('00' + now.getSeconds()).slice(-2)}`;
            }
          }

          if (localStorage.getItem('timeformat') === 'twentyfourhour') {
            if (zero === 'false') {
              time = `${now.getHours()}:${('00' + now.getMinutes()).slice(-2)}${sec}`;
            } else {
              time = `${('00' + now.getHours()).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}${sec}`;
            }

            this.setState({
              time: time
            });
          } else {
            // 12 hour
            let hours = now.getHours();

            if (hours > 12) {
              hours -= 12;
            }

            if (zero === 'false') {
              time = `${hours}:${now.getMinutes()}${sec}`;
            } else {
              time = `${('00' + hours).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}${sec}`;
            }

            this.setState({
              time: time,
              ampm: now.getHours() > 11 ? 'PM' : 'AM'
            });
          }
          break;
      }

      this.startTime();
    }, time);
  }

  componentDidMount() {
    this.startTime(0);
  }

  render() {
    let clockHTML = <h1 className='clock'>{this.state.time}<span className='ampm'>{this.state.ampm}</span></h1>;

    const checkValue = (setting) => {
      return (localStorage.getItem(setting) === 'true');
    }

    if (localStorage.getItem('timeType') === 'analogue') {
      clockHTML = (
        <Analog 
          className='analogclock' 
          value={this.state.time} 
          renderHourMarks={checkValue('hourMarks')} 
          renderMinuteMarks={checkValue('minuteMarks')} 
          renderSecondHand={checkValue('secondHand')} 
          renderMinuteHand={checkValue('minuteHand')} 
          renderHourHand={checkValue('hourHand')} 
        />
      );
    }

    return clockHTML;
  }
}
