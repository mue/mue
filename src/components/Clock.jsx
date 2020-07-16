//* Imports
import React from 'react';

export default class Clock extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      date: '',
      ampm: '',
    };
    this.timer = undefined;
  }
  
  startTime(time) {
    this.timer = setTimeout(() => {
      this.startTime();
      const t = new Date(); // Get the current date 
      const a = t.getHours();
      let h = t.getHours(); // Get hours
  
      // Seconds 
      let s = '';
      const enabled = localStorage.getItem('seconds');
      if (enabled === 'true') s = ':' + ('0' + t.getSeconds()).slice(-2);
  
      const twentyfour = localStorage.getItem('24hour');
      if (twentyfour === 'true') {
        // this.date = `${('0' + h).slice(-2)}:${('0' + t.getMinutes()).slice(-2)}${s}`;
        return this.setState({ 
          date: `${('0' + h).slice(-2)}:${('0' + t.getMinutes()).slice(-2)}${s}`
        }); 
      } else {
        if (h > 12) h = h - 12; // 12 hour support
        // this.date = `${('0' + h).slice(-2)}:${('0' + t.getMinutes()).slice(-2)}${s}`;

        this.setState({ 
          date: `${('0' + h).slice(-2)}:${('0' + t.getMinutes()).slice(-2)}${s}`, ampm: a >= 12 ? 'PM' : 'AM' 
        }); // Set time
        }
  
  
    }, (1000 - Date.now() % 1000));
  }

  componentDidMount() {
    const enabled = localStorage.getItem('time');
    if (enabled === 'false') return;
    this.startTime(0);
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
