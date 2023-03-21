import variables from 'modules/variables';
import { useState, memo } from 'react';
import Checkbox from '../Checkbox';
import Slider from '../Slider';
import { TextField } from '@mui/material';

import EventBus from 'modules/helpers/eventbus';
import { values } from 'modules/helpers/settings/modals';
import SettingsItem from '../SettingsItem';

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
      <SettingsItem
        title={variables.getMessage('modals.main.settings.sections.experimental.developer')}
      >
        <Checkbox name="debug" text="Debug hotkey (Ctrl + #)" element=".other" />
        <Slider
          title="Debug timeout"
          name="debugtimeout"
          min="0"
          max="5000"
          default="0"
          step="100"
          marks={values('experimental')}
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
      </SettingsItem>
      <SettingsItem title="Data" final={true}>
        <button
          className="reset"
          style={{ marginLeft: '0px' }}
          onClick={() => localStorage.clear()}
        >
          Clear LocalStorage
        </button>
      </SettingsItem>
    </>
  );
}

export default memo(ExperimentalSettings);
