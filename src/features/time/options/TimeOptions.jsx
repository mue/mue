import variables from 'config/variables';
import React, { useState } from 'react';

import { Header, Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { Checkbox, Dropdown, Radio } from 'components/Form/Settings';

import { MdRefresh } from 'react-icons/md';

const TimeOptions = () => {
  const [timeType, setTimeType] = useState(localStorage.getItem('timeType') || 'digital');
  const [hourColour, setHourColour] = useState(localStorage.getItem('hourColour') || '#ffffff');
  const [minuteColour, setMinuteColour] = useState(
    localStorage.getItem('minuteColour') || '#ffffff',
  );
  const [secondColour, setSecondColour] = useState(
    localStorage.getItem('secondColour') || '#ffffff',
  );
  const TIME_SECTION = 'modals.main.settings.sections.time';

  const updateColour = (type, event) => {
    const colour = event.target.value;
    if (type === 'hourColour') {
      setHourColour(colour);
    } else if (type === 'minuteColour') {
      setMinuteColour(colour);
    } else if (type === 'secondColour') {
      setSecondColour(colour);
    }
    localStorage.setItem(type, colour);
  };

  const WidgetType = () => {
    return (
      <Row final={timeType === 'percentageComplete'}>
        <Content
          title={variables.getMessage(`${TIME_SECTION}.type`)}
          subtitle={variables.getMessage(`${TIME_SECTION}.type_subtitle`)}
        />
        <Action>
          <Dropdown
            name="timeType"
            onChange={(value) => setTimeType(value)}
            category="clock"
            items={[
              { value: 'digital', text: variables.getMessage(`${TIME_SECTION}.digital.title`) },
              { value: 'analogue', text: variables.getMessage(`${TIME_SECTION}.analogue.title`) },
              {
                value: 'percentageComplete',
                text: variables.getMessage(`${TIME_SECTION}.percentage_complete`),
              },
              {
                value: 'verticalClock',
                text: variables.getMessage(`${TIME_SECTION}.vertical_clock.title`),
              },
            ]}
          />
        </Action>
      </Row>
    );
  };

  const digitalSettings = (
    <Row final={true}>
      <Content
        title={variables.getMessage(`${TIME_SECTION}.digital.title`)}
        subtitle={variables.getMessage(`${TIME_SECTION}.digital.subtitle`)}
      />
      <Action>
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
      </Action>
    </Row>
  );

  const analogSettings = (
    <Row final={true}>
      <Content
        title={variables.getMessage(`${TIME_SECTION}.analogue.title`)}
        subtitle={variables.getMessage(`${TIME_SECTION}.analogue.subtitle`)}
      />
      <Action>
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
      </Action>
    </Row>
  );

  const verticalClock = (
    <>
      <Row>
        <Content
          title={variables.getMessage(
            'modals.main.settings.sections.time.vertical_clock.change_hour_colour',
          )}
        />
        <Action>
          <div className="colourInput">
            <input
              type="color"
              name="hourColour"
              className="minuteColour"
              onChange={(event) => updateColour('hourColour', event)}
              value={hourColour}
            ></input>
            <label htmlFor={'hourColour'} className="customBackgroundHex">
              {hourColour}
            </label>
          </div>
          <span className="link" onClick={() => localStorage.setItem('hourColour', '#ffffff')}>
            <MdRefresh />
            {variables.getMessage('modals.main.settings.buttons.reset')}
          </span>
        </Action>
      </Row>
      <Row>
        <Content
          title={variables.getMessage(
            'modals.main.settings.sections.time.vertical_clock.change_minute_colour',
          )}
        />
        <Action>
          <div className="colourInput">
            <input
              type="color"
              name="minuteColour"
              className="minuteColour"
              onChange={(event) => updateColour('minuteColour', event)}
              value={minuteColour}
            ></input>
            <label htmlFor={'minuteColour'} className="customBackgroundHex">
              {minuteColour}
            </label>
          </div>
          <span className="link" onClick={() => localStorage.setItem('minuteColour', '#ffffff')}>
            <MdRefresh />
            {variables.getMessage('modals.main.settings.buttons.reset')}
          </span>
        </Action>
      </Row>
      <Row>
        <Content
          title={variables.getMessage(
            'modals.main.settings.sections.time.vertical_clock.change_second_colour',
          )}
        />
        <Action>
          <div className="colourInput">
            <input
              type="color"
              name="secondColour"
              className="secondColour"
              onChange={(event) => updateColour('secondColour', event)}
              value={secondColour}
            ></input>
            <label htmlFor={'secondColour'} className="customBackgroundHex">
              {secondColour}
            </label>
          </div>
          <span className="link" onClick={() => localStorage.setItem('secondColour', '#ffffff')}>
            <MdRefresh />
            {variables.getMessage('modals.main.settings.buttons.reset')}
          </span>
        </Action>
      </Row>

      {digitalSettings}
    </>
  );

  const getTimeSettings = () => {
    switch (timeType) {
      case 'digital':
        return digitalSettings;
      case 'analogue':
        return analogSettings;
      case 'verticalClock':
        return verticalClock;
      default:
        return null;
    }
  };

  return (
    <>
      <Header
        title={variables.getMessage(`${TIME_SECTION}.title`)}
        setting="time"
        category="clock"
        element=".clock-container"
        zoomSetting="zoomClock"
        visibilityToggle={true}
      />
      <PreferencesWrapper
        setting="time"
        zoomSetting="zoomClock"
        category="clock"
        visibilityToggle={true}
      >
        <WidgetType />
        {getTimeSettings()}
      </PreferencesWrapper>
    </>
  );
};

export { TimeOptions as default, TimeOptions };
