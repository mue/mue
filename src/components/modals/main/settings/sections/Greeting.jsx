import React from 'react';

import Checkbox from '../Checkbox';
import Switch from '../Switch';
import Text from '../Text';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

export default class GreetingSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      birthday: new Date(localStorage.getItem('birthday')) || new Date()
    };
    this.language = window.language.modals.main.settings;
  }

  changeDate(data) {
    localStorage.setItem('birthday', data);

    this.setState({
      birthday: data
    });
  }

  render() {
    const { greeting } = this.language.sections;

    return (
      <>
        <h2>{greeting.title}</h2>
        <Switch name='greeting' text={this.language.enabled} />
        <Checkbox name='events' text={greeting.events} />
        <Checkbox name='defaultGreetingMessage' text={greeting.default} />
        <Text title={greeting.name} name='greetingName'/>

        <h3>{greeting.birthday}</h3>
        <Switch name='birthdayenabled' text={this.language.enabled} />
        <Checkbox name='birthdayage' text='Birthday Age'/>
        <ul>
          <p>{greeting.birthday_date}</p>
          <DayPickerInput onDayChange={(data) => this.changeDate(data)} value={this.state.birthday} />
        </ul>
      </>
    );
  }
}
