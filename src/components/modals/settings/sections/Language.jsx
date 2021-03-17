import React from 'react';
import Dropdown from '../Dropdown';

const languages = require('../../../../modules/languages.json');

export default function LanguageSettings (props) {
  return (
    <div>
      <h2>Language</h2>
      <h4 htmlFor='language' className='nodropdown'>{props.language.language}</h4>
      <Dropdown
        name='language'
        id='language'
        onChange={() => localStorage.setItem('language', document.getElementById('language').value)}>
        {languages.map(language =>
          <option className='choices' value={language.code} key={language.code}>{language.text}</option>
        )}
      </Dropdown>
      <h4 htmlFor='quotelanguage' className='nodropdown'>Quote {props.language.language}</h4>
      <Dropdown label={props.language.language} name='quotelanguage' id='quotelanguage' onChange={() => localStorage.setItem('quotelanguage', document.getElementById('quotelanguage').value)}>
        <option className='choices' value='English'>English</option>
        <option className='choices' value='French'>Français</option>
      </Dropdown>
    </div>
  );
}
