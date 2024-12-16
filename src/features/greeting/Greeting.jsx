import variables from 'config/variables';
import { useRef, useState, useEffect, useCallback } from 'react';

import { appendNth, convertTimezone } from 'utils/date';
import EventBus from 'utils/eventbus';
import Stats from 'features/stats/api/stats';
import defaults from './options/default';

import './greeting.scss';

const isEventsEnabled = localStorage.getItem('events') !== 'false';

function Greeting({ isPreview = false, staticTime }) {
  const [greeting, setGreeting] = useState('');
  const timer = useRef(null);
  const greetingRef = useRef(null);

  const doEvents = (time, message) => {
    if (!isEventsEnabled) {
      return message;
    }

    const month = time.getMonth();
    const date = time.getDate();

    const customEvents = JSON.parse(localStorage.getItem('customEvents') || defaults.customEvents);

    const event = customEvents.find((e) => e.month - 1 === month && e.date === date);
    if (event) {
      message = event.name;
    }

    return message;
  };

  const calculateAge = (date) => {
    const diff = Date.now() - date.getTime();
    const birthday = new Date(diff);
    return Math.abs(birthday.getUTCFullYear() - 1970);
  };

  const getGreeting = useCallback(
    (time = 60000 - (Date.now() % 60000)) => {
      if (isPreview) {
        // Use static time for preview
        const hour = staticTime.getHours();
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

        const name = localStorage.getItem('greetingName');
        const nameString = name ? `, ${name.trim()}` : '';
        setGreeting(`${message}${nameString}`);
        return;
      }

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

        const custom = localStorage.getItem('defaultGreetingMessage');
        if (custom === 'false') {
          message = '';
        } else {
          message = doEvents(now, message);
        }

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

        if (birthday === 'true') {
          const birth = new Date(localStorage.getItem('birthday'));

          if (birth.getDate() === now.getDate() && birth.getMonth() === now.getMonth()) {
            if (localStorage.getItem('birthdayage') === 'true' && calculateAge(birth) !== 0) {
              const text = variables.getMessage('widgets.greeting.birthday').split(' ');
              message = `${text[0]} ${appendNth(calculateAge(birth))} ${text[1]}`;
            } else {
              message = variables.getMessage('widgets.greeting.birthday');
            }
          }
        }

        setGreeting(`${message}${name}`);

        if (!isPreview) {
          Stats.postEvent('feature', 'greeting', 'shown');
          getGreeting();
        }
      }, time);
    },
    [isPreview, staticTime],
  );

  useEffect(() => {
    if (!isPreview) {
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
        if (timer.current) {
          clearTimeout(timer.current);
        }
      };
    } else {
      getGreeting(0);
    }
  }, [getGreeting, isPreview]);

  return (
    <span className="greeting" ref={greetingRef}>
      {greeting}
    </span>
  );
}

export default Greeting;
