import React from 'react';

export default class Greeting extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      greeting: ''
    };
 }

  doEvents(time, message) {
    const enabled = localStorage.getItem('events');
    if (enabled === 'false') return message;

    // Get current month & day
    const m = time.getMonth(); // Current month
    const d = time.getDate(); // Current Date

    if (m === 11 && d === 25) message = 'Merry Christmas'; // If it's December 25th, set the greeting string to "Merry Christmas"
    else if (m === 0 && d === 1) message = 'Happy new year'; // If the date is January 1st, set the greeting string to "Happy new year"
    else if (m === 9 && d === 31) message = 'Happy Halloween'; // If it's October 31st, set the greeting string to "Happy Halloween"
    
    return message;
  }

  getGreeting() {
    const now = new Date();
    const hour = now.getHours();

    let message = 'Good evening'; // Set the default greeting string to "Good evening"	
    if (hour < 12) message = 'Good morning'; // If it's before 12am, set the greeting string to "Good morning"
    else if (hour < 18) message = 'Good afternoon'; // If it's before 6pm, set the greeting string to "Good afternoon"

    // Events
    message = this.doEvents(now, message);

    // Name
    let name = '';
    let data = localStorage.getItem('greetingName');

    if (typeof data === 'string') {
      data = data.replace(/\s/g, '');
      if (data.length > 0) name = `, ${data}`;
    }

    // Set the state to the greeting string
    this.setState({ 
      greeting: `${message}${name}`
    });
  }

  componentDidMount() {
    const enabled = localStorage.getItem('greeting');
    if (enabled === 'false') return;
    this.getGreeting();
  }
  
  render() {
    return <h1 className='greeting'>
      {this.state.greeting}
    </h1>;
  }
}
