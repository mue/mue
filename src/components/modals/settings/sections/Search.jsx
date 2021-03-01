import React from 'react';

import { toast } from 'react-toastify';

import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';

const searchEngines = require('../../../widgets/search/search_engines.json');

export default class SearchSettings extends React.PureComponent {
  resetSearch() {
    localStorage.removeItem('customSearchEngine');
    document.getElementById('customSearchEngine').value = '';
    
    toast(this.props.toastLanguage.reset);
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

    document.getElementById('searchEngine').value = searchEngine;
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
    return (
       <div className='section'>
          <h2>Search</h2>
          <Checkbox name='voiceSearch' text={this.props.language.voice_search} />
          <ul>
            <Dropdown label={this.props.language.search_engine}
              name='searchEngine'
              id='searchEngine'
              onChange={() => this.setSearchEngine(document.getElementById('searchEngine').value)} >
              {searchEngines.map((engine) =>
                <option key={engine.name} className='choices' value={engine.settingsName}>{engine.name}</option>
              )}
              <option className='choices' value='custom'>Custom</option>
            </Dropdown>
          </ul>
          <ul id='searchEngineInput' style={{ display: 'none' }}>
            <p style={{ 'marginTop': '0px' }}>{this.props.language.custom} <span className='modalLink' onClick={() => this.resetSearch()}>{this.props.language.reset}</span></p>
            <input type='text' id='customSearchEngine'></input>
          </ul>
        </div>
    );
  }
}