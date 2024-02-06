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
    const GREETING_SECTION = 'modals.main.settings.sections.greeting';

    return (
      <>
        <Header
          title={variables.getMessage(`${GREETING_SECTION}.title`)}
          setting="greeting"
          category="greeting"
          element=".greeting"
          zoomSetting="zoomGreeting"
          switch={true}
        />
        <SettingsItem
          title={variables.getMessage('modals.main.settings.additional_settings')}
          subtitle={variables.getMessage(`${GREETING_SECTION}.additional`)}
        >
          <Checkbox
            name="events"
            text={variables.getMessage(`${GREETING_SECTION}.events`)}
            category="greeting"
          />
          <Checkbox
            name="defaultGreetingMessage"
            text={variables.getMessage(`${GREETING_SECTION}.default`)}
            category="greeting"
          />
          <Text
            title={variables.getMessage(`${GREETING_SECTION}.name`)}
            name="greetingName"
            category="greeting"
          />
        </SettingsItem>
        <SettingsItem
          title={variables.getMessage(`${GREETING_SECTION}.birthday`)}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.greeting.birthday_subtitle',
          )}
          final={true}
        >
          <Switch
            name="birthdayenabled"
            text={variables.getMessage('modals.main.settings.enabled')}
            category="greeting"
          />
          <Checkbox
            name="birthdayage"
            text={variables.getMessage(`${GREETING_SECTION}.birthday_age`)}
            category="greeting"
          />
          <p style={{ marginRight: 'auto' }}>
            {variables.getMessage(`${GREETING_SECTION}.birthday_date`)}
          </p>
          <input
            type="date"
            onChange={this.changeDate}
            value={this.state.birthday.toISOString().substring(0, 10)}
            required
          />
        </SettingsItem>
      </>
    );
  }
}
