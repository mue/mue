import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';

export default class TimeSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      timeType: localStorage.getItem('timeType') || 'digital'
    };
    this.language = window.language.modals.main.settings;
  }

  changeType() {
    const value = document.getElementById('timeType').value;
    localStorage.setItem('timeType', value);
    this.setState({
      timeType: value
    });
  }

  render() {
    const { time } = this.language.sections;

    let timeSettings;

    const digitalSettings = (
      <React.Fragment>
        <h3>{time.digital.title}</h3>
        <Checkbox name='seconds' text={time.digital.seconds} />
        <Checkbox name='24hour' text={time.digital.twentyfourhour} />
        <Checkbox name='ampm' text={time.digital.ampm} />
        <Checkbox name='zero' text={time.digital.zero} />
      </React.Fragment>
    );

    const analogSettings = (
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
      case 'digital': timeSettings = digitalSettings; break;
      case 'analogue': timeSettings = analogSettings; break;
      default: timeSettings = null; break;
    }

    return (
      <div>
        <h2>{time.title}</h2>
        <Checkbox name='time' text={this.language.enabled} />
        <Dropdown label='Type' name='timeType' onChange={() => this.changeType()}>
          <option className='choices' value='digital'>{time.digital.title}</option>
          <option className='choices' value='analogue'>{time.analogue.title}</option>
          <option className='choices' value='percentageComplete'>{time.percentage_complete}</option>
        </Dropdown>

        {timeSettings}

        <h3>{time.date.title}</h3>
        <Checkbox name='date' text={this.language.enabled} />
        <Checkbox name='dayofweek' text={time.date.day_of_week} />
        <Checkbox name='datenth' text={time.date.datenth} />
        <Checkbox name='short' text={time.date.short_date} betaFeature={true} />
        <Dropdown label={time.date.short_format} name='dateFormat'>
          <option className='choices' value='DMY'>DMY</option>
          <option className='choices' value='MDY'>MDY</option>
          <option className='choices' value='YMD'>YMD</option>
        </Dropdown>
        <br/>
        <br/>
        <Dropdown label={time.date.short_separator.title} name='shortFormat'>
          <option className='choices' value='dots'>{time.date.short_separator.dots}</option>
          <option className='choices' value='dash'>{time.date.short_separator.dash}</option>
          <option className='choices' value='gaps'>{time.date.short_separator.gaps}</option>
          <option className='choices' value='slashes'>{time.date.short_separator.slashes}</option>
         </Dropdown>
      </div>
    );
  }
}
