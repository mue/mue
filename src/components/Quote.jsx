//* Imports
import React from 'react';
import Quotes from '@muetab/quotes';
import copy from 'copy-text-to-clipboard';
import FileCopy from '@material-ui/icons/AttachFile';

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

  copyQuote() {
    copy(`${this.state.quote} - ${this.state.author}`);
    var x = document.getElementById('toast');
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  } 

  componentDidMount() {
    const enabled = localStorage.getItem('quote');
    if (enabled === 'false') return;
    this.getQuote();
  }

  render() {
    return [
        <h1 className='quote'>{`${this.state.quote}`}</h1>,
        <h1 className='quoteauthor'>{this.state.author} <FileCopy className='copyButton' onClick={() => this.copyQuote() }></FileCopy></h1>,
    ];
  }
 
 
 
 
 
 
 
 
 
}
