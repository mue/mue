import { PureComponent } from 'react';

import EventBus from '../../../modules/helpers/eventbus';

import AutocompleteInput from '../../helpers/autocomplete/Autocomplete';

import SearchIcon from '@material-ui/icons/Search';
import MicIcon from '@material-ui/icons/Mic';

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
      suggestions: []
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
    let value;

    if (e.target.innerText !== undefined) {
      value = e.target.innerText;
    } else {
      value = document.getElementById('searchtext').value || 'mue fast';
    }

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
      microphone = <MicIcon className='micIcon' onClick={this.startSpeechRecognition}/>;
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
      microphone: microphone
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
    EventBus.remove('refresh');
  }

  render() {
    return (
      <form action={this.state.url} className='searchBar'>
        {this.state.microphone}
        <SearchIcon onClick={this.searchButton}/>
        <AutocompleteInput placeholder={this.language} id='searchtext' suggestions={this.state.suggestions} onChange={(e) => this.getSuggestions(e)} onClick={this.searchButton}/>
      </form>
    );
  }
}
