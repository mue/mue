import { useState, useEffect, useRef } from 'react';
import variables from 'config/variables';
import { nth, convertTimezone } from 'utils/date';
import EventBus from 'utils/eventbus';
import './greeting.scss';

/**
 * Change the greeting message for the events of Christmas, New Year and Halloween.
 * If the events setting is disabled, then the greeting message will not be changed.
 * @param {Date} time The current time.
 * @param {String} message The current greeting message.
 * @returns The message variable is being returned.
 */
const doEvents = (time, message) => {
  const isEventsEnabled = localStorage.getItem('events') !== 'false';
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
};

/**
 * It takes a date object and returns the age of the person in years.
 * @param {Date} date The date of birth.
 * @returns The age of the person.
 */
const calculateAge = (date) => {
  const diff = Date.now() - date.getTime();
  const birthday = new Date(diff);
  return Math.abs(birthday.getUTCFullYear() - 1970);
};

const Greeting = () => {
  const [greeting, setGreeting] = useState('');
  const [display, setDisplay] = useState('block');
  const [fontSize, setFontSize] = useState('1.6em');
  const greetingRef = useRef();
  const timerRef = useRef(null);

  const getGreeting = (time = 60000 - (Date.now() % 60000)) => {
    timerRef.current = setTimeout(() => {
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
    const handleRefresh = (data) => {
      if (data === 'greeting' || data === 'timezone') {
        const greetingSetting = localStorage.getItem('greeting');
        const zoomGreeting = localStorage.getItem('zoomGreeting');
        setDisplay(greetingSetting === 'false' ? 'none' : 'block');
        setFontSize(`${1.6 * Number((zoomGreeting || 100) / 100)}em`);

        if (greetingSetting !== 'false') {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          getGreeting(0);
        }
      }
    };

    // this comment can apply to all widget zoom features apart from the general one in the Accessibility section
    // in a nutshell: 1.6 is the current font size, and we do "localstorage || 100" so we don't have to try that 4.0 -> 5.0 thing again
    const zoomGreeting = localStorage.getItem('zoomGreeting');
    setFontSize(`${1.6 * Number((zoomGreeting || 100) / 100)}em`);

    getGreeting(0);

    EventBus.on('refresh', handleRefresh);
    return () => {
      EventBus.off('refresh');
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <span className="greeting" ref={greetingRef} style={{ display, fontSize }}>
      {greeting}
    </span>
  );
};

export { Greeting as default, Greeting };
