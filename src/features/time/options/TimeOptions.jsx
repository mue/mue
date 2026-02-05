import { useT } from 'contexts';
import React, { useState } from 'react';
import EventBus from 'utils/eventbus';

import { Header, Row, Content, Action, PreferencesWrapper, Section } from 'components/Layout/Settings';
import { Checkbox, Dropdown, Radio } from 'components/Form/Settings';
import googleFonts from 'config/googleFonts.json';

import { MdRefresh, MdPalette } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Button } from 'components/Elements';

const TimeOptions = ({ currentSubSection, onSubSectionChange, sectionName }) => {
  const t = useT();
  const [timeType, setTimeType] = useState(localStorage.getItem('timeType') || 'digital');
  const [hourColour, setHourColour] = useState(localStorage.getItem('hourColour') || '#ffffff');
  const [minuteColour, setMinuteColour] = useState(
    localStorage.getItem('minuteColour') || '#ffffff',
  );
  const [secondColour, setSecondColour] = useState(
    localStorage.getItem('secondColour') || '#ffffff',
  );
  const [clockColor, setClockColor] = useState(localStorage.getItem('clockColor') || '#ffffff');
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
    EventBus.emit('refresh', 'clock');
  };

  const WidgetType = () => {
    return (
      <Row final={timeType === 'percentageComplete'}>
        <Content title={t(`${TIME_SECTION}.type`)} subtitle={t(`${TIME_SECTION}.type_subtitle`)} />
        <Action>
          <Dropdown
            name="timeType"
            onChange={(value) => setTimeType(value)}
            category="clock"
            items={[
              { value: 'digital', text: t(`${TIME_SECTION}.digital.title`) },
              { value: 'analogue', text: t(`${TIME_SECTION}.analogue.title`) },
              {
                value: 'percentageComplete',
                text: t(`${TIME_SECTION}.percentage_complete`),
              },
              {
                value: 'verticalClock',
                text: t(`${TIME_SECTION}.vertical_clock.title`),
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
        title={t(`${TIME_SECTION}.digital.title`)}
        subtitle={t(`${TIME_SECTION}.digital.subtitle`)}
      />
      <Action>
        <Radio
          name="timeformat"
          options={[
            {
              name: t(`${TIME_SECTION}.digital.twentyfourhour`),
              value: 'twentyfourhour',
            },
            {
              name: t(`${TIME_SECTION}.digital.twelvehour`),
              value: 'twelvehour',
            },
          ]}
          smallTitle={true}
          category="clock"
        />
        <Checkbox name="seconds" text={t(`${TIME_SECTION}.digital.seconds`)} category="clock" />
        <Checkbox name="zero" text={t(`${TIME_SECTION}.digital.zero`)} category="clock" />
      </Action>
    </Row>
  );

  const analogSettings = (
    <Row final={true}>
      <Content
        title={t(`${TIME_SECTION}.analogue.title`)}
        subtitle={t(`${TIME_SECTION}.analogue.subtitle`)}
      />
      <Action>
        <Checkbox
          name="secondHand"
          text={t(`${TIME_SECTION}.analogue.second_hand`)}
          category="clock"
        />
        <Checkbox
          name="minuteHand"
          text={t(`${TIME_SECTION}.analogue.minute_hand`)}
          category="clock"
        />
        <Checkbox name="hourHand" text={t(`${TIME_SECTION}.analogue.hour_hand`)} category="clock" />
        <Checkbox
          name="hourMarks"
          text={t(`${TIME_SECTION}.analogue.hour_marks`)}
          category="clock"
        />
        <Checkbox
          name="minuteMarks"
          text={t(`${TIME_SECTION}.analogue.minute_marks`)}
          category="clock"
        />
        <Checkbox
          name="roundClock"
          text={t(`${TIME_SECTION}.analogue.round_clock`)}
          category="clock"
        />
      </Action>
    </Row>
  );

  const verticalClock = (
    <>
      <Row>
        <Content
          title={t('modals.main.settings.sections.time.vertical_clock.change_hour_colour')}
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
            {t('modals.main.settings.buttons.reset')}
          </span>
        </Action>
      </Row>
      <Row>
        <Content
          title={t('modals.main.settings.sections.time.vertical_clock.change_minute_colour')}
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
            {t('modals.main.settings.buttons.reset')}
          </span>
        </Action>
      </Row>
      <Row>
        <Content
          title={t('modals.main.settings.sections.time.vertical_clock.change_second_colour')}
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
            {t('modals.main.settings.buttons.reset')}
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

  const AppearanceSection = () => {
    const fontWeight = `${TIME_SECTION}.appearance.font_weight`;

    const updateClockColor = (event) => {
      const color = event.target.value;
      setClockColor(color);
      localStorage.setItem('clockColor', color);
      EventBus.emit('refresh', 'clock');
    };

    return (
      <>
        <Row>
          <Content
            title={t(`${TIME_SECTION}.appearance.font.title`)}
            subtitle={t(`${TIME_SECTION}.appearance.font.description`)}
          />
          <Action>
            <Dropdown
              label={t(`${TIME_SECTION}.appearance.font.custom`)}
              name="clockFont"
              category="clock"
              searchable={true}
              items={googleFonts.map((font) => ({
                value: font,
                text: font,
              }))}
            />
          </Action>
        </Row>
        <Row>
          <Content
            title={t(`${TIME_SECTION}.appearance.font_weight.title`)}
            subtitle={t(`${TIME_SECTION}.appearance.font_weight.description`)}
          />
          <Action>
            <Dropdown
              label={t(`${TIME_SECTION}.appearance.font_weight.title`)}
              name="clockFontWeight"
              category="clock"
              items={[
                { value: '600', text: t(fontWeight + '.semi_bold') },
                { value: '100', text: t(fontWeight + '.thin') },
                { value: '200', text: t(fontWeight + '.extra_light') },
                { value: '300', text: t(fontWeight + '.light') },
                { value: '400', text: t(fontWeight + '.normal') },
                { value: '500', text: t(fontWeight + '.medium') },
                { value: '700', text: t(fontWeight + '.bold') },
                { value: '800', text: t(fontWeight + '.extra_bold') },
              ]}
            />
          </Action>
        </Row>
        <Row>
          <Content
            title={t(`${TIME_SECTION}.appearance.font_style.title`)}
            subtitle={t(`${TIME_SECTION}.appearance.font_style.description`)}
          />
          <Action>
            <Dropdown
              label={t(`${TIME_SECTION}.appearance.font_style.title`)}
              name="clockFontStyle"
              category="clock"
              items={[
                { value: 'normal', text: t(`${TIME_SECTION}.appearance.font_style.normal`) },
                { value: 'italic', text: t(`${TIME_SECTION}.appearance.font_style.italic`) },
                { value: 'oblique', text: t(`${TIME_SECTION}.appearance.font_style.oblique`) },
              ]}
            />
          </Action>
        </Row>
        <Row final={true}>
          <Content
            title={t(`${TIME_SECTION}.appearance.color.title`)}
            subtitle={t(`${TIME_SECTION}.appearance.color.description`)}
          />
          <Action>
            <div className="colourInput">
              <input type="color" name="clockColor" onChange={updateClockColor} value={clockColor} />
              <label htmlFor="clockColor" className="customBackgroundHex">
                {clockColor}
              </label>
            </div>
            <span
              className="link"
              onClick={() => {
                localStorage.setItem('clockColor', '#ffffff');
                setClockColor('#ffffff');
              }}
            >
              <MdRefresh />
              {t('modals.main.settings.buttons.reset')}
            </span>
          </Action>
        </Row>
      </>
    );
  };

  const isAppearanceSection = currentSubSection === 'appearance';

  let header;
  if (isAppearanceSection) {
    header = (
      <Header
        title={t(`${TIME_SECTION}.title`)}
        secondaryTitle={t(`${TIME_SECTION}.appearance.title`)}
        goBack={() => onSubSectionChange(null, sectionName)}
        report={false}
      >
        <Button
          type="settings"
          onClick={() => {
            localStorage.removeItem('clockFont');
            localStorage.removeItem('clockFontWeight');
            localStorage.removeItem('clockFontStyle');
            localStorage.setItem('clockColor', '#ffffff');
            localStorage.setItem('hourColour', '#ffffff');
            localStorage.setItem('minuteColour', '#ffffff');
            localStorage.setItem('secondColour', '#ffffff');
            EventBus.emit('refresh', 'clock');
            toast(t('toasts.reset'));
          }}
          icon={<MdRefresh />}
          label={t('modals.main.settings.buttons.reset')}
        />
      </Header>
    );
  } else {
    header = (
      <Header
        title={t(`${TIME_SECTION}.title`)}
        setting="time"
        category="clock"
        element=".clock-container"
        zoomSetting="zoomClock"
        visibilityToggle={true}
      />
    );
  }

  return (
    <>
      {header}
      {isAppearanceSection ? (
        <AppearanceSection />
      ) : (
        <PreferencesWrapper
          setting="time"
          zoomSetting="zoomClock"
          category="clock"
          visibilityToggle={true}
        >
          <Section
            title={t(`${TIME_SECTION}.appearance.title`)}
            subtitle={t(`${TIME_SECTION}.appearance.description`)}
            onClick={() => onSubSectionChange('appearance', sectionName)}
            icon={<MdPalette />}
          >
            <Button
              type="settings"
              onClick={(e) => {
                e.stopPropagation();
                localStorage.removeItem('clockFont');
                localStorage.removeItem('clockFontWeight');
                localStorage.removeItem('clockFontStyle');
                localStorage.setItem('clockColor', '#ffffff');
                localStorage.setItem('hourColour', '#ffffff');
                localStorage.setItem('minuteColour', '#ffffff');
                localStorage.setItem('secondColour', '#ffffff');
                EventBus.emit('refresh', 'clock');
                toast(t('toasts.reset'));
              }}
              icon={<MdRefresh />}
              label={t('modals.main.settings.buttons.reset')}
            />
          </Section>
          <WidgetType />
          {getTimeSettings()}
        </PreferencesWrapper>
      )}
    </>
  );
};

export { TimeOptions as default, TimeOptions };
