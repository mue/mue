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

  async getQuote() {
    // Taken from Greeting.jsx
    const t = new Date(); // Current date object
    const m = t.getMonth(); // Current month
    const d = t.getDate(); // Current Date

    try { // First we try and get a quote from the API...
      if (m === 3 && d === 1) { // April fools!
        let data = await fetch('https://api.kanye.rest');
        data = await data.json();
        this.setState({ 
          quote: data.quote, 
          author: 'Kanye West'
        });
      } else {
        let data = await fetch('https://api.muetab.xyz/getQuote');
        data = await data.json();
        this.setState({ 
          quote: data.quote, 
          author: data.author 
        });
      }
    } catch (e) { // ..and if that fails we load one locally
      const quote = Quotes.random(); // Get a random quote from our local package
      this.setState({ 
        quote: quote.quote, 
        author: quote.author 
      }); // Set the quote
    }
  }

  componentDidMount() {
    this.getQuote();
  }

  render() {
    return [
      <h1 className='quote'>{`"${this.state.quote}"`}</h1>,
      // <i class="material-icons">perm_identity</i>,
      <h1 className='quoteauthor'>{`${this.state.author}`}</h1>,
    ];
  }
}
