import React from 'react';
import Quotes from '@muetab/quotes';
import FileCopy from '@material-ui/icons/FilterNone';
import { toast } from 'react-toastify';
import * as Constants from '../../modules/constants';
import TwitterIcon from '@material-ui/icons/Twitter';

export default class Quote extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
        quote: '',
        author: ''
    };
  }

  doOffline() {
    const quote = Quotes.random(); // Get a random quote from our local package
    this.setState({
      quote: '"' + quote.quote + '"',
      author: quote.author
    }); // Set the quote
  }

  getQuotePack() {
    let quotePack = localStorage.getItem('quote_packs');
    if (quotePack === 'undefined') return this.doOffline();
    quotePack = JSON.parse(quotePack);

    if (quotePack) {
      const data = quotePack[Math.floor(Math.random() * quotePack.length)];
      return this.setState({
        quote: '"' + data.quote + '"',
        author: data.author
      });
    } else this.doOffline();
  }

  async getQuote() {
    const quotePackAPI = JSON.parse(localStorage.getItem('quote_api'));
    if (quotePackAPI) {
      try {
        const data = await (await fetch(quotePackAPI.url)).json();
        let author = data[quotePackAPI.author];
        if (quotePackAPI.authorOverride) author = quotePackAPI.authorOverride;
        return this.setState({
          quote: '"' + data[quotePackAPI.quote] + '"',
          author: author
        });
      } catch (e) {
        return this.getQuotePack();
      }
    }

    if (localStorage.getItem('offlineMode') === 'true') return this.doOffline();

    try { // First we try and get a quote from the API...
      const data = await (await fetch(Constants.API_URL + '/getQuote')).json();
      if (data.statusCode === 429) return this.doOffline(); // If we hit the ratelimit, we fallback to local quotes
      this.setState({
        quote: '"' + data.quote + '"',
        author: data.author
      });
    } catch (e) { // ..and if that fails we load one locally
      this.doOffline();
    }
  }

  copyQuote() {
    navigator.clipboard.writeText(`${this.state.quote} - ${this.state.author}`);
    toast(this.props.language.quote);
  }

  componentDidMount() {
    if (localStorage.getItem('quote') === 'false') return;
    this.getQuote();
  }

  render() {
    let copy = <FileCopy className='copyButton' onClick={() => this.copyQuote()}></FileCopy>;
    if (localStorage.getItem('copyButton') === 'false') copy = null;

    let tweet = <TwitterIcon className='copyButton' onClick={() => window.open(`https://twitter.com/intent/tweet?text=${this.state.quote} - ${this.state.author} on @getmue`, '_blank').focus()}/>
    if (localStorage.getItem('tweetButton') === 'false') tweet = null;

    return (
        <div className='quotediv'>
          <h1 className='quote'>{`${this.state.quote}`}</h1>
          <h1 className='quoteauthor'>{this.state.author} {copy} {tweet}</h1>
        </div>
    );
  }
}
