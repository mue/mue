import React from 'react';

import { utcToZonedTime } from 'date-fns-tz';
import EventBus from '../../../modules/helpers/eventbus';

import './clock.scss';

const Analog = React.lazy(() => import('react-clock'));
const renderLoader = () => <></>;

export default class Clock extends React.PureComponent {
  constructor() {
    super();

    this.timer = undefined;
    this.state = {
      time: '',
      ampm: ''
    };
  }

  startTime(time = localStorage.getItem('seconds') === 'true' || localStorage.getItem('timeType') === 'analogue' ? (1000 - Date.now() % 1000) : (60000 - Date.now() % 60000)) {
    this.timer = setTimeout(() => {
      let now = new Date();
      const timezone = localStorage.getItem('timezone');
      if (timezone) {
        now = utcToZonedTime(now, timezone);
      }

      switch (localStorage.getItem('timeType')) {
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
            sec = `:${('00' + now.getSeconds()).slice(-2)}`;
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
              time = `${hours}:${('00' + now.getMinutes()).slice(-2)}${sec}`;
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
    EventBus.on('refresh', (data) => {
      if (data === 'clock' || data === 'timezone') {
        const element = document.querySelector('.clock-container');

        if (localStorage.getItem('time') === 'false') {
          return element.style.display = 'none';
        }

        this.timer = null;
        this.startTime(0);

        element.style.display = 'block';
        element.style.fontSize = `${4 * Number((localStorage.getItem('zoomClock') || 100) / 100)}em`;
      }
    });

    if (localStorage.getItem('timeType') !== 'analogue') {
      document.querySelector('.clock-container').style.fontSize = `${4 * Number((localStorage.getItem('zoomClock') || 100) / 100)}em`;
    }

    this.startTime(0);
  }

  componentWillUnmount() {
    EventBus.remove('refresh');
  }

  render() {
    let clockHTML = <h1 className='clock clock-container'>{this.state.time}<span className='ampm'>{this.state.ampm}</span></h1>;

    const enabled = (setting) => {
      return (localStorage.getItem(setting) === 'true');
    };

    if (localStorage.getItem('timeType') === 'analogue') {
      clockHTML = (
        <React.Suspense fallback={renderLoader()}>
          <Analog 
            className='analogclock clock-container' 
            value={this.state.time} 
            renderMinuteMarks={enabled('minuteMarks')}
            renderHourMarks={enabled('hourMarks')} 
            renderSecondHand={enabled('secondHand')} 
            renderMinuteHand={enabled('minuteHand')} 
            renderHourHand={enabled('hourHand')} 
          />
        </React.Suspense>
      );
    }

    return clockHTML;
  }
}
