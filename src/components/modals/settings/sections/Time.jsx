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
    let digitalSettings = (
      <React.Fragment>
        <h3>{this.props.language.digital.title}</h3>
        <Checkbox name='seconds' text={this.props.language.digital.seconds} />
        <Checkbox name='24hour' text={this.props.language.digital.twentyfourhour} />
        <Checkbox name='ampm' text={this.props.language.digital.ampm} />
        <Checkbox name='zero' text={this.props.language.digital.zero} />
      </React.Fragment>
    );

    let analogSettings = (
      <React.Fragment>
        <h3>{this.props.language.analogue.title}</h3>
        <Checkbox name='secondHand' text={this.props.language.analogue.second_hand} />
        <Checkbox name='minuteHand' text={this.props.language.analogue.minute_hand} />
        <Checkbox name='hourHand' text={this.props.language.analogue.hour_hand} />
        <Checkbox name='hourMarks' text={this.props.language.analogue.hour_marks} />
        <Checkbox name='minuteMarks' text={this.props.language.analogue.minute_marks} />
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
          <option className='choices' value='digital'>{this.props.language.digital.title}</option>
          <option className='choices' value='analogue'>{this.props.language.analogue.title}</option>
          <option className='choices' value='percentageComplete'>{this.props.language.percentage_complete}</option>
        </Dropdown>
        {digitalSettings}
        <h3>{this.props.language.date.title}</h3>
        <Checkbox name='date' text='Enabled' />
        <Checkbox name='dayofweek' text={this.props.language.date.day_of_week} />
        <Checkbox name='short' text={this.props.language.date.short_date} betaFeature={true} />
        <Dropdown label={this.props.language.date.short_format} name='dateFormat' id='dateformat' onChange={() => localStorage.setItem('dateFormat', document.getElementById('dateformat').value)}>
          <option className='choices' value='DMY'>DMY</option>
          <option className='choices' value='MDY'>MDY</option>
          <option className='choices' value='YMD'>YMD</option>
        </Dropdown>
        <Dropdown label={this.props.language.date.short_separator.title} name='shortFormat' id='shortformat' onChange={() => localStorage.setItem('shortFormat', document.getElementById('shortformat').value)}>
          <option className='choices' value='default'>{this.props.language.date.short_separator.default}</option>
          <option className='choices' value='dash'>{this.props.language.date.short_separator.dash}</option>
          <option className='choices' value='gaps'>{this.props.language.date.short_separator.gaps}</option>
         </Dropdown>
      </div>
    );
  }
}
