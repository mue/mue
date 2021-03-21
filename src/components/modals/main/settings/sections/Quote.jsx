import React from 'react';

import Checkbox from '../Checkbox';
import Text from '../Text';

export default function QuoteSettings(props) {
  const { quote } = window.language.modals.main.settings.sections;

  return (
    <div>
      <h2>{quote.title}</h2>
      <Checkbox name='quote' text={window.language.modals.main.settings.enabled}/>
      <Checkbox name='authorLink' text={quote.author_link}/>
      <Text title={quote.custom} name='customQuote'/>
      <Text title={quote.custom_author} name='customQuoteAuthor'/>

      <h3>{quote.buttons.title}</h3>
      <Checkbox name='copyButton' text={quote.buttons.copy}/>
      <Checkbox name='tweetButton' text={quote.buttons.tweet}/>
      <Checkbox name='favouriteQuoteEnabled' text={quote.buttons.favourite}/>
    </div>
  );
}