import variables from 'modules/variables';
import { PureComponent, Fragment } from 'react';
import { MdSearch, MdMic, MdSettings } from 'react-icons/md';
import Tooltip from 'components/helpers/tooltip/Tooltip';
//import Hotkeys from 'react-hot-keys';

import AutocompleteInput from 'components/helpers/autocomplete/Autocomplete';

import EventBus from 'modules/helpers/eventbus';

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
      searchDropdown: 'hidden',
      classList:
        localStorage.getItem('widgetStyle') === 'legacy' ? 'searchIcons old' : 'searchIcons',
    };
  }

  startSpeechRecognition = () => {
    const voiceSearch = new window.webkitSpeechRecognition();
    voiceSearch.start();

    // todo: use ref, stop being lazy
    const micIcon = document.getElementById('micBtn');
    micIcon.classList.add('micActive');

    const searchText = document.getElementById('searchtext');

    voiceSearch.onresult = (event) => {
      searchText.value = event.results[0][0].transcript;
    };

    voiceSearch.onend = () => {
      micIcon.classList.remove('micActive');
      if (searchText.value === '') {
        return;
      }

      setTimeout(() => {
        variables.stats.postEvent('feature', 'Voice search');
        window.location.href = this.state.url + `?${this.state.query}=` + searchText.value;
      }, 1000);
    };
  };

  searchButton = (e) => {
    e.preventDefault();
    const value = e.target.value || document.getElementById('searchtext').value || 'mue fast';
    variables.stats.postEvent('feature', 'Search');
    window.location.href = this.state.url + `?${this.state.query}=` + value;
  };

  async getSuggestions(input) {
    window.setResults = (results) => {
      window.searchResults = results;
    };

    const script = document.createElement('script');
    script.src = `${this.state.autocompleteURL + this.state.autocompleteQuery + input}&${
      this.state.autocompleteCallback
    }=window.setResults`;
    document.head.appendChild(script);

    try {
      this.setState({
        suggestions: window.searchResults[1].splice(0, 3),
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
      microphone = (
        <button onClick={this.startSpeechRecognition} id='micBtn'>
          <MdMic className="micIcon" />
        </button>
      );
    }

    let autocompleteURL, autocompleteQuery, autocompleteCallback;

    if (localStorage.getItem('autocomplete') === 'true') {
      const info = autocompleteProviders.find(
        (i) => i.value === localStorage.getItem('autocompleteProvider'),
      );
      autocompleteURL = info.url;
      autocompleteQuery = info.query;
      autocompleteCallback = info.callback;
    }

    this.setState({
      url,
      query,
      autocompleteURL,
      autocompleteQuery,
      autocompleteCallback,
      microphone,
      currentSearch: info ? info.name : 'Custom',
    });
  }

  toggleDropdown() {
    if (this.state.searchDropdown === 'hidden') {
      this.setState({
        searchDropdown: 'visible',
      });
    } else {
      this.setState({
        searchDropdown: 'hidden',
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
      url,
      query,
      currentSearch: name,
      searchDropdown: 'hidden',
    });
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'search') {
        this.init();
      }
    });

    this.init();

    if (localStorage.getItem('searchFocus') === 'true') {
      const element = document.getElementById('searchtext');
      if (element) {
        element.focus();
      }
    }
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    const customText = variables.language
      .getMessage(variables.languagecode, 'modals.main.settings.sections.search.custom')
      .split(' ')[0];

    return (
      <div className="searchComponents">
        <div className="searchMain">
          <div className={this.state.classList}>
            {localStorage.getItem('searchDropdown') === 'true' ? (
              <Tooltip
                title={variables.language.getMessage(variables.languagecode, 'widgets.search')}
              >
                <button>
                  <MdSettings onClick={() => this.toggleDropdown()} />
                </button>
              </Tooltip>
            ) : (
              ''
            )}
            <Tooltip
              title={variables.language.getMessage(variables.languagecode, 'widgets.search')}
            >
              {this.state.microphone}
            </Tooltip>
          </div>
          <form onSubmit={this.searchButton} className="searchBar">
            <div className={this.state.classList}>
              <Tooltip
                title={variables.language.getMessage(variables.languagecode, 'widgets.search')}
              >
                <button onClick={this.searchButton}>
                  <MdSearch />
                </button>
              </Tooltip>
            </div>
            <AutocompleteInput
              placeholder={variables.language.getMessage(variables.languagecode, 'widgets.search')}
              id="searchtext"
              suggestions={this.state.suggestions}
              onChange={(e) => this.getSuggestions(e)}
              onClick={this.searchButton}
            />
            {/*variables.keybinds.focusSearch && variables.keybinds.focusSearch !== '' ? <Hotkeys keyName={variables.keybinds.focusSearch} onKeyDown={() => document.getElementById('searchtext').focus()}/> : null*/}
          </form>
        </div>
        <div>
          {localStorage.getItem('searchDropdown') === 'true' ? (
            <div className="searchDropdown" style={{ visibility: this.state.searchDropdown }}>
              {searchEngines.map(({ name }) => {
                if (name === this.state.currentSearch) {
                  return null;
                }

                return (
                  <span className="searchDropdownList" onClick={() => this.setSearch(name)}>
                    {name}
                  </span>
                );
              })}
              {this.state.currentSearch !== customText ? (
                <span
                  className="searchDropdownList"
                  onClick={() => this.setSearch(customText, 'custom')}
                >
                  {customText}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
