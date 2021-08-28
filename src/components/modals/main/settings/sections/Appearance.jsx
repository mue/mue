import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Radio from '../Radio';
import Slider from '../Slider';
import Text from '../Text';

export default function AppearanceSettings() {
  const { appearance, background, quote } = window.language.modals.main.settings.sections;

  const themeOptions = [
    {
      name: appearance.theme.auto,
      value: 'auto'
    },
    {
      name: appearance.theme.light,
      value: 'light'
    }, 
    {
      name: appearance.theme.dark,
      value: 'dark'
    }
  ];

  return (
    <>
      <h2>{appearance.title}</h2>
      <Radio name='theme' title={appearance.theme.title} options={themeOptions} category='other' />

      <h3>{appearance.navbar.title}</h3>
      <Checkbox name='notesEnabled' text={appearance.navbar.notes} category='navbar' element='.other' />
      <Dropdown label={appearance.navbar.refresh} name='refresh' category='navbar'>
        <option value='false'>{appearance.navbar.refresh_options.none}</option>
        <option value='background'>{background.title}</option>
        <option value='quote'>{quote.title}</option>
        <option value='quotebackground'>{quote.title} + {background.title}</option>
        {/* before it was just a checkbox */}
        <option value='true'>{appearance.navbar.refresh_options.page}</option>
      </Dropdown>
      <br/>
      <Slider title={appearance.accessibility.widget_zoom} name='zoomNavbar' min='10' max='400' default='100' display='%' category='navbar' />

      <h3>{appearance.font.title}</h3>
      <Text title={appearance.font.custom} name='font' upperCaseFirst={true} category='other' />
      <br/>
      <Checkbox name='fontGoogle' text={appearance.font.google} category='other' />
      <Dropdown label={appearance.font.weight.title} name='fontweight' category='other'>
        {/* names are taken from https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight */}
        <option value='100'>{appearance.font.weight.thin}</option>
        <option value='200'>{appearance.font.weight.extra_light}</option>
        <option value='300'>{appearance.font.weight.light}</option>
        <option value='400'>{appearance.font.weight.normal}</option>
        <option value='500'>{appearance.font.weight.medium}</option>
        <option value='600'>{appearance.font.weight.semi_bold}</option>
        <option value='700'>{appearance.font.weight.bold}</option>
        <option value='800'>{appearance.font.weight.extra_bold}</option>
      </Dropdown>
      <br/><br/>
      <Dropdown label={appearance.font.style.title} name='fontstyle' category='other'>
        <option value='normal'>{appearance.font.style.normal}</option>
        <option value='italic'>{appearance.font.style.italic}</option>
        <option value='oblique'>{appearance.font.style.oblique}</option>
      </Dropdown>

      <h3>{appearance.accessibility.title}</h3>
      <Checkbox text={appearance.accessibility.text_shadow} name='textBorder' category='other'/>
      <Checkbox text={appearance.accessibility.animations} name='animations' category='other'/>
      <Slider title={appearance.accessibility.toast_duration} name='toastDisplayTime' default='2500' step='100' min='500' max='5000' toast={true} display={' ' + appearance.accessibility.milliseconds} />
    </>
  );
}
