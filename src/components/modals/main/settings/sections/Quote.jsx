import React from 'react';

import Checkbox from '../Checkbox';
import Text from '../Text';
import Switch from '../Switch';
import Slider from '../Slider';
import Dropdown from '../Dropdown';

export default class QuoteSettings extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      quoteType: localStorage.getItem('quoteType') || 'api',
    };
  }

  marketplaceType = () => {
    if (localStorage.getItem('quote_packs')) {
      return <option value='quote_pack'>{window.language.modals.main.navbar.marketplace}</option>;
    }
  }

  render() {
    const { quote } = window.language.modals.main.settings.sections;

    let quoteSettings;

    const customSettings = (
      <>
        <Text title={quote.custom} name='customQuote' category='quote' element='.quotediv' />
        <Text title={quote.custom_author} name='customQuoteAuthor' category='quote' element='.quotediv'/>
      </>
    );

    switch (this.state.quoteType) {
      case 'custom': quoteSettings = customSettings; break;
      default: break;
    }

    return (
      <>
        <h2>{quote.title}</h2>
        <Switch name='quote' text={window.language.modals.main.settings.enabled} category='quote' element='.quotediv' />
        <Checkbox name='authorLink' text={quote.author_link} element='.other' />
        <Dropdown label={window.language.modals.main.settings.sections.background.type.title} name='quoteType' onChange={(value) => this.setState({ quoteType: value })} category='quote'>
          {this.marketplaceType()}
          <option value='api'>{window.language.modals.main.settings.sections.background.type.api}</option>
          <option value='custom'>{quote.custom}</option>
        </Dropdown>
        {quoteSettings}
        <Slider title={window.language.modals.main.settings.sections.appearance.accessibility.widget_zoom} name='zoomQuote' min='10' max='400' default='100' display='%' category='quote' element='.quotediv' />
  
        <h3>{quote.buttons.title}</h3>
        <Checkbox name='copyButton' text={quote.buttons.copy} category='quote'/>
        <Checkbox name='tweetButton' text={quote.buttons.tweet} category='quote'/>
        <Checkbox name='favouriteQuoteEnabled' text={quote.buttons.favourite} category='quote'/>
      </>
    );
  }
}