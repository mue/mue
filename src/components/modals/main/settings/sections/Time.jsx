import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Switch from '../Switch';

export default class TimeSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      timeType: localStorage.getItem('timeType') || 'digital',
      dateType: localStorage.getItem('dateType') || 'long'
    };
    this.language = window.language.modals.main.settings;
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

    let dateSettings;
    
    const longSettings = (
      <React.Fragment>
        <Checkbox name='dayofweek' text={time.date.day_of_week} />
        <Checkbox name='datenth' text={time.date.datenth} />
      </React.Fragment>
    );

    const shortSettings = (
      <React.Fragment>
        <br/>
        <Dropdown label={time.date.short_format} name='dateFormat'>
          <option className='choices' value='DMY'>DMY</option>
          <option className='choices' value='MDY'>MDY</option>
          <option className='choices' value='YMD'>YMD</option>
        </Dropdown>
        <br/><br/>
        <Dropdown label={time.date.short_separator.title} name='shortFormat'>
          <option className='choices' value='dots'>{time.date.short_separator.dots}</option>
          <option className='choices' value='dash'>{time.date.short_separator.dash}</option>
          <option className='choices' value='gaps'>{time.date.short_separator.gaps}</option>
          <option className='choices' value='slashes'>{time.date.short_separator.slashes}</option>
       </Dropdown>
      </React.Fragment>
    );

    switch (this.state.dateType) {
      case 'short': dateSettings = shortSettings; break;
      case 'long': dateSettings = longSettings; break;
    }

    return (
      <div>
        <h2>{time.title}</h2>
        <Switch name='time' text={this.language.enabled} />
        <Dropdown label='Type' name='timeType' onChange={(value) => this.setState({ timeType: value })}>
          <option className='choices' value='digital'>{time.digital.title}</option>
          <option className='choices' value='analogue'>{time.analogue.title}</option>
          <option className='choices' value='percentageComplete'>{time.percentage_complete}</option>
        </Dropdown>
        {timeSettings}

        <h3>{time.date.title}</h3>
        <Switch name='date' text={this.language.enabled} />
        <Dropdown label='Type' name='dateType' onChange={(value) => this.setState({ dateType: value })}>
          <option className='choices' value='long'>Long</option>
          <option className='choices' value='short'>Short</option>
        </Dropdown>
        <br/>
        {dateSettings}
      </div>
    );
  }
}
