import { PureComponent } from 'react';

import { convertTimezone } from 'utils/date';
import { AnalogClock } from './components/AnalogClock';
import { VerticalClock } from './components/VerticalClock';
import EventBus from 'utils/eventbus';

import './clock.scss';
export default class Clock extends PureComponent {
  constructor() {
    super();

    this.timer = undefined;
    this.state = {
      timeType: localStorage.getItem('timeType'),
      time: '',
      finalHour: '',
      finalMinute: '',
      finalSeconds: '',
      ampm: '',
      nowGlobal: new Date(),
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
    if (localStorage.getItem('timeType') === 'analogue') {
      return <AnalogClock time={this.state.time} />;
    }

    if (localStorage.getItem('timeType') === 'verticalClock') {
      return (
        <VerticalClock
          finalHour={this.state.finalHour}
          finalMinute={this.state.finalMinute}
          finalSeconds={this.state.finalSeconds}
        />
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
