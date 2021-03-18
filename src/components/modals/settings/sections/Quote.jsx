import React from 'react';

import Checkbox from '../Checkbox';

export default function QuoteSettings (props) {
  const { quote } = props.language.sections;

  return (
    <div>
      <h2>{quote.title}</h2>
      <Checkbox name='quote' text={props.language.enabled}/>
      <Checkbox name='authorLink' text={quote.author_link}/>
      <h3>{quote.buttons}</h3>
      <Checkbox name='copyButton' text={quote.copy}/>
      <Checkbox name='tweetButton' text={quote.tweet}/>
      <Checkbox name='favouriteQuoteEnabled' text={quote.favourite}/>
    </div>
  );
}
