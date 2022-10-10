import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import { MdSearch, MdMic, MdScreenSearchDesktop } from 'react-icons/md';
import Tooltip from 'components/helpers/tooltip/Tooltip';

import AutocompleteInput from 'components/helpers/autocomplete/Autocomplete';

import EventBus from 'modules/helpers/eventbus';

import './search.scss';

import searchEngines from 'components/widgets/search/search_engines.json';
import autocompleteProviders from 'components/widgets/search/autocomplete_providers.json';

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
      searchDropdown: true,
      classList:
        localStorage.getItem('widgetStyle') === 'legacy' ? 'searchIcons old' : 'searchIcons',
    };
    this.micIcon = createRef();
  }

  startSpeechRecognition = () => {
    const voiceSearch = new window.webkitSpeechRecognition();
    voiceSearch.start();

    this.micIcon.current.classList.add('micActive');

    const searchText = document.getElementById('searchtext');

    voiceSearch.onresult = (event) => {
      searchText.value = event.results[0][0].transcript;
    };

    voiceSearch.onend = () => {
      this.micIcon.current.classList.remove('micActive');
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
        <button onClick={this.startSpeechRecognition} ref={this.micIcon}>
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
    this.setState({
      searchDropdown: (this.state.searchDropdown === 'hidden') ? 'visible' : 'hidden',
    });
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
    const customText = variables
      .getMessage('modals.main.settings.sections.search.custom')
      .split(' ')[0];

    return (
      <div className="searchComponents">
        <div className="searchMain">
          <div className={this.state.classList}>
            {localStorage.getItem('searchDropdown') === 'true' ? (
              <Tooltip title={variables.getMessage('widgets.search')}>
                <button>
                  <MdScreenSearchDesktop onClick={() => this.setState({ searchDropdown: !this.state.searchDropdown })} />
                </button>
              </Tooltip>
            ) : (
              ''
            )}
            <Tooltip title={variables.getMessage('widgets.search')}>
              {this.state.microphone}
            </Tooltip>
          </div>
          <form onSubmit={this.searchButton} className="searchBar">
            <div className={this.state.classList}>
              <Tooltip title={variables.getMessage('widgets.search')}>
                <button onClick={this.searchButton}>
                  <MdSearch />
                </button>
              </Tooltip>
            </div>
            <AutocompleteInput
              placeholder={variables.getMessage('widgets.search')}
              id="searchtext"
              suggestions={this.state.suggestions}
              onChange={(e) => this.getSuggestions(e)}
              onClick={this.searchButton}
            />
          </form>
        </div>
        <div>
          {localStorage.getItem('searchDropdown') === 'true' && this.state.searchDropdown === true ? (
            <div className="searchDropdown">
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
