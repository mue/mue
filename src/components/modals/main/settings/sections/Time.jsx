import variables from 'modules/variables';
import { PureComponent } from 'react';

import Header from '../Header';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Radio from '../Radio';

import SettingsItem from '../SettingsItem';

export default class TimeSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      timeType: localStorage.getItem('timeType') || 'digital',
    };
  }

  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    let timeSettings = null;

    const digitalOptions = [
      {
        name: getMessage('modals.main.settings.sections.time.digital.twentyfourhour'),
        value: 'twentyfourhour',
      },
      {
        name: getMessage('modals.main.settings.sections.time.digital.twelvehour'),
        value: 'twelvehour',
      },
    ];

    const digitalSettings = (
      <SettingsItem
        title={getMessage('modals.main.settings.sections.time.digital.title')}
        subtitle={getMessage('modals.main.settings.sections.time.format')}
      >
        <Radio name="timeformat" options={digitalOptions} smallTitle={true} category="clock" />
        <Checkbox
          name="seconds"
          text={getMessage('modals.main.settings.sections.time.digital.seconds')}
          category="clock"
        />
        <Checkbox
          name="zero"
          text={getMessage('modals.main.settings.sections.time.digital.zero')}
          category="clock"
        />
      </SettingsItem>
    );

    const analogSettings = (
      <SettingsItem
        title={getMessage('modals.main.settings.sections.time.analogue.title')}
        subtitle="subtitle"
      >
        <Checkbox
          name="secondHand"
          text={getMessage('modals.main.settings.sections.time.analogue.second_hand')}
          category="clock"
        />
        <Checkbox
          name="minuteHand"
          text={getMessage('modals.main.settings.sections.time.analogue.minute_hand')}
          category="clock"
        />
        <Checkbox
          name="hourHand"
          text={getMessage('modals.main.settings.sections.time.analogue.hour_hand')}
          category="clock"
        />
        <Checkbox
          name="hourMarks"
          text={getMessage('modals.main.settings.sections.time.analogue.hour_marks')}
          category="clock"
        />
        <Checkbox
          name="minuteMarks"
          text={getMessage('modals.main.settings.sections.time.analogue.minute_marks')}
          category="clock"
        />
      </SettingsItem>
    );

    if (this.state.timeType === 'digital') {
      timeSettings = digitalSettings;
    } else if (this.state.timeType === 'analogue') {
      timeSettings = analogSettings;
    }

    return (
      <>
        <Header
          title={getMessage('modals.main.settings.sections.time.title')}
          setting="time"
          category="clock"
          element=".clock-container"
          zoomSetting="zoomClock"
          switch={true}
        />
        <SettingsItem
          title={getMessage('modals.main.settings.sections.time.type')}
          subtitle="subtitle"
        >
          <Dropdown
            label={getMessage('modals.main.settings.sections.time.type')}
            name="timeType"
            onChange={(value) => this.setState({ timeType: value })}
            category="clock"
          >
            <option value="digital">
              {getMessage('modals.main.settings.sections.time.digital.title')}
            </option>
            <option value="analogue">
              {getMessage('modals.main.settings.sections.time.analogue.title')}
            </option>
            <option value="percentageComplete">
              {getMessage('modals.main.settings.sections.time.percentage_complete')}
            </option>
          </Dropdown>
        </SettingsItem>
        {timeSettings}
      </>
    );
  }
}
