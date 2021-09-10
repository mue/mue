import variables from 'modules/variables';
import { PureComponent } from 'react';

import Checkbox from '../Checkbox';
import Text from '../Text';
import Switch from '../Switch';
import Slider from '../Slider';
import Dropdown from '../Dropdown';

export default class QuoteSettings extends PureComponent {
  getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  languagecode = variables.languagecode;

  constructor() {
    super();
    this.state = {
      quoteType: localStorage.getItem('quoteType') || 'api',
    };
  }

  marketplaceType = () => {
    if (localStorage.getItem('quote_packs')) {
      return <option value='quote_pack'>{this.getMessage(this.languagecode, 'modals.main.navbar.marketplace')}</option>;
    }
  }

  render() {
    let customSettings;
    if (this.state.quoteType === 'custom') {
      customSettings = (
        <>
          <Text title={this.getMessage(this.languagecode, 'modals.main.settings.sections.quote.custom_quote')} name='customQuote' category='quote' />
          <Text title={this.getMessage(this.languagecode, 'modals.main.settings.sections.quote.custom_author')} name='customQuoteAuthor' category='quote'/>
        </>
      );
    } else {
      // api
      customSettings = (
        <>
          <br/><br/>
          <Dropdown label={this.getMessage(this.languagecode, 'modals.main.settings.sections.background.interval.title')} name='quotechange'>
            <option value='refresh'>{this.getMessage(this.languagecode, 'tabname')}</option>
            <option value='60000'>{this.getMessage(this.languagecode, 'modals.main.settings.sections.background.interval.minute')}</option>
            <option value='1800000'>{this.getMessage(this.languagecode, 'modals.main.settings.sections.background.interval.half_hour')}</option>
            <option value='3600000'>{this.getMessage(this.languagecode, 'modals.main.settings.sections.background.interval.hour')}</option>
            <option value='86400000'>{this.getMessage(this.languagecode, 'modals.main.settings.sections.background.interval.day')}</option>
            <option value='604800000'>{this.getMessage(this.languagecode, 'widgets.date.week')}</option>
            <option value='2628000000'>{this.getMessage(this.languagecode, 'modals.main.settings.sections.background.interval.month')}</option>
          </Dropdown>
        </>
      );
    }

    return (
      <>
        <h2>{this.getMessage(this.languagecode, 'modals.main.settings.sections.quote.title')}</h2>
        <Switch name='quote' text={this.getMessage(this.languagecode, 'modals.main.settings.enabled')} category='quote' element='.quotediv' />
        <Checkbox name='authorLink' text={this.getMessage(this.languagecode, 'modals.main.settings.sections.quote.author_link')} element='.other' />
        <Dropdown label={this.getMessage(this.languagecode, 'modals.main.settings.sections.background.type.title')} name='quoteType' onChange={(value) => this.setState({ quoteType: value })} category='quote'>
          {this.marketplaceType()}
          <option value='api'>{this.getMessage(this.languagecode, 'modals.main.settings.sections.background.type.api')}</option>
          <option value='custom'>{this.getMessage(this.languagecode, 'modals.main.settings.sections.quote.custom')}</option>
        </Dropdown>
        {customSettings}
        <Slider title={this.getMessage(this.languagecode, 'modals.main.settings.sections.appearance.accessibility.widget_zoom')} name='zoomQuote' min='10' max='400' default='100' display='%' category='quote' />
  
        <h3>{this.getMessage(this.languagecode, 'modals.main.settings.sections.quote.buttons.title')}</h3>
        <Checkbox name='copyButton' text={this.getMessage(this.languagecode, 'modals.main.settings.sections.quote.buttons.copy')} category='quote'/>
        <Checkbox name='tweetButton' text={this.getMessage(this.languagecode, 'modals.main.settings.sections.quote.buttons.tweet')} category='quote'/>
        <Checkbox name='favouriteQuoteEnabled' text={this.getMessage(this.languagecode, 'modals.main.settings.sections.quote.buttons.favourite')} category='quote'/>
      </>
    );
  }
}