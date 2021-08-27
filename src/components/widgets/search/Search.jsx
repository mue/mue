import { PureComponent, Fragment } from 'react';
import { Search as SearchIcon, Mic } from '@material-ui/icons';
import Hotkeys from 'react-hot-keys';

import AutocompleteInput from '../../helpers/autocomplete/Autocomplete';

import EventBus from '../../../modules/helpers/eventbus';

import './search.scss';

const searchEngines = require('./search_engines.json');
const autocompleteProviders = require('./autocomplete_providers.json');

export default class Search extends PureComponent {
  constructor() {
    super();
    this.state = {
      url: '',
      query: '',
      autocompleteURL: '',
      autocompleteQuery: '',
      autocompleteCallback: '',
      microphone: null,
      suggestions: [],
      searchDropdown: 'none'
    };
    this.language = window.language.widgets.search;
  }

  startSpeechRecognition = () => {
    const voiceSearch = new window.webkitSpeechRecognition();
    voiceSearch.start();

    const searchText = document.getElementById('searchtext');

    voiceSearch.onresult = (event) => {
      searchText.value = event.results[0][0].transcript;
    };

    voiceSearch.onend = () => {
      if (searchText.value === '') {
        return;
      }

      setTimeout(() => {
        window.stats.postEvent('feature', 'Voice search');
        window.location.href = this.state.url + `?${this.state.query}=` + searchText.value;
      }, 1000);
    };
  }

  searchButton = (e) => {
    e.preventDefault();
    const value = e.target.value || document.getElementById('searchtext').value || 'mue fast';
    window.stats.postEvent('feature', 'Search');
    window.location.href = this.state.url + `?${this.state.query}=` + value;
  }

  async getSuggestions(input) {
    window.setResults = (results) => { 
      window.searchResults = results;
    };

    const script = document.createElement('script');
    script.src = `${this.state.autocompleteURL + this.state.autocompleteQuery + input}&${this.state.autocompleteCallback}=window.setResults`;
    document.head.appendChild(script);

    try {
      this.setState({
        suggestions: window.searchResults[1].splice(0, 3)
      });
    } catch (e) {
      // ignore error if empty
    }

    document.head.removeChild(script);
  }

  init() {
    let url, microphone;
    let query = 'q';

    const setting = localStorage.getItem('searchEngine');
    const info = searchEngines.find((i) => i.settingsName === setting);

    if (info !== undefined) {
      url = info.url;
      if (info.query) {
        query = info.query;
      }
    }

    if (setting === 'custom') {
      url = localStorage.getItem('customSearchEngine');
    }

    if (localStorage.getItem('voiceSearch') === 'true') {
      microphone = <Mic className='micIcon' onClick={this.startSpeechRecognition}/>;
    }

    let autocompleteURL, autocompleteQuery, autocompleteCallback;

    if (localStorage.getItem('autocomplete') === 'true') {
      const info = autocompleteProviders.find((i) => i.value === localStorage.getItem('autocompleteProvider'));
      autocompleteURL = info.url;
      autocompleteQuery = info.query;
      autocompleteCallback = info.callback;
    }

    this.setState({
      url: url,
      query: query,
      autocompleteURL: autocompleteURL,
      autocompleteQuery: autocompleteQuery,
      autocompleteCallback: autocompleteCallback,
      microphone: microphone,
      currentSearch: info.name
    });
  }

  toggleDropdown() {
    if (this.state.searchDropdown === 'none') {
      this.setState({
        searchDropdown: 'block'
      });
    } else {
      this.setState({
        searchDropdown: 'none'
      });
    }
  }

  setSearch(name, custom) {
    let url;
    let query = 'q';
    const info = searchEngines.find((i) => i.name === name);

    if (info !== undefined) {
      url = info.url;
      if (info.query) {
        query = info.query;
      }
    }

    if (custom) {
      url = localStorage.getItem('customSearchEngine');
    }

    this.setState({
      url: url,
      query: query,
      currentSearch: name,
      searchDropdown: 'none'
    });
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'search') {
        this.init();
      }
    });
  
    this.init();
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    const customText = window.language.modals.main.settings.sections.search.custom.split(' ')[0];

    return (
      <form onSubmit={this.searchButton} className='searchBar'>
        {localStorage.getItem('searchDropdown') === 'true' ? 
        <div className='searchDropdown'>
          <span className='searchSelected' onClick={() => this.toggleDropdown()}>{this.state.currentSearch}</span>
          <div style={{ display: this.state.searchDropdown }}>
            {searchEngines.map((engine) => {
              if (engine.name === this.state.currentSearch) {
                return null;
              }

              return (
                <Fragment key={engine.name}>
                  <span className='searchDropdownList' onClick={() => this.setSearch(engine.name)}>{engine.name}</span>
                  <br/>
                </Fragment>
              );
            })}
            {this.state.currentSearch !== customText ? <span className='searchDropdownList' onClick={() => this.setSearch(customText, 'custom')}>{customText}</span> : null}
          </div>
        </div> : null}
        {this.state.microphone}
        <SearchIcon onClick={this.searchButton}/>
        <AutocompleteInput placeholder={this.language} id='searchtext' suggestions={this.state.suggestions} onChange={(e) => this.getSuggestions(e)} onClick={this.searchButton}/>
        {window.keybinds.focusSearch && window.keybinds.focusSearch !== '' ? <Hotkeys keyName={window.keybinds.focusSearch} onKeyDown={() => document.getElementById('searchtext').focus()}/> : null}
      </form>
    );
  }
}
