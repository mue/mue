//* Imports
import React from 'react';

export default class Greeting extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
        greeting: ''
    };
 }

  getGreeting() {
    // Get current info
    const t = new Date(); // Current date
    const h = t.getHours(); // Current hour
    
    // Normal
    let g = 'Good evening'; // Set the default time string to "Good evening"	
    if (h < 12) g = 'Good morning'; // If it's before 12am, set the time string to "Good morning"
    else if (h < 18) g = 'Good afternoon'; // If it's before 6pm, set the time string to "Good afternoon"

    // Events
    if (t.getMonth() === 0 && t.getDate() === 1) g = 'Happy new year'; // If the date is January 1st, set it to new year
    else if (t.getMonth() === 11 && t.getDate() === 25) g = 'Merry Christmas'; // If it's December 25th, set it to xmas
    else if (t.getMonth() === 9 && t.getDate() === 31) g = 'Happy Halloween'; // If it's October 31st, set it to halloween

    this.setState({ 
      greeting: g 
    }); // Set the state to the greeting string
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
