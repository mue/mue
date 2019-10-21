//* Imports
import React from 'react';
import Fetch from 'unfetch';
import quotes from '../quotes.json';

// Pick randon number
const randomInt = (min, max) => { return Math.floor(Math.random() * (max - min + 1)) + min; };

export default class Quote extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
        quote: ``,
        author: ``
    };
  }

  async getQuote() {
    try { // First we try and get a quote from the API...
      let data = await Fetch('https://api.muetab.xyz/getQuote');
      data = await data.json();
      this.setState({ quote: data.quote, author: data.author });
    } catch (e) { // ..and if that fails we load one locally
      const num = randomInt(1, 20);
      this.setState({ quote: quotes[num].quote, author: quotes[num].author });
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
