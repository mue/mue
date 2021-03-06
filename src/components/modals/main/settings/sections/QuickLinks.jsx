import Switch from '../Switch';
import Checkbox from '../Checkbox';
import Slider from '../Slider';

export default function QuickLinks() {
  const language = window.language.modals.main.settings.sections.quicklinks;

  return (
    <>
      <h2>{language.title}</h2>
      <Switch name='quicklinksenabled' text={window.language.modals.main.settings.enabled} category='quicklinks' element='.quicklinks-container' />
      <Checkbox name='quicklinksddgProxy' text={window.language.modals.main.settings.sections.background.ddg_image_proxy} element='.other' />
      <Checkbox name='quicklinksnewtab' text={language.open_new} category='quicklinks' />
      <Checkbox name='quicklinkstooltip' text={language.tooltip} category='quicklinks' />
      <Slider title={window.language.modals.main.settings.sections.appearance.accessibility.widget_zoom} name='zoomQuicklinks' min='10' max='400' default='100' display='%' category='quicklinks' element='.quicklinks-container' />
    </>
  );
}
