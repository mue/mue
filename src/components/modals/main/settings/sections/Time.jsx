import variables from 'modules/variables';
import { PureComponent } from 'react';

import Header from '../Header';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Radio from '../Radio';
//import Slider from '../Slider';
//import Switch from '../Switch';

import SettingsItem from '../SettingsItem';

//import { values } from 'modules/helpers/settings/modals';

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

    const digitalSettings = (
      <SettingsItem
        title={getMessage('modals.main.settings.sections.time.digital.title')}
        subtitle="Change how the digital clock looks"
      >
        <Radio
          name="timeformat"
          options={[
            {
              name: getMessage('modals.main.settings.sections.time.digital.twentyfourhour'),
              value: 'twentyfourhour',
            },
            {
              name: getMessage('modals.main.settings.sections.time.digital.twelvehour'),
              value: 'twelvehour',
            },
          ]}
          smallTitle={true}
          category="clock"
        />
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
        subtitle="Change how the analogue clock looks"
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
          subtitle="Choose whether to display the time in digital or analogue format, or a percentage completion of the day"
        >
          <Dropdown
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
        {/*<SettingsItem
          title="Pomodoro"
          subtitle="The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, typically 25 minutes in length, separated by short breaks"
          final={true}
        >
          <Switch
            name="Pomodoro"
            text={getMessage('modals.main.settings.enabled')}
            category="Pomodoro"
            element="Pomodoro"
          />
          <Slider
            title="Work Length"
            name="pomdoroWorkLength"
            default="25"
            step="1"
            min="5"
            max="60"
            marks={values('pomodoroWork')}
            display={' ms'}
          />
          <Slider
            title="Break Length"
            name="PomodoroBreakLength"
            default="5"
            step="1"
            min="1"
            max="45"
            marks={values('pomodoroBreak')}
            display={' ms'}
          />
    </SettingsItem>*/}
      </>
    );
  }
}
