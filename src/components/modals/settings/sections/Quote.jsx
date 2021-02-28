import React from 'react';

import Checkbox from '../Checkbox';

export default function QuoteSettings (props) {
  return (
    <div>
      <h2>Quote</h2>
      <Checkbox name='greeting' text={'Enabled'}></Checkbox>
      <h3>Buttons</h3>
      <Checkbox name='copyButton' text={props.language.quote.copy} />
      <Checkbox name='tweetButton' text={props.language.quote.tweet} />
      <Checkbox name='favouriteQuoteEnabled' text={props.language.quote.favourite} />
    </div>
  );
}