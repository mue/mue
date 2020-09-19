import React from 'react';
import SettingsFunctions from '../../../../modules/settingsFunctions';
const searchEngines = require('../../../../modules/searchEngines.json');

export default class SearchSettings extends React.PureComponent {
  componentDidMount() {
    if (localStorage.getItem('searchEngine') === 'custom') {
      const input = document.getElementById('searchEngineInput');
      input.style.display = 'block';
      input.enabled = 'true';
      document.getElementById('customSearchEngine').value = localStorage.getItem('customSearchEngine');
    } else localStorage.removeItem('customSearchEngine');

    document.getElementById('searchEngine').value = localStorage.getItem('searchEngine');
  }

  render() {
    return (
        <div>
          <ul>
            <label htmlFor='searchEngine'>{this.props.language.searchbar.searchengine} </label>
              <select className='select-css' name='searchEngine' id='searchEngine' onChange={() => SettingsFunctions.setSearchEngine(document.getElementById('searchEngine').value)}>
                {searchEngines.map((engine) =>
                  <option className='choices' value={engine.settingsName}>{engine.name}</option>
                )}
                <option className='choices' value='custom'>Custom</option>
              </select>
            </ul>
            <ul id='searchEngineInput' style={{ display: 'none' }}>
              <p style={{"marginTop": "0px"}}>Custom Search URL <span className='modalLink' onClick={() => this.props.resetItem('customSearchEngine')}>{this.props.language.reset}</span></p>
              <input type='text' id='customSearchEngine'></input>
            </ul>
        </div>
    );
  }
}