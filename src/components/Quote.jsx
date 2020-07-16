//* Imports
import React from 'react';
import Quotes from '@muetab/quotes';

export default class Quote extends React.Component {
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
    const enabled = localStorage.getItem('offlineMode');
    if (enabled === 'true') return this.doOffline();
    
    try { // First we try and get a quote from the API...
      let data = await fetch('https://api.muetab.xyz/getQuote');
      data = await data.json();
      if (data.statusCode === 429) { // If we hit the ratelimit, we fallback to local quotes
        this.doOffline();
      }
      this.setState({ 
        quote: '"' + data.quote + '"', 
        author: data.author 
      });
    } catch (e) { // ..and if that fails we load one locally
      this.doOffline();
    }
  }

  componentDidMount() {
    const enabled = localStorage.getItem('quote');
    if (enabled === 'false') return;
    this.getQuote();
  }

  render() {
    return [
      <h1 className='quote'>{`${this.state.quote}`}</h1>,
      // <i class="material-icons">perm_identity</i>,
      <h1 className='quoteauthor'>{`${this.state.author}`}</h1>,
    ];
  }
}
