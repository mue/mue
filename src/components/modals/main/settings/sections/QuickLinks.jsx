import variables from 'modules/variables';

import Switch from '../Switch';
import Checkbox from '../Checkbox';
import Slider from '../Slider';

export default function QuickLinks() {
  const getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  const languagecode = variables.languagecode;

  return (
    <>
      <h2>{getMessage(languagecode, 'modals.main.settings.sections.quicklinks.title')}</h2>
      <Switch name='quicklinksenabled' text={getMessage(languagecode, 'modals.main.settings.enabled')} category='quicklinks' element='.quicklinks-container'/>
      <Checkbox name='quicklinksText' text={getMessage(languagecode, 'modals.main.settings.sections.quicklinks.text_only')} category='quicklinks'/>
      <Checkbox name='quicklinksddgProxy' text={getMessage(languagecode, 'modals.main.settings.sections.background.ddg_image_proxy')} category='quicklinks'/>
      <Checkbox name='quicklinksnewtab' text={getMessage(languagecode, 'modals.main.settings.sections.quicklinks.open_new')} category='quicklinks'/>
      <Checkbox name='quicklinkstooltip' text={getMessage(languagecode, 'modals.main.settings.sections.quicklinks.tooltip')} category='quicklinks'/>
      <Slider title={getMessage(languagecode, 'modals.main.settings.sections.appearance.accessibility.widget_zoom')} name='zoomQuicklinks' min='10' max='400' default='100' display='%' category='quicklinks'/>
    </>
  );
}
