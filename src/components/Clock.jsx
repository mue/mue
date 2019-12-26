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
    const a = t.getHours();
    let h = t.getHours(); // Get hours
    // const s = today.getSeconds();

    if (h > 12) h = h - 12; // 12 hour support

    this.setState({ 
      date: `${('0' + h).slice(-2)}:${('0' + t.getMinutes()).slice(-2)}`, ampm: a >= 12 ? 'PM' : 'AM' 
    }); // Set time

    this.timeout = setTimeout(() => this.startTime(), 750); // Update the clock every 750 milliseconds
  }

  componentDidMount() {
    this.startTime();
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
