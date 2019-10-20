import React from 'react';

export default class Clock extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      date: ``,
      ampm: ``,
    };
  }

  startTime() {
    const today = new Date(); // Get the current date 
    let h = today.getHours(); // Get hours
    const ampm = h >= 12 ? 'PM' : 'AM'; // Set AM/PM
    const m = today.getMinutes(); // Get minutes
    // const s = today.getSeconds();

    if (h > 12) h = h - 12;

    this.setState({ date: `${('0' + h).slice(-2)}:${('0' + m).slice(-2)}`, ampm: ampm });

    this.timeout = setTimeout(() => this.startTime(), 500);
  }

  componentDidMount() {
    this.startTime();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return <h1 className='App-clock'>
      {this.state.date}
      <span className='App-ampm-specifier'>
        {this.state.ampm}  
      </span>
    </h1>;
  }
}
