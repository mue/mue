import React from 'react';

import Checkbox from '../Checkbox';

import { toast } from 'react-toastify';

export default class QuoteSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      customQuote: localStorage.getItem('customQuote'),
      customQuoteAuthor: localStorage.getItem('customQuoteAuthor') || 'Unknown'
    };
  }


  resetItem(key) {
    switch (key) {
      case 'customQuote':
        localStorage.setItem('customQuote', '');
        this.setState({
          customQuote: ''
        });
        break;

      case 'customQuoteAuthor':
        localStorage.setItem('customQuoteAuthor', '');
        this.setState({
          customQuoteAuthor: 'Unknown'
        });
        break;

      default:
        toast('resetItem requires a key!');
    }

    toast(this.props.language.toasts.reset);
  }

  componentDidUpdate() {
    localStorage.setItem('customQuote', this.state.customQuote);
    localStorage.setItem('customQuoteAuthor', this.state.customQuoteAuthor);
  }

  render() {
    const { quote } = this.props.language.sections;

    return (
      <div>
        <h2>{quote.title}</h2>
        <Checkbox name='quote' text={this.props.language.enabled}/>
        <Checkbox name='authorLink' text={quote.author_link}/>
        <ul>
            <p>{quote.custom} <span className='modalLink' onClick={() => this.resetItem('customQuote')}>{this.props.language.buttons.reset}</span></p>
            <input type='text' value={this.state.customQuote} onChange={(e) => this.setState({ customQuote: e.target.value })}></input>
        </ul>
        <ul>
            <p>{quote.custom_author} <span className='modalLink' onClick={() => this.resetItem('customQuoteAuthor')}>{this.props.language.buttons.reset}</span></p>
            <input type='text' value={this.state.customQuoteAuthor} onChange={(e) => this.setState({ customQuoteAuthor: e.target.value })}></input>
        </ul>
        <h3>{quote.buttons}</h3>
        <Checkbox name='copyButton' text={quote.copy}/>
        <Checkbox name='tweetButton' text={quote.tweet}/>
        <Checkbox name='favouriteQuoteEnabled' text={quote.favourite}/>
      </div>
    );
  }
}
