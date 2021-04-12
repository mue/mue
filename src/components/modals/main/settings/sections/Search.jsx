import React from 'react';

import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';
import Switch from '../Switch';

import EventBus from '../../../../../modules/helpers/eventbus';

import { isChrome } from 'react-device-detect';
import { toast } from 'react-toastify';

const searchEngines = require('../../../../widgets/search/search_engines.json');

export default class SearchSettings extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      customEnabled: false,
      customDisplay: 'none',
      customValue: localStorage.getItem('customSearchEngine') || ''
    };
    this.language = window.language.modals.main.settings;
  }

  resetSearch() {
    localStorage.removeItem('customSearchEngine');
    this.setState({
      customValue: ''
    });

    toast(window.language.modals.main.settings.toasts.reset);
  }

  componentDidMount() {
    if (localStorage.getItem('searchEngine') === 'custom') {
      this.setState({
        customDisplay: 'block',
        customEnabled: true
      });
    } else {
      localStorage.removeItem('customSearchEngine');
    }
  }

  componentDidUpdate() {
    if (this.state.customEnabled === true && this.state.customValue !== '') {
      localStorage.setItem('customSearchEngine', this.state.customValue);
    }

    EventBus.dispatch('refresh', 'search');
  }

  setSearchEngine(input) {
    if (input === 'custom') {
      this.setState({
        customDisplay: 'block',
        customEnabled: true
      });
    } else {
      this.setState({
        customDisplay: 'none',
        customEnabled: false
      });
      localStorage.setItem('searchEngine', input);
    }

    EventBus.dispatch('refresh', 'search');
  }

  render() {
    const language = window.language.modals.main.settings;
    const { search } = language.sections;

    return (
      <>
        <h2>{search.title}</h2>
        <Switch name='searchBar' text={language.enabled} category='search' />
        {isChrome ? <Checkbox name='voiceSearch' text={search.voice_search} /> : null}

        <Dropdown label={search.search_engine} name='searchEngine' onChange={(value) => this.setSearchEngine(value)}>
          {searchEngines.map((engine) => (
            <option key={engine.name} value={engine.settingsName}>{engine.name}</option>
          ))}
          <option value='custom'>{search.custom.split(' ')[0]}</option>
        </Dropdown>

        <br/><br/>
        <ul style={{ display: this.state.customDisplay }}>
          <p style={{ 'marginTop': '0px' }}>{search.custom} <span className='modalLink' onClick={() => this.resetSearch()}>{language.buttons.reset}</span></p>
          <input type='text' value={this.state.customValue} onInput={(e) => this.setState({ customValue: e.target.value })}></input>
        </ul>
      </>
    );
  }
}
