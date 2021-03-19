import React from 'react';

import Dropdown from '../Dropdown';

const languages = require('../../../../modules/languages.json');

export default function LanguageSettings () {
  const language = window.language.modals.main.settings.sections.language;

  return (
    <div>
      <h2>{language.title}</h2>
      <Dropdown label={language.title} name='language' id='language' onChange={() => localStorage.setItem('language', document.getElementById('language').value)}>
        {languages.map(language =>
          <option className='choices' value={language.code} key={language.code}>{language.text}</option>
        )}
      </Dropdown>
      <br/>
      <Dropdown label={language.quote} name='quotelanguage' id='quotelanguage' onChange={() => localStorage.setItem('quotelanguage', document.getElementById('quotelanguage').value)}>
        <option className='choices' value='English'>English</option>
        <option className='choices' value='French'>Français</option>
      </Dropdown>
    </div>
  );
}
