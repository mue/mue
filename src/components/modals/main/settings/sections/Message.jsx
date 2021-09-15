import variables from 'modules/variables';

import Switch from '../Switch';
import Text from '../Text';
import Slider from '../Slider';

export default function MessageSettings() {
  const getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  const languagecode = variables.languagecode;

  return (
    <>
      <h2>{getMessage(languagecode, 'modals.main.settings.sections.message.title')}</h2>
      <Switch name='message' text={getMessage(languagecode, 'modals.main.settings.enabled')} category='message' element='.message'/>
      <Text title={getMessage(languagecode, 'modals.main.settings.sections.message.text')} name='messageText' category='text'/>
      <Slider title={getMessage(languagecode, 'modals.main.settings.sections.appearance.accessibility.widget_zoom')} name='zoomMessage' min='10' max='400' default='100' display='%' category='message' />
    </>
  );
}
