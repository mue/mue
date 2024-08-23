import variables from 'config/variables';
import { useRef, useState, useEffect } from 'react';

import { nth, convertTimezone } from 'utils/date';
import EventBus from 'utils/eventbus';
import defaults from './options/default';

import './greeting.scss';

const isEventsEnabled = localStorage.getItem('events') !== 'false';

function Greeting() {
  const [greeting, setGreeting] = useState('');
  const timer = useRef(null);
  const greetingRef = useRef(null);

  /**
   * Change the greeting message for the events of Christmas, New Year and Halloween.
   * If the events setting is disabled, then the greeting message will not be changed.
   * @param {Date} time The current time.
   * @param {String} message The current greeting message.
   * @returns The message variable is being returned.
   */

  const doEvents = (time, message) => {
    if (!isEventsEnabled) {
      return message;
    }

    // Get current month & day
    const month = time.getMonth();
    const date = time.getDate();

    // Parse the customEvents from localStorage
    const customEvents = JSON.parse(localStorage.getItem('customEvents') || defaults.customEvents);

    const event = customEvents.find((e) => e.month - 1 === month && e.date === date);
    if (event) {
      message = event.name;
    }

    return message;
  };

  /**
   * It takes a date object and returns the age of the person in years.
   * @param {Date} date The date of birth.
   * @returns The age of the person.
   * */
  const calculateAge = (date) => {
    const diff = Date.now() - date.getTime();
    const birthday = new Date(diff);
    return Math.abs(birthday.getUTCFullYear() - 1970);
  };

  const getGreeting = (time = 60000 - (Date.now() % 60000)) => {
    timer.current = setTimeout(() => {
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
        message = doEvents(now, message);
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
          if (localStorage.getItem('birthdayage') === 'true' && calculateAge(birth) !== 0) {
            const text = variables.getMessage('widgets.greeting.birthday').split(' ');
            message = `${text[0]} ${nth(calculateAge(birth))} ${text[1]}`;
          } else {
            message = variables.getMessage('widgets.greeting.birthday');
          }
        }
      }

      // Set the state to the greeting string
      setGreeting(`${message}${name}`);

      getGreeting();
    }, time);
  };

  useEffect(() => {
    EventBus.on('refresh', (data) => {
      if (data === 'greeting' || data === 'timezone') {
        if (localStorage.getItem('greeting') === 'false') {
          return (greetingRef.current.style.display = 'none');
        }

        timer.current = null;
        getGreeting(0);

        greetingRef.current.style.display = 'block';
        greetingRef.current.style.fontSize = `${
          1.6 * Number((localStorage.getItem('zoomGreeting') || defaults.zoomGreeting) / 100)
        }em`;
      }
    });

    greetingRef.current.style.fontSize = `${
      1.6 * Number((localStorage.getItem('zoomGreeting') || defaults.zoomGreeting) / 100)
    }em`;

    getGreeting(0);

    return () => {
      EventBus.off('refresh');
    };
  }, []);

  return (
    <span className="greeting" ref={greetingRef}>
      {greeting}
    </span>
  );
}

export default Greeting;
