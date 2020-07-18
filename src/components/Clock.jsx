import React from 'react';

export default class Clock extends React.Component {
  constructor(...args) {
    super(...args);

    this.timer = undefined;
    this.state = {
      date: '',
      ampm: ''
    };
  }
  
  startTime(time = localStorage.getItem('seconds') === 'true' ? (1000 - Date.now() % 1000) : (60000 - Date.now() % 60000)) {
    this.timer = setTimeout(() => {
      const now = new Date();
      let sec = '';
  
      if (localStorage.getItem('seconds') === 'true') sec = `:${('00' + now.getSeconds()).slice(-2)}`;

      if (localStorage.getItem('24hour') === 'true') {
        this.setState({ 
          date: `${('00' + now.getHours()).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}${sec}`
        }); 
      } else {
        // 12 hour support
        let hours = now.getHours();
        if (hours > 12) hours -= 12;

        this.setState({ 
          date: `${('00' + hours).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}${sec}`,
          ampm: now.getHours() > 11 ? 'PM' : 'AM' 
        });
      }

      this.startTime();
    }, time);
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
