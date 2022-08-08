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
      colour: localStorage.getItem('minuteColour') || '#ffa500',
    };
  }

  updateColour(event) {
    const colour = event.target.value;
    this.setState({ colour });
    localStorage.setItem('minuteColour', colour);
  }

  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    let timeSettings = null;

    const digitalSettings = (
      <SettingsItem
        title={getMessage('modals.main.settings.sections.time.digital.title')}
        subtitle={getMessage('modals.main.settings.sections.time.digital.subtitle')}
        final={true}
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
        subtitle={getMessage('modals.main.settings.sections.time.analogue.subtitle')}
        final={true}
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

    const modernClock = (
      <>
      <SettingsItem
        title="Change minute text colour"
        subtitle=""
      >
        <div className="colorPicker">
          <input
            type="color"
            name="colour"
            className="colour"
            onChange={(event) => this.updateColour(event)}
            value={this.state.colour}
          ></input>
          <label htmlFor={'colour'} className="customBackgroundHex">
            {this.state.colour}
          </label>
        </div>
      </SettingsItem>
      {digitalSettings}
      </>
    );

    if (this.state.timeType === 'digital') {
      timeSettings = digitalSettings;
    } else if (this.state.timeType === 'analogue') {
      timeSettings = analogSettings;
    } else if (this.state.timeType === 'modernClock') {
      timeSettings = modernClock;
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
          subtitle={getMessage('modals.main.settings.sections.time.type_subtitle')}
          final={this.state.timeType === 'percentageComplete'}
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
            <option value="modernClock">Modern Clock</option>
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
