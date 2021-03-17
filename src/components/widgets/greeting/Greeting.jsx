import React from 'react';

import './greeting.scss';

export default class Greeting extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      greeting: ''
    };
  }

  doEvents(time, message) {
    if (localStorage.getItem('events') === 'false') {
      return message;
    }

    // Get current month & day
    const month = time.getMonth();
    const date = time.getDate();

    // If it's December 25th, set the greeting string to "Merry Christmas"
    if (month === 11 && date === 25) {
      message = this.props.language.christmas;
    // If the date is January 1st, set the greeting string to "Happy new year"
    } else if (month === 0 && date === 1) {
      message = this.props.language.newyear;
    // If it's October 31st, set the greeting string to "Happy Halloween"
    } else if (month === 9 && date === 31) {
      message = this.props.language.halloween;
    }

    return message;
  }

  getGreeting() {
    const now = new Date();
    const hour = now.getHours();

    // Set the default greeting string to "Good evening"
    let message = this.props.language.evening;
    // If it's before 12am, set the greeting string to "Good morning"
    if (hour < 12) {
      message = this.props.language.morning;
    // If it's before 6pm, set the greeting string to "Good afternoon"
    } else if (hour < 18) {
      message = this.props.language.afternoon;
    }

    // Events
    message = this.doEvents(now, message);

    const custom = localStorage.getItem('defaultGreetingMessage');
    if (custom === 'false') {
      message = '';
    }

    // Name
    let name = '';
    const data = localStorage.getItem('greetingName');

    if (typeof data === 'string') {
      if (data.replace(/\s/g, '').length > 0) {
        name = `, ${data.trim()}`;
      }
    }

    if (custom === 'false') {
      name = name.replace(',', '');
    }

    // Birthday
    const birth = new Date(localStorage.getItem('birthday'));
    if (localStorage.getItem('birthdayenabled') === 'true' && birth.getDate() === now.getDate() && birth.getMonth() === now.getMonth()) {
      message = 'Happy Birthday';
    }

    // Set the state to the greeting string
    this.setState({
      greeting: `${message}${name}`
    });
  }

  componentDidMount() {
    this.getGreeting();
  }

  render() {
    return <h1 className='greeting'>
      {this.state.greeting}
    </h1>;
  }
}
