import variables from 'config/variables';
import { useState, memo } from 'react';
import { Checkbox, Slider } from 'components/Form/Settings';
import { Button } from 'components/Elements';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';

import EventBus from 'utils/eventbus';
import values from 'utils/data/slider_values.json';

import { Row, Content, Action } from 'components/Layout/Settings/Item';

function ExperimentalOptions() {
  const [eventType, setEventType] = useState();
  const [eventName, setEventName] = useState();

  return (
    <>
      <span className="mainTitle">
        {variables.getMessage('settings:sections.experimental.title')}
      </span>
      <span className="subtitle">
        {variables.getMessage('settings:sections.experimental.warning')}
      </span>
      <Row>
        <Content title={variables.getMessage('settings:sections.experimental.developer')} />
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
          <p style={{ textAlign: 'left', width: '100%' }}>Send Event</p>
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
          <Button
            type="settings"
            onClick={() => EventBus.emit(eventType, eventName)}
            label="Send"
          />
          <Button
            type="settings"
            onClick={() => toast('Toasted successfully')}
            label="Normal Toast"
          />
          <Button
            type="settings"
            onClick={() => toast.success('Toasted successfully')}
            label="Achievement Unlocked Toast"
          />
        </Action>
      </Row>
      <Row final={true}>
        <Content title="Data" />
        <Action>
          <Button type="settings" onClick={() => localStorage.clear()} label="Clear LocalStorage" />
        </Action>
      </Row>
    </>
  );
}

const MemoizedExperimentalOptions = memo(ExperimentalOptions);
export {
  MemoizedExperimentalOptions as default,
  MemoizedExperimentalOptions as ExperimentalOptions,
};
