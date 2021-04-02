import React from 'react';

import { isChrome } from 'react-device-detect';
import { toast } from 'react-toastify';

import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';
import Switch from '../Switch';

const searchEngines = require('../../../../widgets/search/search_engines.json');

export default class SearchSettings extends React.PureComponent {
  resetSearch() {
    localStorage.removeItem('customSearchEngine');
    document.getElementById('customSearchEngine').value = '';

    toast(this.props.language.toasts.reset);
  }

  componentDidMount() {
    const searchEngine = localStorage.getItem('searchEngine');

    if (searchEngine === 'custom') {
      const input = document.getElementById('searchEngineInput');

      input.style.display = 'block';
      input.enabled = 'true';

      document.getElementById('customSearchEngine').value = localStorage.getItem('customSearchEngine');
    } else {
      localStorage.removeItem('customSearchEngine');
    }
  }

  componentDidUpdate() {
    if (document.getElementById('searchEngineInput').enabled === 'true') {
      const input = document.getElementById('customSearchEngine').value;
      if (input) {
        localStorage.setItem('searchEngine', 'custom');
        localStorage.setItem('customSearchEngine', input);
      }
    }
  }

  setSearchEngine(input) {
    const searchEngineInput = document.getElementById('searchEngineInput');
    if (input === 'custom') {
      searchEngineInput.enabled = 'true';
      searchEngineInput.style.display = 'block';
    } else {
      searchEngineInput.style.display = 'none';
      searchEngineInput.enabled = 'false';
      localStorage.setItem('searchEngine', input);
    }
  }

  render() {
    const language = window.language.modals.main.settings;
    const { search } = language.sections;

    return (
      <>
        <h2>{search.title}</h2>
        <Switch name='searchBar' text={language.enabled} />
        {isChrome ? <Checkbox name='voiceSearch' text={search.voice_search} /> : null}
        <Dropdown label={search.search_engine} name='searchEngine' onChange={(value) => this.setSearchEngine(value)}>
          {searchEngines.map((engine) => (
            <option key={engine.name} value={engine.settingsName}>{engine.name}</option>
          ))}
          <option value='custom'>{search.custom.split(' ')[0]}</option>
        </Dropdown>
        <ul id='searchEngineInput' style={{ display: 'none' }}>
          <p style={{ 'marginTop': '0px' }}>{search.custom} <span className='modalLink' onClick={() => this.resetSearch()}>{language.reset}</span></p>
          <input type='text' id='customSearchEngine'></input>
        </ul>
      </>
    );
  }
}
