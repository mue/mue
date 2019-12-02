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
    const t = new Date(); // Current date object
    
    // Normal
    const h = t.getHours(); // Current hour

    let g = 'Good evening'; // Set the default greeting string to "Good evening"	
    if (h < 12) g = 'Good morning'; // If it's before 12am, set the greeting string to "Good morning"
    else if (h < 18) g = 'Good afternoon'; // If it's before 6pm, set the greeting string to "Good afternoon"

    // Events
    const m = t.getMonth(); // Current month
    const d = t.getDate(); // Current Date

    if (m === 0 && d === 1) g = 'Happy new year'; // If the date is January 1st, set the greeting string to "Happy new year"
    else if (m === 11 && d === 25) g = 'Merry Christmas'; // If it's December 25th, set the greeting string to "Merry Christmas"
    else if (m === 9 && d === 31) g = 'Happy Halloween'; // If it's October 31st, set the greeting string to "Happy Halloween"

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
