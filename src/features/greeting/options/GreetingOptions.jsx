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
import { TextareaAutosize } from '@mui/material';
import { Button } from 'components/Elements';
import { toast } from 'react-toastify';

import defaultEvents from '../events.json';

import { MdEventNote, MdAdd, MdCancel, MdRefresh } from 'react-icons/md';

const GreetingOptions = () => {
  const [customEvents, setCustomEvents] = useState(
    JSON.parse(localStorage.getItem('customEvents')) || [],
  );
  const [events, setEvents] = useState(false);

  const [birthday, setBirthday] = useState(
    new Date(localStorage.getItem('birthday')) || new Date(),
  );

  const [enableBirthday, setEnableBirthday] = useState(
    localStorage.getItem('birthdayenabled') === 'true' ? 'preferences' : 'preferencesInactive'
  );

  const [enableCustomEvents, setEnableCustomEvents] = useState(
    localStorage.getItem('events') === 'true' ? 'preferences' : 'preferencesInactive'
  );

  const changeDate = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : new Date();
    localStorage.setItem('birthday', newDate);
    setBirthday(newDate);
  };

  const GREETING_SECTION = 'modals.main.settings.sections.greeting';

  const addEvent = () => {
    // Retrieve the current array of events from localStorage
    const customEvents = JSON.parse(localStorage.getItem('customEvents')) || [];

    // Create a new event
    const newEvent = {
      id: 'widgets.greeting.halloween',
      name: '',
      month: 1,
      date: 1,
    };

    // Add the new event to the array
    const updatedEvents = [...customEvents, newEvent];

    // Add the new event to the array
    customEvents.push(newEvent);

    // Store the updated array back in localStorage
    localStorage.setItem('customEvents', JSON.stringify(customEvents));

    setCustomEvents(updatedEvents);
  };

  const removeEvent = (index) => {
    // Remove the event at the given index
    const updatedEvents = customEvents.filter((_, i) => i !== index);

    // Store the updated array back in localStorage
    localStorage.setItem('customEvents', JSON.stringify(updatedEvents));

    // Update the state
    setCustomEvents(updatedEvents);
  };

  const resetEvents = () => {
    // Reset the events array in localStorage
    localStorage.setItem('customEvents', JSON.stringify(defaultEvents));

    // Update the state
    setCustomEvents(defaultEvents);
    toast(variables.getMessage('toasts.reset'));
  };

  const updateEvent = (index, updatedEvent) => {
    // Update the event in your state
    setCustomEvents((prevEvents) => {
      const newEvents = [...prevEvents];
      newEvents[index] = updatedEvent;
      return newEvents;
    });

    // Update the event in localStorage
    const customEvents = JSON.parse(localStorage.getItem('customEvents') || '[]');
    customEvents[index] = updatedEvent;
    localStorage.setItem('customEvents', JSON.stringify(customEvents));
  };

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
      <Row>
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
            onChange={(value) => { setEnableBirthday(value ? 'preferences' : 'preferencesInactive'); }}
          />
          <div className={enableBirthday}>
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
          </div>
        </Action>
      </Row>
    );
  };

  const CustomEventsSection = () => {
    return (
      <div className={enableCustomEvents}>
        <Row final={true}>
          <Content title={variables.getMessage(`${GREETING_SECTION}.custom`)} />
          <Action>
            <div className="headerActions">
              <Button
                type="settings"
                onClick={resetEvents}
                icon={<MdRefresh />}
                label={variables.getMessage('modals.main.settings.buttons.reset')}
              />
              <Button
                type="settings"
                onClick={addEvent}
                icon={<MdAdd />}
                label={variables.getMessage('widgets.quicklinks.add')}
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
                  <span className="subtitle">
                    {variables.getMessage(`${GREETING_SECTION}.event_name`)}
                  </span>
                  <TextareaAutosize
                    value={event.name}
                    placeholder={variables.getMessage(`${GREETING_SECTION}.event_name`)}
                    onChange={(e) => {
                      const updatedEvent = { ...event, name: e.target.value };
                      updateEvent(index, updatedEvent);
                    }}
                    varient="outlined"
                    style={{ padding: '0' }}
                  />
                </div>
              </div>
              <div>
                <div className="messageAction">
                  <div className="eventDateSelection">
                    <label className="subtitle">
                      {variables.getMessage(`${GREETING_SECTION}.day`)}:
                    </label>
                    <input
                      id="day"
                      type="tel"
                      value={event.date}
                      onChange={(e) => {
                        const updatedEvent = { ...event, date: parseInt(e.target.value, 10) };
                        updateEvent(index, updatedEvent);
                      }}
                    />
                    <hr />
                    <label className="subtitle">
                      {variables.getMessage(`${GREETING_SECTION}.month`)}:
                    </label>
                    <input
                      id="month"
                      type="tel"
                      value={event.month}
                      onChange={(e) => {
                        const updatedEvent = { ...event, month: parseInt(e.target.value, 10) };
                        updateEvent(index, updatedEvent);
                      }}
                    />
                  </div>
                  <Button
                    type="settings"
                    onClick={() => removeEvent(index)}
                    icon={<MdCancel />}
                    label={variables.getMessage('modals.main.marketplace.product.buttons.remove')}
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
              <span className="title">{variables.getMessage(`${GREETING_SECTION}.no_events`)}</span>
              <span className="subtitle">
                {variables.getMessage(`${GREETING_SECTION}.no_events_description`)}
              </span>
              <Button
                type="settings"
                onClick={addEvent}
                icon={<MdAdd />}
                label={variables.getMessage(`${GREETING_SECTION}.add_event`)}
              />
            </div>
          </div>
        )}
      </div>
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
            <Content
              title={variables.getMessage(`${GREETING_SECTION}.events`)}
              subtitle={variables.getMessage(`${GREETING_SECTION}.enable_events`)}
            />
            <Action>
              <Checkbox
                name="events"
                text={variables.getMessage(`${GREETING_SECTION}.events`)}
                category="greeting"
                onChange={(value) => { setEnableCustomEvents(value ? 'preferences' : 'preferencesInactive'); }}
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
            title={variables.getMessage(`${GREETING_SECTION}.events`)}
            subtitle={variables.getMessage(`${GREETING_SECTION}.events_description`)}
            onClick={() => setEvents(true)}
            icon={<MdEventNote />}
          />
        </PreferencesWrapper>
      )}
    </>
  );
};

export { GreetingOptions as default, GreetingOptions };
