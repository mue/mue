import variables from 'modules/variables';
import { PureComponent } from 'react';

import Header from '../Header';
import Checkbox from '../Checkbox';
import Switch from '../Switch';
import Text from '../Text';
import SettingsItem from '../SettingsItem';

export default class GreetingSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      birthday: new Date(localStorage.getItem('birthday')) || new Date(),
    };
  }

  changeDate = (e) => {
    localStorage.setItem('birthday', e.target.value || new Date());

    this.setState({
      birthday: e.target.value ? new Date(e.target.value) : new Date(),
    });
  };

  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    return (
      <>
        <Header
          title={getMessage('modals.main.settings.sections.greeting.title')}
          setting="greeting"
          category="greeting"
          element=".greeting"
          zoomSetting="zoomGreeting"
          switch={true}
        />
        <SettingsItem
          title="Additional Settings"
          subtitle={getMessage('modals.main.settings.enabled')}
        >
          <Checkbox
            name="events"
            text={getMessage('modals.main.settings.sections.greeting.events')}
            category="greeting"
          />
          <Checkbox
            name="defaultGreetingMessage"
            text={getMessage('modals.main.settings.sections.greeting.default')}
            category="greeting"
          />
          <Text
            title={getMessage('modals.main.settings.sections.greeting.name')}
            name="greetingName"
            category="greeting"
          />
        </SettingsItem>
        <SettingsItem
          title={getMessage('modals.main.settings.sections.greeting.birthday')}
          subtitle={getMessage('modals.main.settings.enabled')}
        >
          <Switch
            name="birthdayenabled"
            text={getMessage('modals.main.settings.enabled')}
            category="greeting"
          />
          <Checkbox
            name="birthdayage"
            text={getMessage('modals.main.settings.sections.greeting.birthday_age')}
            category="greeting"
          />
          <p>{getMessage('modals.main.settings.sections.greeting.birthday_date')}</p>
          <input
            type="date"
            onChange={this.changeDate}
            value={this.state.birthday.toISOString().substr(0, 10)}
            required
          />
        </SettingsItem>
        {/*<h3>{getMessage('modals.main.settings.sections.greeting.birthday')}</h3>
        <Switch name='birthdayenabled' text={getMessage('modals.main.settings.enabled')} category='greeting'/>
        <br/>
        <Checkbox name='birthdayage' text={getMessage('modals.main.settings.sections.greeting.birthday_age')} category='greeting'/>
        <p>{getMessage('modals.main.settings.sections.greeting.birthday_date')}</p>
    <input type='date' onChange={this.changeDate} value={this.state.birthday.toISOString().substr(0, 10)} required/>*/}
      </>
    );
  }
}
