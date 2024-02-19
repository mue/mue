import variables from 'config/variables';
import { useState, memo } from 'react';
import Checkbox from '../../../../../components/Form/Settings/Checkbox/Checkbox';
import Slider from '../../../../../components/Form/Settings/Slider/Slider';
import { TextField } from '@mui/material';

import EventBus from 'utils/eventbus';
import values from 'utils/data/slider_values.json';

import { Row, Content, Action } from '../../../../../components/Layout/Settings/Item/SettingsItem';

function ExperimentalSettings() {
  const [eventType, setEventType] = useState();
  const [eventName, setEventName] = useState();

  return (
    <>
      <span className="mainTitle">
        {variables.getMessage('modals.main.settings.sections.experimental.title')}
      </span>
      <span className="subtitle">
        {variables.getMessage('modals.main.settings.sections.experimental.warning')}
      </span>
      <Row>
        <Content
          title={variables.getMessage('modals.main.settings.sections.experimental.developer')}
        />
        <Action>
          <Checkbox name="debug" text="Debug hotkey (Ctrl + #)" element=".other" />
          <Slider
            title="Debug timeout"
            name="debugtimeout"
            min="0"
            max="5000"
            default="0"
            step="100"
            marks={values.experimental}
            element=".other"
          />
          <p style={{ textAlign: 'left' }}>Send Event</p>
          <TextField
            label={'Type'}
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            spellCheck={false}
            varient="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={'Name'}
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            spellCheck={false}
            varient="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <button className="uploadbg" onClick={() => EventBus.emit(eventType, eventName)}>
            Send
          </button>
        </Action>
      </Row>
      <Row final={true}>
        <Content title="Data" />
        <Action>
          <button
            className="reset"
            style={{ marginLeft: '0px' }}
            onClick={() => localStorage.clear()}
          >
            Clear LocalStorage
          </button>
        </Action>
      </Row>
    </>
  );
}

export default memo(ExperimentalSettings);
