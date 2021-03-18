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
    document.getElementById('shortformat').value = localStorage.getItem('shortFormat');
    document.getElementById('timeType').value = localStorage.getItem('timeType');
  }

  render() {
    const { time } = this.props.language.sections;

    let digitalSettings = (
      <React.Fragment>
        <h3>{time.digital.title}</h3>
        <Checkbox name='seconds' text={time.digital.seconds} />
        <Checkbox name='24hour' text={time.digital.twentyfourhour} />
        <Checkbox name='ampm' text={time.digital.ampm} />
        <Checkbox name='zero' text={time.digital.zero} />
      </React.Fragment>
    );

    let analogSettings = (
      <React.Fragment>
        <h3>{time.analogue.title}</h3>
        <Checkbox name='secondHand' text={time.analogue.second_hand} />
        <Checkbox name='minuteHand' text={time.analogue.minute_hand} />
        <Checkbox name='hourHand' text={time.analogue.hour_hand} />
        <Checkbox name='hourMarks' text={time.analogue.hour_marks} />
        <Checkbox name='minuteMarks' text={time.analogue.minute_marks} />
      </React.Fragment>
    );

    switch (this.state.timeType) {
      case 'digital': break;
      case 'analogue': digitalSettings = analogSettings; break;
      default: digitalSettings = null; break;
    }

    return (
      <div>
        <h2>{time.title}</h2>
        <Checkbox name='time' text={this.props.language.enabled} />
        <Dropdown label='Type' name='timeType' id='timeType' onChange={() => this.changeType()}>
          <option className='choices' value='digital'>{time.digital.title}</option>
          <option className='choices' value='analogue'>{time.analogue.title}</option>
          <option className='choices' value='percentageComplete'>{time.percentage_complete}</option>
        </Dropdown>
        {digitalSettings}
        <h3>{time.date.title}</h3>
        <Checkbox name='date' text={this.props.language.enabled} />
        <Checkbox name='dayofweek' text={time.date.day_of_week} />
        <Checkbox name='short' text={time.date.short_date} betaFeature={true} />
        <Dropdown label={time.date.short_format} name='dateFormat' id='dateformat' onChange={() => localStorage.setItem('dateFormat', document.getElementById('dateformat').value)}>
          <option className='choices' value='DMY'>DMY</option>
          <option className='choices' value='MDY'>MDY</option>
          <option className='choices' value='YMD'>YMD</option>
        </Dropdown>
        <Dropdown label={time.date.short_separator.title} name='shortFormat' id='shortformat' onChange={() => localStorage.setItem('shortFormat', document.getElementById('shortformat').value)}>
          <option className='choices' value='default'>{time.date.short_separator.default}</option>
          <option className='choices' value='dash'>{time.date.short_separator.dash}</option>
          <option className='choices' value='gaps'>{time.date.short_separator.gaps}</option>
         </Dropdown>
      </div>
    );
  }
}
