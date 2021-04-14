import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Switch from '../Switch';
import Radio from '../Radio';

export default class TimeSettings extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      timeType: localStorage.getItem('timeType') || 'digital',
      dateType: localStorage.getItem('dateType') || 'long'
    };
    this.language = window.language.modals.main.settings;
  }

  render() {
    const { time } = this.language.sections;

    let timeSettings;

    const digitalOptions = [
      {
        'name': time.digital.twentyfourhour,
        'value': 'twentyfourhour'
      },
      {
        'name': time.digital.twelvehour,
        'value': 'twelvehour'
      }
    ];

    const digitalSettings = (
      <>
        <h3>{time.digital.title}</h3>
        <Radio title={time.format} name='timeformat' options={digitalOptions} smallTitle={true} category='clock' />
        <br/>
        <Checkbox name='seconds' text={time.digital.seconds} category='clock' />
        <Checkbox name='zero' text={time.digital.zero} category='clock' />
      </>
    );

    const analogSettings = (
      <>
        <h3>{time.analogue.title}</h3>
        <Checkbox name='secondHand' text={time.analogue.second_hand} category='clock' />
        <Checkbox name='minuteHand' text={time.analogue.minute_hand} category='clock' />
        <Checkbox name='hourHand' text={time.analogue.hour_hand} category='clock' />
        <Checkbox name='hourMarks' text={time.analogue.hour_marks} category='clock' />
        <Checkbox name='minuteMarks' text={time.analogue.minute_marks} category='clock' />
      </>
    );

    switch (this.state.timeType) {
      case 'digital': timeSettings = digitalSettings; break;
      case 'analogue': timeSettings = analogSettings; break;
      default: timeSettings = null; break;
    }

    let dateSettings;
    
    const longSettings = (
      <>
        <Checkbox name='dayofweek' text={time.date.day_of_week} category='date' />
        <Checkbox name='datenth' text={time.date.datenth} category='date' />
      </>
    );

    const shortSettings = (
      <>
        <br/>
        <Dropdown label={time.date.short_format} name='dateFormat' category='date'>
          <option value='DMY'>DMY</option>
          <option value='MDY'>MDY</option>
          <option value='YMD'>YMD</option>
        </Dropdown>
        <br/><br/>
        <Dropdown label={time.date.short_separator.title} name='shortFormat' category='date'>
          <option value='dots'>{time.date.short_separator.dots}</option>
          <option value='dash'>{time.date.short_separator.dash}</option>
          <option value='gaps'>{time.date.short_separator.gaps}</option>
          <option value='slashes'>{time.date.short_separator.slashes}</option>
       </Dropdown>
      </>
    );

    switch (this.state.dateType) {
      case 'short': dateSettings = shortSettings; break;
      case 'long': dateSettings = longSettings; break;
      default: break;
    }

    return (
      <>
        <h2>{time.title}</h2>
        <Switch name='time' text={this.language.enabled} category='clock' element='.clock' />
        <Dropdown label={time.type} name='timeType' onChange={(value) => this.setState({ timeType: value })} category='clock'>
          <option value='digital'>{time.digital.title}</option>
          <option value='analogue'>{time.analogue.title}</option>
          <option value='percentageComplete'>{time.percentage_complete}</option>
        </Dropdown>
        {timeSettings}

        <h3>{time.date.title}</h3>
        <Switch name='date' text={this.language.enabled} category='date' />
        <Dropdown label={time.type} name='dateType' onChange={(value) => this.setState({ dateType: value })} category='date'>
          <option value='long'>{time.date.type.long}</option>
          <option value='short'>{time.date.type.short}</option>
        </Dropdown>
        <br/>
        <Checkbox name='weeknumber' text={time.date.week_number} category='date'/>
        {dateSettings}
      </>
    );
  }
}
