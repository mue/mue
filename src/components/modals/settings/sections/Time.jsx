import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';

export default class TimeSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      timeType: localStorage.getItem('timeType') || 'digital'
    };
  }

  changeType() {
    const value = document.getElementById('timeType').value;
    localStorage.setItem('timeType', value);
    this.setState({
      timeType: value
    });
  }

  componentDidMount() {
    document.getElementById('dateformat').value = localStorage.getItem('dateFormat');
    document.getElementById('timeType').value = localStorage.getItem('timeType');
  }

  render() {
    let digitalSettings = (
      <React.Fragment>
        <h3>Digital</h3>
        <Checkbox name='seconds' text={this.props.language.seconds} />
        <Checkbox name='24hour' text={this.props.language.twentyfourhour} />
        <Checkbox name='ampm' text={this.props.language.ampm} />
        <Checkbox name='zero' text={this.props.language.zero} />
      </React.Fragment>
    );

    let analogSettings = (
      <React.Fragment>
        <h3>Analog</h3>
        <Checkbox name='secondHand' text='Seconds Hand' />
        <Checkbox name='minuteHand' text='Minutes Hand' />
        <Checkbox name='hourHand' text='Hours Hand' />
        <Checkbox name='hourMarks' text='Hour Marks' />
        <Checkbox name='minuteMarks' text='Minute Marks' />
      </React.Fragment>
    );

    switch (this.state.timeType) {
      case 'digital': break;
      case 'analogue': digitalSettings = analogSettings; break;
      default: digitalSettings = null; break;
    }

    return (
      <div>
        <h2>{this.props.language.title}</h2>
        <Checkbox name='time' text='Enabled' />
        <Dropdown label='Type' name='timeType' id='timeType' onChange={() => this.changeType()}>
          <option className='choices' value='digital'>Digital</option>
          <option className='choices' value='analogue'>Analog</option>
          <option className='choices' value='percentageComplete'>Percentage of Day</option>
        </Dropdown>
        {digitalSettings}
        <h3>{this.props.language.date.title}</h3>
        <Checkbox name='date' text='Enabled' />
        <Checkbox name='short' text={this.props.language.date.short_date} betaFeature={true} />
        <Dropdown label={this.props.language.date.short_format} name='dateFormat' id='dateformat' onChange={() => localStorage.setItem('dateFormat', document.getElementById('dateformat').value)}>
          <option className='choices' value='DMY'>DMY</option>
          <option className='choices' value='MDY'>MDY</option>
          <option className='choices' value='YMD'>YMD</option>
        </Dropdown>
      </div>
    );
  }
}
