import { PureComponent, Suspense, lazy } from 'react';

import { convertTimezone } from 'modules/helpers/date';
import EventBus from 'modules/helpers/eventbus';

import './clock.scss';

const Analog = lazy(() => import('react-clock'));

export default class Clock extends PureComponent {
  constructor() {
    super();

    this.timer = undefined;
    this.state = {
      time: '',
      finalHour: '',
      finalMinute: '',
      finalSeconds: '',
      ampm: '',
      nowGlobal: new Date(),
      minuteColour: localStorage.getItem('minuteColour'),
      hourColour: localStorage.getItem('hourColour'),
    };
  }

  startTime(
    time = localStorage.getItem('seconds') === 'true' ||
    localStorage.getItem('timeType') === 'analogue'
      ? 1000 - (Date.now() % 1000)
      : 60000 - (Date.now() % 60000),
  ) {
    this.timer = setTimeout(() => {
      let now = new Date();
      const timezone = localStorage.getItem('timezone');
      if (timezone && timezone !== 'auto') {
        now = convertTimezone(now, timezone);
      }

      switch (localStorage.getItem('timeType')) {
        case 'percentageComplete':
          this.setState({
            time: (now.getHours() / 24).toFixed(2).replace('0.', '') + '%',
            ampm: '',
          });
          break;
        case 'analogue':
          // load analog clock css
          import('react-clock/dist/Clock.css');

          this.setState({
            time: now,
          });
          break;
        default:
          // Default clock
          let time,
            sec = '';
          const zero = localStorage.getItem('zero');

          if (localStorage.getItem('seconds') === 'true') {
            sec = `:${('00' + now.getSeconds()).slice(-2)}`;
            this.setState({ finalSeconds: `:${('00' + now.getSeconds()).slice(-2)}` });
          }

          if (localStorage.getItem('timeformat') === 'twentyfourhour') {
            if (zero === 'false') {
              time = `${now.getHours()}:${('00' + now.getMinutes()).slice(-2)}${sec}`;
              this.setState({
                finalHour: `${now.getHours()}`,
                finalMinute: `${('00' + now.getMinutes()).slice(-2)}`,
              });
            } else {
              time = `${('00' + now.getHours()).slice(-2)}:${('00' + now.getMinutes()).slice(
                -2,
              )}${sec}`;
              this.setState({
                finalHour: `${('00' + now.getHours()).slice(-2)}`,
                finalMinute: `${('00' + now.getMinutes()).slice(-2)}`,
              });
            }

            this.setState({
              time,
              ampm: '',
            });
          } else {
            // 12 hour
            let hours = now.getHours();

            if (hours > 12) {
              hours -= 12;
            } else if (hours === 0) {
              hours = 12;
            }

            if (zero === 'false') {
              time = `${hours}:${('00' + now.getMinutes()).slice(-2)}${sec}`;
              this.setState({
                finalHour: `${hours}`,
                finalMinute: `${('00' + now.getMinutes()).slice(-2)}`,
              });
            } else {
              time = `${('00' + hours).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}${sec}`;
              this.setState({
                finalHour: `${('00' + hours).slice(-2)}`,
                finalMinute: `${('00' + now.getMinutes()).slice(-2)}`,
              });
            }

            this.setState({
              time,
              ampm: now.getHours() > 11 ? 'PM' : 'AM',
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
          return (element.style.display = 'none');
        }

        this.timer = null;
        this.startTime(0);

        element.style.display = 'block';
        element.style.fontSize = `${
          4 * Number((localStorage.getItem('zoomClock') || 100) / 100)
        }em`;
      }
    });

    if (localStorage.getItem('timeType') !== 'analogue') {
      document.querySelector('.clock-container').style.fontSize = `${
        4 * Number((localStorage.getItem('zoomClock') || 100) / 100)
      }em`;
    }

    this.startTime(0);
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    const enabled = (setting) => {
      return localStorage.getItem(setting) === 'true';
    };

    if (localStorage.getItem('timeType') === 'analogue') {
      return (
        <Suspense fallback={<></>}>
          <div className={`clockBackground ${enabled('roundClock') ? 'round' : ''}`}>
            <Analog
              className="analogclock clock-container"
              value={this.state.time}
              size={1.5 * Number(localStorage.getItem('zoomClock') || 100)}
              renderMinuteMarks={enabled('minuteMarks')}
              renderHourMarks={enabled('hourMarks')}
              renderSecondHand={enabled('secondHand')}
              renderMinuteHand={enabled('minuteHand')}
              renderHourHand={enabled('hourHand')}
            />
          </div>
        </Suspense>
      );
    }

    if (localStorage.getItem('timeType') === 'verticalClock') {
      return (
        <span className="new-clock clock-container">
          {' '}
          <div className="hour" style={{ color: this.state.hourColour }}>
            {this.state.finalHour}
          </div>{' '}
          <div className="minute" style={{ color: this.state.minuteColour }}>
            {this.state.finalMinute}
          </div>{' '}
          <div className="seconds">{this.state.finalSeconds}</div>{' '}
        </span>
      );
    }

    return (
      <span className="clock clock-container">
        {this.state.time}
        <span className="ampm">{this.state.ampm}</span>
      </span>
    );
  }
}
