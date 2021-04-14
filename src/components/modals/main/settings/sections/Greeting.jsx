import React from 'react';

import Checkbox from '../Checkbox';
import Switch from '../Switch';
import Text from '../Text';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

export default class GreetingSettings extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      birthday: new Date(localStorage.getItem('birthday')) || new Date()
    };
    this.language = window.language.modals.main.settings;
  }

  changeDate = (data) => {
    localStorage.setItem('birthday', data);

    this.setState({
      birthday: data
    });

    document.querySelector('.reminder-info').style.display = 'block';
    localStorage.setItem('showReminder', true);
  }

  render() {
    const { greeting } = this.language.sections;

    return (
      <>
        <h2>{greeting.title}</h2>
        <Switch name='greeting' text={this.language.enabled} category='greeting' element='.greeting'/>
        <Checkbox name='events' text={greeting.events} category='greeting' element='.other'/>
        <Checkbox name='defaultGreetingMessage' text={greeting.default} category='greeting' element='.other'/>
        <Text title={greeting.name} name='greetingName' category='greeting' element='.other'/>

        <h3>{greeting.birthday}</h3>
        <Switch name='birthdayenabled' text={this.language.enabled} category='greeting' element='.other'/>
        <Checkbox name='birthdayage' text={greeting.birthday_age} category='greeting' element='.other'/>
        <p>{greeting.birthday_date}</p>
        <DayPickerInput onDayChange={this.changeDate} value={this.state.birthday}/>
      </>
    );
  }
}
