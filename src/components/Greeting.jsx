//* Imports
import React from 'react';

export default class Greeting extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
        greeting: ``
    };
 }

  getGreeting() {
    const h = new Date().getHours();
    let t = 'Good evening'; // Set the default time string to "Good evening"	
    if (h < 12) t = 'Good morning'; // If it's before 12am, set the time string to "Good morning"
    else if (h < 18) t = 'Good afternoon'; // If it's before 6pm, set the time string to "Good afternoon"
    this.setState({ greeting: t }); // Set the state to the time string
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