import React from 'react';
import Dropdown from '../Dropdown';

const languages = require('../../../../modules/languages.json');

export default function LanguageSettings (props) {
  return (
    <div className='section'>
      <h4 htmlFor='language' className='nodropdown'>{props.language.language}</h4>
      <Dropdown
        name='language'
        id='language'
        onChange={() => localStorage.setItem('language', document.getElementById('language').value)}>
          {languages.map(language => 
             <option className='choices' value={language.code} key={language.code}>{language.text}</option>
          )}
      </Dropdown>
    </div>
  );
}