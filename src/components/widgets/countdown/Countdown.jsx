import React from 'react';
import Countdown from 'react-countdown';

import './countdown.scss';

export default class CountdownWidget extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
        countdown: new Date(localStorage.getItem('birthday')),
        message: localStorage.getItem('countdownmessage') || 'until tomorrow'
    };
  }

  render() {
    if (localStorage.getItem('countdown') === 'false') return;
    return <h4 className='countdown'>
        <Countdown date={this.state.countdown + 10000} onComplete={() => this.setState({ message: 'Today\'s the day!'})} /><br/>
        {this.state.message}
    </h4>;
  }
}
