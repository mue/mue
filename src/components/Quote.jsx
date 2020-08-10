import React from 'react';
import Quotes from '@muetab/quotes';
import copy from 'copy-text-to-clipboard';
import FileCopy from '@material-ui/icons/FilterNone';
import { toast } from 'react-toastify';
import * as Constants from '../modules/constants';

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

  async getQuote() {
    if (localStorage.getItem('offlineMode') === 'true') return this.doOffline();

    try { // First we try and get a quote from the API...
      let data = await fetch(Constants.API_URL +'/getQuote');
      data = await data.json();
      if (data.statusCode === 429) this.doOffline(); // If we hit the ratelimit, we fallback to local quotes
      this.setState({
        quote: '"' + data.quote + '"',
        author: data.author
      });
    } catch (e) { // ..and if that fails we load one locally
      this.doOffline();
    }
  }

  copyQuote() {
    copy(`${this.state.quote} - ${this.state.author}`);
    toast('Quote copied!');
  }

  componentDidMount() {
    if (localStorage.getItem('quote') === 'false') return;
    this.getQuote();
  }

  render() {
    let copy = <FileCopy className='copyButton' onClick={() => this.copyQuote() }></FileCopy>;
    if (localStorage.getItem('copyButton') === 'false') copy = '';

    return (
        <div>
          <h1 className='quote'>{`${this.state.quote}`}</h1>
          <h1 className='quoteauthor'>{this.state.author} {copy}</h1>
        </div>
    )
  }
}
