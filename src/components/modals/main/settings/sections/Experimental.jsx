import variables from 'modules/variables';
import Checkbox from '../Checkbox';
import Slider from '../Slider';

import EventBus from 'modules/helpers/eventbus';

export default function ExperimentalSettings() {
  const getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  const languagecode = variables.languagecode;

  return (
    <>
      <h2>{getMessage(languagecode, 'modals.main.settings.sections.experimental.title')}</h2>
      <p>{getMessage(languagecode, 'modals.main.settings.sections.experimental.warning')}</p>
      <h3>{getMessage(languagecode, 'modals.main.settings.sections.experimental.developer')}</h3>
      <Checkbox name='debug' text='Debug hotkey (Ctrl + #)' element='.other'/>
      <Slider title='Debug timeout' name='debugtimeout' min='0' max='5000' default='0' step='100' display=' miliseconds' element='.other' />
      <br/>
      <p>Send Event</p>
      Type <input type='text' id='eventType'/>
      <br/><br/>
      Name <input type='text' id='eventName'/>
      <br/><br/>
      <button className='uploadbg' onClick={() => EventBus.dispatch(document.getElementById('eventType').value, document.getElementById('eventName').value)}>Send</button>
      <br/><br/>
      <button className='reset' style={{ marginLeft: '0px' }} onClick={() => localStorage.clear()}>Clear LocalStorage</button>
    </>
  );
}
