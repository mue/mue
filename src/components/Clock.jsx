//* Imports
import React from 'react';

export default class Clock extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      date: '',
      ampm: '',
    };
  }

  startTime() {
    const t = new Date(); // Get the current date 
    let h = today.getHours(); // Get hours
    // const s = today.getSeconds();

    if (h > 12) h = h - 12; // Forgot what this does, might remove later if it doesn't do anything

    this.setState({ 
      date: `${('0' + h).slice(-2)}:${('0' + t.getMinutes()).slice(-2)}`, ampm: h >= 12 ? 'AM' : 'PM' 
    }); // Set time

    this.timeout = setTimeout(() => this.startTime(), 500); // Update the clock every 500 milliseconds
  }

  componentDidMount() {
    this.startTime();
  }

  componentWillUnmount() { // Do we need this?
    clearTimeout(this.timeout);
  }

  render() {
    return <h1 className='clock'>
      {this.state.date}
      <span className='ampm'>
        {this.state.ampm}  
      </span>
    </h1>;
  }
}
