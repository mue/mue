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
      hourColour: localStorage.getItem('hourColour') || '#ffffff',
      minuteColour: localStorage.getItem('minuteColour') || '#ffffff',
    };
  }

  updateColour(type, event) {
    const colour = event.target.value;
    this.setState({ [type]: colour });
    localStorage.setItem(type, colour);
  }

  render() {
    let timeSettings = null;

    const digitalSettings = (
      <SettingsItem
        title={variables.getMessage('modals.main.settings.sections.time.digital.title')}
        subtitle={variables.getMessage('modals.main.settings.sections.time.digital.subtitle')}
        final={true}
      >
        <Radio
          name="timeformat"
          options={[
            {
              name: variables.getMessage(
                'modals.main.settings.sections.time.digital.twentyfourhour',
              ),
              value: 'twentyfourhour',
            },
            {
              name: variables.getMessage('modals.main.settings.sections.time.digital.twelvehour'),
              value: 'twelvehour',
            },
          ]}
          smallTitle={true}
          category="clock"
        />
        <Checkbox
          name="seconds"
          text={variables.getMessage('modals.main.settings.sections.time.digital.seconds')}
          category="clock"
        />
        <Checkbox
          name="zero"
          text={variables.getMessage('modals.main.settings.sections.time.digital.zero')}
          category="clock"
        />
      </SettingsItem>
    );

    const analogSettings = (
      <SettingsItem
        title={variables.getMessage('modals.main.settings.sections.time.analogue.title')}
        subtitle={variables.getMessage('modals.main.settings.sections.time.analogue.subtitle')}
        final={true}
      >
        <Checkbox
          name="secondHand"
          text={variables.getMessage('modals.main.settings.sections.time.analogue.second_hand')}
          category="clock"
        />
        <Checkbox
          name="minuteHand"
          text={variables.getMessage('modals.main.settings.sections.time.analogue.minute_hand')}
          category="clock"
        />
        <Checkbox
          name="hourHand"
          text={variables.getMessage('modals.main.settings.sections.time.analogue.hour_hand')}
          category="clock"
        />
        <Checkbox
          name="hourMarks"
          text={variables.getMessage('modals.main.settings.sections.time.analogue.hour_marks')}
          category="clock"
        />
        <Checkbox
          name="minuteMarks"
          text={variables.getMessage('modals.main.settings.sections.time.analogue.minute_marks')}
          category="clock"
        />
        <Checkbox
          name="roundClock"
          text={variables.getMessage('modals.main.settings.sections.time.analogue.round_clock')}
          category="clock"
        />
      </SettingsItem>
    );

    const verticalClock = (
      <>
        <SettingsItem
          title={variables.getMessage(
            'modals.main.settings.sections.time.vertical_clock.change_hour_colour',
          )}
        >
          <div className="colourInput">
            <input
              type="color"
              name="hourColour"
              className="minuteColour"
              onChange={(event) => this.updateColour('hourColour', event)}
              value={this.state.hourColour}
            ></input>
            <label htmlFor={'hourColour'} className="customBackgroundHex">
              {this.state.hourColour}
            </label>
          </div>
          <span className="link" onClick={() => localStorage.setItem('hourColour', '#ffffff')}>
            {variables.getMessage('modals.main.settings.buttons.reset')}
          </span>
        </SettingsItem>
        <SettingsItem
          title={variables.getMessage(
            'modals.main.settings.sections.time.vertical_clock.change_minute_colour',
          )}
        >
          <div className="colourInput">
            <input
              type="color"
              name="minuteColour"
              className="minuteColour"
              onChange={(event) => this.updateColour('minuteColour', event)}
              value={this.state.minuteColour}
            ></input>
            <label htmlFor={'minuteColour'} className="customBackgroundHex">
              {this.state.minuteColour}
            </label>
          </div>
          <span className="link" onClick={() => localStorage.setItem('minuteColour', '#ffffff')}>
            {variables.getMessage('modals.main.settings.buttons.reset')}
          </span>
        </SettingsItem>
        {digitalSettings}
      </>
    );

    if (this.state.timeType === 'digital') {
      timeSettings = digitalSettings;
    } else if (this.state.timeType === 'analogue') {
      timeSettings = analogSettings;
    } else if (this.state.timeType === 'verticalClock') {
      timeSettings = verticalClock;
    }

    return (
      <>
        <Header
          title={variables.getMessage('modals.main.settings.sections.time.title')}
          setting="time"
          category="clock"
          element=".clock-container"
          zoomSetting="zoomClock"
          switch={true}
        />
        <SettingsItem
          title={variables.getMessage('modals.main.settings.sections.time.type')}
          subtitle={variables.getMessage('modals.main.settings.sections.time.type_subtitle')}
          final={this.state.timeType === 'percentageComplete'}
        >
          <Dropdown
            name="timeType"
            onChange={(value) => this.setState({ timeType: value })}
            category="clock"
          >
            <option value="digital">
              {variables.getMessage('modals.main.settings.sections.time.digital.title')}
            </option>
            <option value="analogue">
              {variables.getMessage('modals.main.settings.sections.time.analogue.title')}
            </option>
            <option value="percentageComplete">
              {variables.getMessage('modals.main.settings.sections.time.percentage_complete')}
            </option>
            <option value="verticalClock">
              {variables.getMessage('modals.main.settings.sections.time.vertical_clock.title')}
            </option>
          </Dropdown>
        </SettingsItem>
        {timeSettings}
      </>
    );
  }
}
