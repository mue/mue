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

    const TIME_SECTION = 'modals.main.settings.sections.time';

    const digitalSettings = (
      <SettingsItem
        title={variables.getMessage(`${TIME_SECTION}.digital.title`)}
        subtitle={variables.getMessage(`${TIME_SECTION}.digital.subtitle`)}
        final={true}
      >
        <Radio
          name="timeformat"
          options={[
            {
              name: variables.getMessage(`${TIME_SECTION}.digital.twentyfourhour`),
              value: 'twentyfourhour',
            },
            {
              name: variables.getMessage(`${TIME_SECTION}.digital.twelvehour`),
              value: 'twelvehour',
            },
          ]}
          smallTitle={true}
          category="clock"
        />
        <Checkbox
          name="seconds"
          text={variables.getMessage(`${TIME_SECTION}.digital.seconds`)}
          category="clock"
        />
        <Checkbox
          name="zero"
          text={variables.getMessage(`${TIME_SECTION}.digital.zero`)}
          category="clock"
        />
      </SettingsItem>
    );

    const analogSettings = (
      <SettingsItem
        title={variables.getMessage(`${TIME_SECTION}.analogue.title`)}
        subtitle={variables.getMessage(`${TIME_SECTION}.analogue.subtitle`)}
        final={true}
      >
        <Checkbox
          name="secondHand"
          text={variables.getMessage(`${TIME_SECTION}.analogue.second_hand`)}
          category="clock"
        />
        <Checkbox
          name="minuteHand"
          text={variables.getMessage(`${TIME_SECTION}.analogue.minute_hand`)}
          category="clock"
        />
        <Checkbox
          name="hourHand"
          text={variables.getMessage(`${TIME_SECTION}.analogue.hour_hand`)}
          category="clock"
        />
        <Checkbox
          name="hourMarks"
          text={variables.getMessage(`${TIME_SECTION}.analogue.hour_marks`)}
          category="clock"
        />
        <Checkbox
          name="minuteMarks"
          text={variables.getMessage(`${TIME_SECTION}.analogue.minute_marks`)}
          category="clock"
        />
        <Checkbox
          name="roundClock"
          text={variables.getMessage(`${TIME_SECTION}.analogue.round_clock`)}
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
          title={variables.getMessage(`${TIME_SECTION}.title`)}
          setting="time"
          category="clock"
          element=".clock-container"
          zoomSetting="zoomClock"
          switch={true}
        />
        <SettingsItem
          title={variables.getMessage(`${TIME_SECTION}.type`)}
          subtitle={variables.getMessage(`${TIME_SECTION}.type_subtitle`)}
          final={this.state.timeType === 'percentageComplete'}
        >
          <Dropdown
            name="timeType"
            onChange={(value) => this.setState({ timeType: value })}
            category="clock"
          >
            <option value="digital">{variables.getMessage(`${TIME_SECTION}.digital.title`)}</option>
            <option value="analogue">
              {variables.getMessage(`${TIME_SECTION}.analogue.title`)}
            </option>
            <option value="percentageComplete">
              {variables.getMessage(`${TIME_SECTION}.percentage_complete`)}
            </option>
            <option value="verticalClock">
              {variables.getMessage(`${TIME_SECTION}.vertical_clock.title`)}
            </option>
          </Dropdown>
        </SettingsItem>
        {timeSettings}
      </>
    );
  }
}
