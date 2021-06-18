import Switch from '../Switch';
import Checkbox from '../Checkbox';

export default function QuickLinks() {
  const language = window.language.modals.main.settings.sections.quicklinks;

  return (
    <>
      <h2>{language.title}</h2>
      <Switch name='quicklinksenabled' text={window.language.modals.main.settings.enabled} category='quicklinks' element='.quicklinks-container' />
      <Checkbox name='quicklinksddgProxy' text={window.language.modals.main.settings.sections.background.ddg_proxy} element='.other' />
      <Checkbox name='quicklinksnewtab' text={language.open_new} category='quicklinks' />
      <Checkbox name='quicklinkstooltip' text={language.tooltip} category='quicklinks' />
    </>
  );
}
