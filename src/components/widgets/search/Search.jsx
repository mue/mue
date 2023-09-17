import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import { MdSearch, MdMic, MdScreenSearchDesktop } from 'react-icons/md';
import { BsGoogle } from 'react-icons/bs';
import { SiDuckduckgo, SiMicrosoftbing, SiYahoo, SiBaidu } from 'react-icons/si';
import { FaYandex } from 'react-icons/fa';
import Tooltip from 'components/helpers/tooltip/Tooltip';

import AutocompleteInput from 'components/helpers/autocomplete/Autocomplete';

import EventBus from 'modules/helpers/eventbus';

import './search.scss';

import searchEngines from 'components/widgets/search/search_engines.json';

export default class Search extends PureComponent {
  constructor() {
    super();
    this.state = {
      url: '',
      query: '',
      microphone: null,
      suggestions: [],
      searchDropdown: false,
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

    const results = await (await fetch(`https://ac.ecosia.org/?q=${input}`)).json();

    try {
      this.setState({
        suggestions: results.suggestions.splice(0, 3),
      });
    } catch (e) {
      // ignore error if empty
    }
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
      const custom = localStorage.getItem('customSearchEngine');
      if (custom !== null) {
        url = custom;
      }
    }

    if (localStorage.getItem('voiceSearch') === 'true') {
      microphone = (
        <button
          onClick={this.startSpeechRecognition}
          ref={this.micIcon}
          aria-label="Microphone Search"
        >
          <MdMic className="micIcon" />
        </button>
      );
    }

    this.setState({
      url,
      query,
      microphone,
      currentSearch: info ? info.name : 'Custom',
    });
  }

  /**
   * If the user selects a search engine from the dropdown menu, the function will set the state of the
   * search engine to the selected search engine.
   * @param {string} name - The name of the search engine
   * @param {boolean} custom - If the search engine is custom
   */
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
      const customSetting = localStorage.getItem('customSearchEngine');
      if (customSetting !== null) {
        url = customSetting;
      } else {
        url = this.state.url;
      }
    } else {
      localStorage.setItem('searchEngine', info.settingsName);
    }

    this.setState({
      url,
      query,
      currentSearch: name,
      searchDropdown: false,
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

  /**
   * Gets the icon for the search engine dropdown.
   * @param {string} name - The name of the search engine.
   * @returns A React component.
   */
  getSearchDropdownicon(name) {
    switch (name) {
      case 'Google':
        return <BsGoogle />;
      case 'DuckDuckGo':
        return <SiDuckduckgo />;
      case 'Bing':
        return <SiMicrosoftbing />;
      case 'Yahoo':
      case 'Yahoo! JAPAN':
        return <SiYahoo />;
      case 'Яндекс':
        return <FaYandex />;
      case '百度':
        return <SiBaidu />;
      default:
        return <MdScreenSearchDesktop />;
    }
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
              <Tooltip
                title={variables.getMessage('modals.main.settings.sections.search.search_engine')}
              >
                <button
                  aria-label="Search Engine"
                  onClick={() => this.setState({ searchDropdown: !this.state.searchDropdown })}
                >
                  {this.getSearchDropdownicon(this.state.currentSearch)}
                </button>
              </Tooltip>
            ) : (
              ''
            )}
            <Tooltip
              title={variables.getMessage('modals.main.settings.sections.search.voice_search')}
            >
              {this.state.microphone}
            </Tooltip>
          </div>
          <form onSubmit={this.searchButton} className="searchBar">
            <div className={this.state.classList}>
              <Tooltip title={variables.getMessage('widgets.search')}>
                <button onClick={this.searchButton} aria-label="Search">
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
          {localStorage.getItem('searchDropdown') === 'true' &&
          this.state.searchDropdown === true ? (
            <div className="searchDropdown">
              {searchEngines.map(({ name }, key) => {
                return (
                  <span
                    className={
                      'searchDropdownList' +
                      (this.state.currentSearch === name ? ' searchDropdownListActive' : '')
                    }
                    onClick={() => this.setSearch(name)}
                    key={key}
                  >
                    {name}
                  </span>
                );
              })}
              <span
                className={
                  'searchDropdownList' +
                  (this.state.currentSearch === customText ? ' searchDropdownListActive' : '')
                }
                onClick={() => this.setSearch(customText, 'custom')}
              >
                {customText}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
