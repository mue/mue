import React from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';

export default function QuoteSettings (props) {
  return (
    <div>
      <h2>Quote</h2>
      <Checkbox name='copyButton' text={props.language.quote.copy} />
            <Checkbox name='tweetButton' text={props.language.quote.tweet} />
            <Checkbox name='favouriteQuoteEnabled' text={props.language.quote.favourite} />
            <Dropdown label={props.language.language} name='quotelanguage' id='quotelanguage' onChange={() => localStorage.setItem('quotelanguage', document.getElementById('quotelanguage').value)}>
              <option className='choices' value='English'>English</option>
              <option className='choices' value='French'>Français</option>
            </Dropdown>
    </div>
  );
}