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
      'name': 'Auto',
      'value': 'auto'
    },
    {
      'name': 'Light',
      'value': 'light'
    }, 
    {
      'name': 'Dark',
      'value': 'dark'
    }
  ];

  return (
    <>
      <h2>{appearance.title}</h2>
      <Radio name='theme' title='Theme' options={themeOptions} />

      <h3>{appearance.navbar.title}</h3>
      <Checkbox name='notesEnabled' text={appearance.navbar.notes} />
      <Checkbox name='refresh' text={appearance.navbar.refresh} />

      <h3>{appearance.font.title}</h3>
      <Text title={appearance.font.custom} name='font' upperCaseFirst={true} />
      <br/>
      <Checkbox name='fontGoogle' text={appearance.font.google} />
      <Dropdown label='Font Weight' name='fontweight'>
        {/* names are taken from https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight */}
        <option value='100'>Thin</option>
        <option value='200'>Extra-Light</option>
        <option value='300'>Light</option>
        <option value='400'>Normal</option>
        <option value='500'>Medium</option>
        <option value='600'>Semi-Bold</option>
        <option value='700'>Bold</option>
        <option value='800'>Extra-Bold</option>
      </Dropdown>
      <br/><br/>
      <Dropdown label='Font Style' name='fontstyle'>
        <option value='normal'>Normal</option>
        <option value='italic'>Italic</option>
        <option value='oblique'>Oblique</option>
      </Dropdown>

      <h3>{appearance.accessibility.title}</h3>
      <Checkbox name='animations' text={appearance.animations} betaFeature={true} />
      {(engineName === 'Blink') ? 
        <Slider title={appearance.accessibility.widget_zoom} name='widgetzoom' default='100' min='50' max='200' display='%'/> 
      : null}
      <Slider title={appearance.accessibility.toast_duration} name='toastDisplayTime' default='2500' min='500' max='5000' display={' ' + appearance.accessibility.milliseconds} />
    </>
  );
}
