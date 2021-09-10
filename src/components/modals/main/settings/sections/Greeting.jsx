import variables from 'modules/variables';
import { PureComponent } from 'react';

import Checkbox from '../Checkbox';
import Switch from '../Switch';
import Text from '../Text';
import Slider from '../Slider';

export default class GreetingSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      birthday: new Date(localStorage.getItem('birthday')) || new Date()
    };
  }

  changeDate = (e) => {
    localStorage.setItem('birthday', e.target.value);

    this.setState({
      birthday: new Date(e.target.value)
    });
  }

  render() {
    const getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
    const languagecode = variables.languagecode;

    return (
      <>
        <h2>{getMessage(languagecode, 'modals.main.settings.sections.greeting.title')}</h2>
        <Switch name='greeting' text={getMessage(languagecode, 'modals.main.settings.enabled')} category='greeting' element='.greeting'/>
        <Checkbox name='events' text={getMessage(languagecode, 'modals.main.settings.sections.greeting.events')} category='greeting'/>
        <Checkbox name='defaultGreetingMessage' text={getMessage(languagecode, 'modals.main.settings.sections.greeting.default')} category='greeting'/>
        <Text title={getMessage(languagecode, 'modals.main.settings.sections.greeting.name')} name='greetingName' category='greeting'/>
        <Slider title={getMessage(languagecode, 'modals.main.settings.sections.appearance.accessibility.widget_zoom')} name='zoomGreeting' min='10' max='400' default='100' display='%' category='greeting' />

        <h3>{getMessage(languagecode, 'modals.main.settings.sections.greeting.birthday')}</h3>
        <Switch name='birthdayenabled' text={getMessage(languagecode, 'modals.main.settings.enabled')} category='greeting'/>
        <Checkbox name='birthdayage' text={getMessage(languagecode, 'modals.main.settings.sections.greeting.birthday_age')} category='greeting'/>
        <p>{getMessage(languagecode, 'modals.main.settings.sections.greeting.birthday_date')}</p>
        <input type='date' onChange={this.changeDate} value={this.state.birthday.toISOString().substr(0, 10)}/>
      </>
    );
  }
}
