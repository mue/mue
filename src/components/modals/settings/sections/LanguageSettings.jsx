import React from 'react';

export default class LanguageSettings extends React.PureComponent {
  render() {
    return (
        <div className='section'>
        <h4 htmlFor='language'>{this.props.language.language} </h4>
          <select className='select-css' name='language' id='language' onChange={() => localStorage.setItem('language', document.getElementById('language').value)}>
            <option className='choices' value='en'>English</option>
            <option className='choices' value='nl'>Nederlands</option>
            <option className='choices' value='fr'>Français</option>
            <option className='choices' value='no'>Norsk</option>
            <option className='choices' value='ru'>Russian</option>
          </select>
        </div>
    );
  }
}