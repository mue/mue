import variables from 'config/variables';
import { PureComponent, createRef } from 'react';

import { nth, convertTimezone } from 'utils/date';
import EventBus from 'utils/eventbus';

import './greeting.scss';

const isEventsEnabled = localStorage.getItem('events') !== 'false';
export default class Greeting extends PureComponent {
  constructor() {
    super();
    this.state = {
      greeting: '',
    };
    this.timer = undefined;
    this.greeting = createRef();
  }

  /**
   * Change the greeting message for the events of Christmas, New Year and Halloween.
   * If the events setting is disabled, then the greeting message will not be changed.
   * @param {Date} time The current time.
   * @param {String} message The current greeting message.
   * @returns The message variable is being returned.
   */
  doEvents(time, message) {
    if (!isEventsEnabled) {
      return message;
    }

    // Get current month & day
    const month = time.getMonth();
    const date = time.getDate();

    // Parse the customEvents from localStorage
    const customEvents = JSON.parse(localStorage.getItem('customEvents') || '[]');

    const event = customEvents.find((e) => e.month - 1 === month && e.date === date);
    if (event) {
      message = event.name;
    }

    return message;
  }

  /**
   * It takes a date object and returns the age of the person in years.
   * @param {Date} date The date of birth.
   * @returns The age of the person.
   */
  calculateAge(date) {
    const diff = Date.now() - date.getTime();
    const birthday = new Date(diff);
    return Math.abs(birthday.getUTCFullYear() - 1970);
  }

  getGreeting(time = 60000 - (Date.now() % 60000)) {
    this.timer = setTimeout(() => {
      let now = new Date();
      const timezone = localStorage.getItem('timezone');
      if (timezone && timezone !== 'auto') {
        now = convertTimezone(now, timezone);
      }

      const hour = now.getHours();

      let message;
      switch (true) {
        case hour < 12:
          message = variables.getMessage('widgets.greeting.morning');
          break;
        case hour < 18:
          message = variables.getMessage('widgets.greeting.afternoon');
          break;
        default:
          message = variables.getMessage('widgets.greeting.evening');
          break;
      }

      // Events and custom
      const custom = localStorage.getItem('defaultGreetingMessage');
      if (custom === 'false') {
        message = '';
      } else {
        message = this.doEvents(now, message);
      }

      // Name
      let name = '';
      const data = localStorage.getItem('greetingName');

      if (typeof data === 'string') {
        if (data.replace(/\s/g, '').length > 0) {
          name = `, ${data.trim()}`;
        }
      }

      const birthday = localStorage.getItem('birthdayenabled');

      if (custom === 'false' && birthday !== 'true') {
        name = name.replace(',', '');
      }

      // Birthday
      if (birthday === 'true') {
        const birth = new Date(localStorage.getItem('birthday'));

        if (birth.getDate() === now.getDate() && birth.getMonth() === now.getMonth()) {
          if (localStorage.getItem('birthdayage') === 'true' && this.calculateAge(birth) !== 0) {
            const text = variables.getMessage('widgets.greeting.birthday').split(' ');
            message = `${text[0]} ${nth(this.calculateAge(birth))} ${text[1]}`;
          } else {
            message = variables.getMessage('widgets.greeting.birthday');
          }
        }
      }

      // Set the state to the greeting string
      this.setState({
        greeting: `${message}${name}`,
      });

      this.getGreeting();
    }, time);
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'greeting' || data === 'timezone') {
        if (localStorage.getItem('greeting') === 'false') {
          return (this.greeting.current.style.display = 'none');
        }

        this.timer = null;
        this.getGreeting(0);

        this.greeting.current.style.display = 'block';
        this.greeting.current.style.fontSize = `${
          1.6 * Number((localStorage.getItem('zoomGreeting') || 100) / 100)
        }em`;
      }
    });

    // this comment can apply to all widget zoom features apart from the general one in the Accessibility section
    // in a nutshell: 1.6 is the current font size, and we do "localstorage || 100" so we don't have to try that 4.0 -> 5.0 thing again
    this.greeting.current.style.fontSize = `${
      1.6 * Number((localStorage.getItem('zoomGreeting') || 100) / 100)
    }em`;

    this.getGreeting(0);
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    return (
      <span className="greeting" ref={this.greeting}>
        {this.state.greeting}
      </span>
    );
  }
}
