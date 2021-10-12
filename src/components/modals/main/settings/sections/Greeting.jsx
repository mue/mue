import variables from 'modules/variables';
import { PureComponent } from 'react';

import Header from '../Header';
import Checkbox from '../Checkbox';
import Switch from '../Switch';
import Text from '../Text';

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
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    return (
      <>
        <Header title={getMessage('modals.main.settings.sections.greeting.title')} category='greeting' element='.greeting' zoomSetting='zoomGreeting'/>
        <Checkbox name='events' text={getMessage('modals.main.settings.sections.greeting.events')} category='greeting'/>
        <Checkbox name='defaultGreetingMessage' text={getMessage('modals.main.settings.sections.greeting.default')} category='greeting'/>
        <Text title={getMessage('modals.main.settings.sections.greeting.name')} name='greetingName' category='greeting'/>

        <h3>{getMessage('modals.main.settings.sections.greeting.birthday')}</h3>
        <Switch name='birthdayenabled' text={getMessage('modals.main.settings.enabled')} category='greeting'/>
        <br/>
        <Checkbox name='birthdayage' text={getMessage('modals.main.settings.sections.greeting.birthday_age')} category='greeting'/>
        <p>{getMessage('modals.main.settings.sections.greeting.birthday_date')}</p>
        <input type='date' onChange={this.changeDate} value={this.state.birthday.toISOString().substr(0, 10)}/>
      </>
    );
  }
}
