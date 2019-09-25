import React from 'react';
import Fetch from 'unfetch';
import quotes from '../quotes.json';

export default class Quote extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
        quote: ``,
        author: ``
    };
  }

  async getQuote() {
    try {
      let data = await Fetch('https://api.muetab.xyz/getQuote');
      data     = await data.json();
      this.setState({ quote: data.quote, author: data.author });
    } catch (e) {
      const randomInt = (min, max) => { return Math.floor(Math.random() * (max - min + 1)) + min; };
      const num      = randomInt(1, 20);
      this.setState({ quote: quotes[num].quote, author: quotes[num].author })
    }
  }

  componentDidMount() {
    this.getQuote();
  }

  render() {
    return [
    <h1 className='App-quote'>{`"${this.state.quote}"`}</h1>,
    // <i class="material-icons">perm_identity</i>,
    <h1 className='App-quote-author'>{`${this.state.author}`}</h1>,
    ];
  }
}
