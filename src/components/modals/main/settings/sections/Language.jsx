import React from 'react';

import Radio from '../Radio';

const languages = require('../../../../../modules/languages.json');

export default class BackgroundSettings extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      quoteLanguages: [{
        name: window.language.modals.main.loading,
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
    data.forEach(item => {
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
          name: window.language.modals.main.marketplace.offline.description,
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
    const language = window.language.modals.main.settings.sections.language;

    return (
      <>
        <h2>{language.title}</h2>
        <Radio name='language' options={languages} element='.language' />
        <h3>{language.quote}</h3>
        <Radio name='quotelanguage' options={this.state.quoteLanguages} category='quote' />
      </>
    );
  }
}
