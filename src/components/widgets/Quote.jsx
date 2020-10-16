import React from 'react';
import Quotes from '@muetab/quotes';
import FileCopy from '@material-ui/icons/FilterNone';
import { toast } from 'react-toastify';
import * as Constants from '../../modules/constants';
import TwitterIcon from '@material-ui/icons/Twitter';
import StarIcon from '@material-ui/icons/Star';
import StarIcon2 from '@material-ui/icons/StarBorder';

export default class Quote extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
        quote: '',
        author: '',
        favourited: <StarIcon2 className='copyButton' onClick={() => this.favourite()} />
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
        const author = quotePackAPI.authorOverride || data[quotePackAPI.author];
        return this.setState({
          quote: '"' + data[quotePackAPI.quote] + '"',
          author: author
        });
      } catch (e) {
        return this.getQuotePack();
      }
    }

    const favouriteQuote = localStorage.getItem('favouriteQuote');
    if (favouriteQuote) return this.setState({
      quote: favouriteQuote.split(' - ')[0],
      author: favouriteQuote.split(' - ')[1]
    });

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

  favourite() {
    if (localStorage.getItem('favouriteQuote')) {
      localStorage.removeItem('favouriteQuote');
      this.setState({ favourited: <StarIcon2 className='copyButton' onClick={() => this.favourite()} /> });
    } else {
      localStorage.setItem('favouriteQuote', this.state.quote + ' - ' + this.state.author);
      this.setState({ favourited: <StarIcon className='copyButton' onClick={() => this.favourite()} /> });
    }
  }

  componentDidMount() {
    if (localStorage.getItem('quote') === 'false') return;
    if (localStorage.getItem('favouriteQuote')) this.setState({ favourited: <StarIcon className='copyButton' onClick={() => this.favourite()} /> });
    if (localStorage.getItem('favouriteQuoteEnabled') === 'false') this.setState({ favourited: null });
    this.getQuote();
  }

  render() {
    if (localStorage.getItem('quote') === 'false') return null;

    let copy = <FileCopy className='copyButton' onClick={() => this.copyQuote()}></FileCopy>;
    if (localStorage.getItem('copyButton') === 'false') copy = null;

    let tweet = <TwitterIcon className='copyButton' onClick={() => window.open(`https://twitter.com/intent/tweet?text=${this.state.quote} - ${this.state.author} on @getmue`, '_blank').focus()}/>
    if (localStorage.getItem('tweetButton') === 'false') tweet = null;

    return (
        <div className='quotediv'>
          <h1 className='quote'>{`${this.state.quote}`}</h1>
          <h1 className='quoteauthor'>{this.state.author} {copy} {tweet} {this.state.favourited}</h1>
        </div>
    );
  }
}
