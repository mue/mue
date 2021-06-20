import React from 'react';

import Checkbox from '../Checkbox';
import Switch from '../Switch';
import Text from '../Text';
import Slider from '../Slider';

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
  }

  render() {
    const { greeting } = this.language.sections;

    return (
      <>
        <h2>{greeting.title}</h2>
        <Switch name='greeting' text={this.language.enabled} category='greeting' element='.greeting'/>
        <Checkbox name='events' text={greeting.events} category='greeting' element='.greeting'/>
        <Checkbox name='defaultGreetingMessage' text={greeting.default} category='greeting' element='.greeting'/>
        <Text title={greeting.name} name='greetingName' category='greeting' element='.greeting'/>
        <Slider title={window.language.modals.main.settings.sections.appearance.accessibility.widget_zoom} name='zoomGreeting' min='10' max='400' default='100' display='%' category='greeting' element='.greeting' />

        <h3>{greeting.birthday}</h3>
        <Switch name='birthdayenabled' text={this.language.enabled} category='greeting' element='.greeting'/>
        <Checkbox name='birthdayage' text={greeting.birthday_age} category='greeting' element='.greeting'/>
        <p>{greeting.birthday_date}</p>
        <DayPickerInput onDayChange={this.changeDate} value={this.state.birthday}/>
      </>
    );
  }
}
