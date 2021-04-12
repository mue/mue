import React from 'react';

import { engineName } from 'react-device-detect';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Radio from '../Radio';
import Slider from '../Slider';
import Text from '../Text';

export default function AppearanceSettings() {
  const { appearance } = window.language.modals.main.settings.sections;

  const themeOptions = [
    {
      'name': appearance.theme.auto,
      'value': 'auto'
    },
    {
      'name': appearance.theme.light,
      'value': 'light'
    }, 
    {
      'name': appearance.theme.dark,
      'value': 'dark'
    }
  ];

  return (
    <>
      <h2>{appearance.title}</h2>
      <Radio name='theme' title={appearance.theme.title} options={themeOptions} category='other' />

      <h3>{appearance.navbar.title}</h3>
      <Checkbox name='notesEnabled' text={appearance.navbar.notes} />
      <Checkbox name='refresh' text={appearance.navbar.refresh} />

      <h3>{appearance.font.title}</h3>
      <Text title={appearance.font.custom} name='font' upperCaseFirst={true} />
      <br/>
      <Checkbox name='fontGoogle' text={appearance.font.google} />
      <Dropdown label={appearance.font.weight.title} name='fontweight'>
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
      <Dropdown label={appearance.font.style.title} name='fontstyle'>
        <option value='normal'>{appearance.font.style.normal}</option>
        <option value='italic'>{appearance.font.style.italic}</option>
        <option value='oblique'>{appearance.font.style.oblique}</option>
      </Dropdown>

      <h3>{appearance.accessibility.title}</h3>
      {(engineName === 'Blink') ? 
        <Slider title={appearance.accessibility.widget_zoom} name='widgetzoom' default='100' step='10' min='50' max='200' display='%'/> 
      : null}
      <Slider title={appearance.accessibility.toast_duration} name='toastDisplayTime' default='2500' step='100' min='500' max='5000' display={' ' + appearance.accessibility.milliseconds} />
    </>
  );
}
