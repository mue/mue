import React from 'react';

import Checkbox from '../Checkbox';

export default function QuoteSettings (props) {
  return (
    <div>
      <h2>{props.language.title}</h2>
      <Checkbox name='greeting' text={'Enabled'}></Checkbox>
      <h3>{props.language.buttons}</h3>
      <Checkbox name='copyButton' text={props.language.copy} />
      <Checkbox name='tweetButton' text={props.language.tweet} />
      <Checkbox name='favouriteQuoteEnabled' text={props.language.favourite} />
    </div>
  );
}