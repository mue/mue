import { PureComponent } from 'react';

import Checkbox from '../Checkbox';
import Text from '../Text';
import Switch from '../Switch';
import Slider from '../Slider';
import Dropdown from '../Dropdown';

export default class QuoteSettings extends PureComponent {
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
    const { quote, background } = window.language.modals.main.settings.sections;

    let customSettings;
    if (this.state.quoteType === 'custom') {
      customSettings = (
        <>
          <Text title={quote.custom} name='customQuote' category='quote' />
          <Text title={quote.custom_author} name='customQuoteAuthor' category='quote'/>
        </>
      );
    } else {
      // api
      customSettings = (
        <>
          <br/><br/>
          <Dropdown label={background.interval.title} name='quotechange'>
            <option value='refresh'>{window.language.tabname}</option>
            <option value='60000'>{background.interval.minute}</option>
            <option value='1800000'>{background.interval.half_hour}</option>
            <option value='3600000'>{background.interval.hour}</option>
            <option value='86400000'>{background.interval.day}</option>
            <option value='604800000'>{window.language.widgets.date.week}</option>
            <option value='2628000000'>{background.interval.month}</option>
          </Dropdown>
        </>
      );
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
        {customSettings}
        <Slider title={window.language.modals.main.settings.sections.appearance.accessibility.widget_zoom} name='zoomQuote' min='10' max='400' default='100' display='%' category='quote' />
  
        <h3>{quote.buttons.title}</h3>
        <Checkbox name='copyButton' text={quote.buttons.copy} category='quote'/>
        <Checkbox name='tweetButton' text={quote.buttons.tweet} category='quote'/>
        <Checkbox name='favouriteQuoteEnabled' text={quote.buttons.favourite} category='quote'/>
      </>
    );
  }
}