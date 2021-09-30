import variables from 'modules/variables';

import Header from '../Header';
import Checkbox from '../Checkbox';

export default function QuickLinks() {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  return (
    <>
      <Header title={getMessage('modals.main.settings.sections.quicklinks.title')} setting='quicklinksenabled' category='quicklinks' element='.quicklinks-container' zoomSetting='zoomQuicklinks'/>
      <Checkbox name='quicklinksText' text={getMessage('modals.main.settings.sections.quicklinks.text_only')} category='quicklinks'/>
      <Checkbox name='quicklinksddgProxy' text={getMessage('modals.main.settings.sections.background.ddg_image_proxy')} category='quicklinks'/>
      <Checkbox name='quicklinksnewtab' text={getMessage('modals.main.settings.sections.quicklinks.open_new')} category='quicklinks'/>
      <Checkbox name='quicklinkstooltip' text={getMessage('modals.main.settings.sections.quicklinks.tooltip')} category='quicklinks'/>
    </>
  );
}
