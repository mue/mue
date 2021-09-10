import variables from 'modules/variables';
import { PureComponent } from 'react';

import Radio from '../Radio';

const languages = require('modules/languages.json');

export default class BackgroundSettings extends PureComponent {
  getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  languagecode = variables.languagecode;

  constructor() {
    super();
    this.state = {
      quoteLanguages: [{
        name: this.getMessage(this.languagecode, 'modals.main.loading'),
        value: 'loading'
      }]
    };
    this.controller = new AbortController();
  }

  async getQuoteLanguages() {
    const data = await (await fetch(window.constants.API_URL + '/quotes/languages', { signal: this.controller.signal })).json();

    if (this.controller.signal.aborted === true) {
      return;
    }

    let array = [];
    data.forEach((item) => {
      array.push({
        name: item,
        value: item
      });
    });

    this.setState({
      quoteLanguages: array
    });
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return this.setState({
        quoteLanguages: [{
          name: this.getMessage(this.languagecode, 'modals.main.marketplace.offline.description'),
          value: 'loading'
        }]
      });
    }

    this.getQuoteLanguages();
  }

  componentWillUnmount() {
    // stop making requests
    this.controller.abort();
  }

  render() {
    return (
      <>
        <h2>{this.getMessage(this.languagecode, 'modals.main.settings.sections.language.title')}</h2>
        <Radio name='language' options={languages} element='.other' />
        <h3>{this.getMessage(this.languagecode, 'modals.main.settings.sections.language.quote')}</h3>
        <Radio name='quotelanguage' options={this.state.quoteLanguages} category='quote' />
      </>
    );
  }
}
