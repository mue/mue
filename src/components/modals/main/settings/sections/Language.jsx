import React from 'react';

import Dropdown from '../Dropdown';
import Radio from '../Radio';

const languages = require('../../../../../modules/languages.json');

export default function LanguageSettings() {
  const language = window.language.modals.main.settings.sections.language;

  return (
    <>
      <h2>{language.title}</h2>
      <Radio name='language' options={languages} />
      <br/>
      <Dropdown label={language.quote} name='quotelanguage'>
        <option className='choices' value='English'>English</option>
        <option className='choices' value='French'>Français</option>
      </Dropdown>
    </>
  );
}
