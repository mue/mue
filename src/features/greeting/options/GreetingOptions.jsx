import variables from 'config/variables';
import { useState } from 'react';

import {
  Header,
  Row,
  Content,
  Action,
  PreferencesWrapper,
  Section,
} from 'components/Layout/Settings';
import { Checkbox, Switch, Text } from 'components/Form/Settings';

import { MdEventNote } from 'react-icons/md';

const GreetingOptions = () => {
  const [events, setEvents] = useState(false);

  const [birthday, setBirthday] = useState(
    new Date(localStorage.getItem('birthday')) || new Date(),
  );

  const changeDate = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : new Date();
    localStorage.setItem('birthday', newDate);
    setBirthday(newDate);
  };

  const GREETING_SECTION = 'modals.main.settings.sections.greeting';

  const AdditionalOptions = () => {
    return (
      <Row final={true}>
        <Content
          title={variables.getMessage('modals.main.settings.additional_settings')}
          subtitle={variables.getMessage(`${GREETING_SECTION}.additional`)}
        />
        <Action>
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
        </Action>
      </Row>
    );
  };

  const BirthdayOptions = () => {
    return (
      <Row final={true}>
        <Content
          title={variables.getMessage(`${GREETING_SECTION}.birthday`)}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.greeting.birthday_subtitle',
          )}
        />
        <Action>
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
            onChange={changeDate}
            value={birthday.toISOString().substring(0, 10)}
            required
          />
        </Action>
      </Row>
    );
  };

  let header;
  if (events) {
    header = (
      <Header
        title={variables.getMessage(`${GREETING_SECTION}.title`)}
        secondaryTitle="Events"
        goBack={() => setEvents(false)}
        report={false}
      />
    );
  } else {
    header = (
      <Header
        title={variables.getMessage(`${GREETING_SECTION}.title`)}
        setting="greeting"
        category="greeting"
        element=".greeting"
        zoomSetting="zoomGreeting"
        visibilityToggle={true}
      />
    );
  }

  return (
    <>
      {header}
      {events ? (
        <>
          <Row>
            <Content title="Events" subtitle="Enable events." />
            <Action>
              <Checkbox
                name="events"
                text={variables.getMessage(`${GREETING_SECTION}.events`)}
                category="greeting"
              />
            </Action>
          </Row>
          {BirthdayOptions()}
        </>
      ) : (
        <PreferencesWrapper setting="greeting" zoomSetting="zoomGreeting" visibilityToggle={true}>
          <AdditionalOptions />
          <Section
            title="Events"
            subtitle="Control events on Mue such as birthdays."
            onClick={() => setEvents(true)}
            icon={<MdEventNote />}
          />
        </PreferencesWrapper>
      )}
    </>
  );
};

export { GreetingOptions as default, GreetingOptions };
