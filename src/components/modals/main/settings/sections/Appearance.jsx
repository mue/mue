import variables from 'modules/variables';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Radio from '../Radio';
import Slider from '../Slider';
import Text from '../Text';

export default function AppearanceSettings() {
  const getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  const languagecode = variables.languagecode;

  const themeOptions = [
    {
      name: getMessage(languagecode, 'modals.main.settings.sections.appearance.theme.auto'),
      value: 'auto'
    },
    {
      name: getMessage(languagecode, 'modals.main.settings.sections.appearance.theme.light'),
      value: 'light'
    }, 
    {
      name: getMessage(languagecode, 'modals.main.settings.sections.appearance.theme.dark'),
      value: 'dark'
    }
  ];

  return (
    <>
      <h2>{getMessage(languagecode, 'modals.main.settings.sections.appearance.title')}</h2>
      <Radio name='theme' title={getMessage(languagecode, 'modals.main.settings.sections.appearance.theme.title')} options={themeOptions} category='other' />

      <h3>{getMessage(languagecode, 'modals.main.settings.sections.appearance.navbar.title')}</h3>
      <Checkbox name='notesEnabled' text={getMessage(languagecode, 'modals.main.settings.sections.appearance.navbar.notes')} category='navbar' />
      <Dropdown label={getMessage(languagecode, 'modals.main.settings.sections.appearance.navbar.refresh')} name='refresh' category='navbar'>
        <option value='false'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.navbar.refresh_options.none')}</option>
        <option value='background'>{getMessage(languagecode, 'modals.main.settings.sections.background.title')}</option>
        <option value='quote'>{getMessage(languagecode, 'modals.main.settings.sections.quote.title')}</option>
        <option value='quotebackground'>{getMessage(languagecode, 'modals.main.settings.sections.quote.title')} + {getMessage(languagecode, 'modals.main.settings.sections.background.title')}</option>
        {/* before it was just a checkbox */}
        <option value='true'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.navbar.refresh_options.page')}</option>
      </Dropdown>
      <br/>
      <Slider title={getMessage(languagecode, 'modals.main.settings.sections.appearance.accessibility.widget_zoom')} name='zoomNavbar' min='10' max='400' default='100' display='%' category='navbar' />

      <h3>{getMessage(languagecode, 'modals.main.settings.sections.appearance.font.title')}</h3>
      <Text title={getMessage(languagecode, 'modals.main.settings.sections.appearance.font.custom')} name='font' upperCaseFirst={true} category='other' />
      <br/>
      <Checkbox name='fontGoogle' text={getMessage(languagecode, 'modals.main.settings.sections.appearance.font.google')} category='other' />
      <Dropdown label={getMessage(languagecode, 'modals.main.settings.sections.appearance.font.weight.title')} name='fontweight' category='other'>
        {/* names are taken from https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight */}
        <option value='100'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.font.weight.thin')}</option>
        <option value='200'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.font.weight.extra_light')}</option>
        <option value='300'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.font.weight.light')}</option>
        <option value='400'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.font.weight.normal')}</option>
        <option value='500'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.font.weight.medium')}</option>
        <option value='600'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.font.weight.semi_bold')}</option>
        <option value='700'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.font.weight.bold')}</option>
        <option value='800'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.font.weight.extra_bold')}</option>
      </Dropdown>
      <br/><br/>
      <Dropdown label={getMessage(languagecode, 'modals.main.settings.sections.appearance.font.style.title')} name='fontstyle' category='other'>
        <option value='normal'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.font.style.normal')}</option>
        <option value='italic'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.font.style.italic')}</option>
        <option value='oblique'>{getMessage(languagecode, 'modals.main.settings.sections.appearance.font.style.oblique')}</option>
      </Dropdown>

      <h3>{getMessage(languagecode, 'modals.main.settings.sections.appearance.accessibility.title')}</h3>
      <Checkbox text={getMessage(languagecode, 'modals.main.settings.sections.appearance.accessibility.text_shadow')} name='textBorder' category='other'/>
      <Checkbox text={getMessage(languagecode, 'modals.main.settings.sections.appearance.accessibility.animations')} name='animations' category='other'/>
      <Slider title={getMessage(languagecode, 'modals.main.settings.sections.appearance.accessibility.toast_duration')} name='toastDisplayTime' default='2500' step='100' min='500' max='5000' toast={true} display={' ' + getMessage(languagecode, 'modals.main.settings.sections.appearance.accessibility.miliseconds')} />
    </>
  );
}
