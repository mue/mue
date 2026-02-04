import { useT } from 'contexts';
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
import { DatePicker } from 'components/Form/Settings/DatePicker';
import { Button } from 'components/Elements';
import { toast } from 'react-toastify';

import defaultEvents from '../events.json';

import { MdEventNote, MdAdd, MdCancel, MdRefresh } from 'react-icons/md';

const GreetingOptions = ({ currentSubSection, onSubSectionChange, sectionName }) => {
  const t = useT();
  const [customEvents, setCustomEvents] = useState(
    JSON.parse(localStorage.getItem('customEvents')) || [],
  );

  const [birthday, setBirthday] = useState(() => {
    const stored = localStorage.getItem('birthday');
    return stored ? new Date(stored) : new Date();
  });

  const [enableBirthday, setEnableBirthday] = useState(
    localStorage.getItem('birthdayenabled') === 'true' ? 'preferences' : 'preferencesInactive',
  );

  const [enableCustomEvents, setEnableCustomEvents] = useState(
    localStorage.getItem('events') === 'true' ? 'preferences' : 'preferencesInactive',
  );

  const changeDate = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : new Date();
    localStorage.setItem('birthday', newDate);
    setBirthday(newDate);
  };

  const GREETING_SECTION = 'modals.main.settings.sections.greeting';

  const addEvent = () => {
    const customEvents = JSON.parse(localStorage.getItem('customEvents')) || [];

    const newEvent = { id: 'widgets.greeting.halloween', name: '', month: 1, date: 1 };

    const updatedEvents = [...customEvents, newEvent];

    customEvents.push(newEvent);

    localStorage.setItem('customEvents', JSON.stringify(customEvents));

    setCustomEvents(updatedEvents);
  };

  const removeEvent = (index) => {
    const updatedEvents = customEvents.filter((_, i) => i !== index);

    localStorage.setItem('customEvents', JSON.stringify(updatedEvents));

    setCustomEvents(updatedEvents);
  };

  const resetEvents = () => {
    localStorage.setItem('customEvents', JSON.stringify(defaultEvents));

    setCustomEvents(defaultEvents);
    toast(t('toasts.reset'));
  };

  const updateEvent = (index, updatedEvent) => {
    setCustomEvents((prevEvents) => {
      const newEvents = [...prevEvents];
      newEvents[index] = updatedEvent;
      return newEvents;
    });

    const customEvents = JSON.parse(localStorage.getItem('customEvents') || '[]');
    customEvents[index] = updatedEvent;
    localStorage.setItem('customEvents', JSON.stringify(customEvents));
  };

  const AdditionalOptions = () => {
    return (
      <Row final={true}>
        <Content
          title={t('modals.main.settings.additional_settings')}
          subtitle={t(`${GREETING_SECTION}.additional`)}
        />
        <Action>
          <Checkbox
            name="defaultGreetingMessage"
            text={t(`${GREETING_SECTION}.default`)}
            category="greeting"
          />
          <Text title={t(`${GREETING_SECTION}.name`)} name="greetingName" category="greeting" />
        </Action>
      </Row>
    );
  };

  const BirthdayOptions = () => {
    return (
      <Row>
        <Content
          title={t(`${GREETING_SECTION}.birthday`)}
          subtitle={t('modals.main.settings.sections.greeting.birthday_subtitle')}
        />
        <Action>
          <Switch
            name="birthdayenabled"
            text={t('modals.main.settings.enabled')}
            category="greeting"
            onChange={(value) => {
              setEnableBirthday(value ? 'preferences' : 'preferencesInactive');
            }}
          />
          <div className={enableBirthday}>
            <Checkbox
              name="birthdayage"
              text={t(`${GREETING_SECTION}.birthday_age`)}
              category="greeting"
            />
            <p style={{ marginRight: 'auto' }}>{t(`${GREETING_SECTION}.birthday_date`)}</p>
            <DatePicker
              value={birthday}
              onChange={(newDate) => {
                localStorage.setItem('birthday', newDate);
                setBirthday(newDate);
              }}
            />
          </div>
        </Action>
      </Row>
    );
  };

  const CustomEventsSection = () => {
    return (
      <div className={enableCustomEvents}>
        <Row final={true}>
          <Content title={t(`${GREETING_SECTION}.custom`)} />
          <Action>
            <div className="headerActions">
              <Button
                type="settings"
                onClick={resetEvents}
                icon={<MdRefresh />}
                label={t('modals.main.settings.buttons.reset')}
              />
              <Button
                type="settings"
                onClick={addEvent}
                icon={<MdAdd />}
                label={t('widgets.quicklinks.add')}
              />
            </div>
          </Action>
        </Row>
        <div className="messagesContainer">
          {customEvents.map((event, index) => (
            <div className="messageMap" key={index}>
              <div className="flexGrow">
                <div className="icon">
                  <MdEventNote />
                </div>
                <div className="messageText">
                  <span className="subtitle">{t(`${GREETING_SECTION}.event_name`)}</span>
                  <input
                    type="text"
                    className="text-field-input event-name-input"
                    value={event.name}
                    placeholder={t(`${GREETING_SECTION}.event_name`)}
                    onChange={(e) => {
                      const updatedEvent = { ...event, name: e.target.value };
                      updateEvent(index, updatedEvent);
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="messageAction">
                  <DatePicker
                    value={new Date(2000, event.month - 1, event.date)}
                    hideYear={true}
                    onChange={(newDate) => {
                      const updatedEvent = {
                        ...event,
                        month: newDate.getMonth() + 1,
                        date: newDate.getDate(),
                      };
                      updateEvent(index, updatedEvent);
                    }}
                  />
                  <Button
                    type="settings"
                    onClick={() => removeEvent(index)}
                    icon={<MdCancel />}
                    label={t('modals.main.marketplace.product.buttons.remove')}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {customEvents.length === 0 && (
          <div className="photosEmpty">
            <div className="emptyNewMessage">
              <MdEventNote />
              <span className="title">{t(`${GREETING_SECTION}.no_events`)}</span>
              <span className="subtitle">{t(`${GREETING_SECTION}.no_events_description`)}</span>
              <Button
                type="settings"
                onClick={addEvent}
                icon={<MdAdd />}
                label={t(`${GREETING_SECTION}.add_event`)}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const isEventsSection = currentSubSection === 'events';

  let header;
  if (isEventsSection) {
    header = (
      <Header
        title={t(`${GREETING_SECTION}.title`)}
        secondaryTitle={t(`${GREETING_SECTION}.events.title`)}
        goBack={() => onSubSectionChange(null, sectionName)}
        report={false}
      />
    );
  } else {
    header = (
      <Header
        title={t(`${GREETING_SECTION}.title`)}
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
      {isEventsSection ? (
        <>
          <Row>
            <Content
              title={t(`${GREETING_SECTION}.events`)}
              subtitle={t(`${GREETING_SECTION}.enable_events`)}
            />
            <Action>
              <Checkbox
                name="events"
                text={t(`${GREETING_SECTION}.events`)}
                category="greeting"
                onChange={(value) => {
                  setEnableCustomEvents(value ? 'preferences' : 'preferencesInactive');
                }}
              />
            </Action>
          </Row>
          {BirthdayOptions()}
          {CustomEventsSection()}
        </>
      ) : (
        <PreferencesWrapper
          setting="greeting"
          zoomSetting="zoomGreeting"
          category="greeting"
          visibilityToggle={true}
        >
          <AdditionalOptions />
          <Section
            title={t(`${GREETING_SECTION}.events`)}
            subtitle={t(`${GREETING_SECTION}.events_description`)}
            onClick={() => onSubSectionChange('events', sectionName)}
            icon={<MdEventNote />}
          />
        </PreferencesWrapper>
      )}
    </>
  );
};

export { GreetingOptions as default, GreetingOptions };
