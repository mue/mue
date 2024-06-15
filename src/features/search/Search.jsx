import variables from 'config/variables';
import { memo, createRef, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { MdSearch, MdMic, MdScreenSearchDesktop } from 'react-icons/md';
import { BsGoogle } from 'react-icons/bs';
import { SiDuckduckgo, SiMicrosoftbing, SiBaidu, SiNaver } from 'react-icons/si';
import { FaYandex, FaYahoo } from 'react-icons/fa';
import { Tooltip } from 'components/Elements';
import { Autocomplete as AutocompleteInput } from './components/autocomplete';

import EventBus from 'utils/eventbus';

import './search.scss';

import defaults from './options/default';
import searchEngines from './search_engines.json';

function Search() {
  const [url, setURL] = useState('');
  const [query, setQuery] = useState('');
  const [microphone, setMicrophone] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [classList] = useState(
    localStorage.getItem('widgetStyle') === 'legacy' ? 'searchIcons old' : 'searchIcons',
  );
  const [currentSearch, setCurrentSearch] = useState('');

  useEffect(() => {
    EventBus.on('refresh', (data) => {
      if (data === 'search') {
        init();
      }
    });
    init();
    if (localStorage.getItem('searchFocus') === 'true') {
      const element = document.getElementById('searchtext');
      if (element) {
        element.focus();
      }
    }
    return () => {
      EventBus.off('refresh');
    };
  }, []);

  let micIcon = createRef();

  const customText = variables
    .getMessage('modals.main.settings.sections.search.custom')
    .split(' ')[0];

  function init() {
    let _url;
    let _query = 'q';

    const setting = localStorage.getItem('searchEngine') || defaults.searchEngine;
    const info = searchEngines.find((i) => i.settingsName === setting);

    if (info !== undefined) {
      _url = info.url;
      if (info.query) {
        _query = info.query;
      }
    }

    if (setting === 'custom') {
      const custom = localStorage.getItem('customSearchEngine') || defaults.customSearchEngine;
      if (custom !== null) {
        _url = custom;
      }
    }

    if (localStorage.getItem('voiceSearch') === 'true') {
      setMicrophone(
        <button
          className="navbarButton"
          onClick={startSpeechRecognition}
          ref={micIcon}
          aria-label="Microphone Search"
        >
          <MdMic className="micIcon" />
        </button>,
      );
    }

    setURL(_url);
    setQuery(_query);
    setCurrentSearch(info ? info.name : 'Custom');
  }

  function startSpeechRecognition() {
    const voiceSearch = new window.webkitSpeechRecognition();
    voiceSearch.start();

    micIcon.current.classList.add('micActive');

    const searchText = document.getElementById('searchtext');

    voiceSearch.onresult = (event) => {
      searchText.value = event.results[0][0].transcript;
    };

    voiceSearch.onend = () => {
      micIcon.current.classList.remove('micActive');
      if (searchText.value === '') {
        return;
      }

      setTimeout(() => {
        variables.stats.postEvent('feature', 'Voice search');
        window.location.href = url + `?${query}=` + searchText.value;
      }, 1000);
    };
  }

  function searchButton(e) {
    e.preventDefault();
    const value = e.target.value || document.getElementById('searchtext').value || 'mue fast';
    variables.stats.postEvent('feature', 'Search');
    window.location.href = url + `?${query}=` + value;
  }

  async function getSuggestions(input) {
    if (input === '') {
      setSuggestions([]);
      return;
    }

    const results = await (
      await fetch(`${variables.constants.API_URL}/search/autocomplete?q=${input}`)
    ).json();

    try {
      setSuggestions(results.suggestions.splice(0, 5));
    } catch (e) {
      console.error(e);
      // ignore error if empty
    }
  }

  const getSuggestionsDebounced = useDebouncedCallback(getSuggestions, 100);

  /**
   * If the user selects a search engine from the dropdown menu, the function will set the state of the
   * search engine to the selected search engine.
   * @param {string} name - The name of the search engine
   * @param {boolean} custom - If the search engine is custom
   */
  function setSearch(name, custom) {
    let _url;
    let _query = 'q';
    const info = searchEngines.find((i) => i.name === name);

    if (info !== undefined) {
      _url = info.url;
      if (info.query) {
        _query = info.query;
      }
    }

    if (custom) {
      const customSetting = localStorage.getItem('customSearchEngine');
      if (customSetting !== null) {
        _url = customSetting;
      } else {
        _url = url;
      }
    } else {
      localStorage.setItem('searchEngine', info.settingsName);
    }

    setURL(_url);
    setQuery(_query);
    setCurrentSearch(name);
    setSearchDropdown(false);
  }

  /**
   * Gets the icon for the search engine dropdown.
   * @param {string} name - The name of the search engine.
   * @returns A React component.
   */
  function getSearchDropdownicon(name) {
    switch (name) {
      case 'Google':
        return <BsGoogle />;
      case 'DuckDuckGo':
        return <SiDuckduckgo />;
      case 'Bing':
        return <SiMicrosoftbing />;
      case 'Yahoo':
      case 'Yahoo! JAPAN':
        return <FaYahoo />;
      case 'Яндекс':
        return <FaYandex />;
      case '百度':
        return <SiBaidu />;
      case 'NAVER':
        return <SiNaver />;
      default:
        return <MdScreenSearchDesktop />;
    }
  }

  return (
    <div className="searchComponents">
      <div className="searchMain">
        <div className={classList}>
          {localStorage.getItem('searchDropdown') === 'true' ? (
            <Tooltip
              title={variables.getMessage('modals.main.settings.sections.search.search_engine')}
            >
              <button
                className="navbarButton"
                aria-label="Search Engine"
                onClick={() => setSearchDropdown(!searchDropdown)}
              >
                {getSearchDropdownicon(currentSearch)}
              </button>
            </Tooltip>
          ) : (
            ''
          )}
          <Tooltip
            title={variables.getMessage('modals.main.settings.sections.search.voice_search')}
          >
            {microphone}
          </Tooltip>
        </div>
        <form onSubmit={searchButton} className="searchBar">
          <div className={classList}>
            <Tooltip title={variables.getMessage('widgets.search')}>
              <button className="navbarButton" onClick={searchButton} aria-label="Search">
                <MdSearch />
              </button>
            </Tooltip>
          </div>
          <AutocompleteInput
            placeholder={variables.getMessage('widgets.search')}
            id="searchtext"
            suggestions={suggestions}
            onChange={(e) => getSuggestionsDebounced(e)}
            onClick={searchButton}
          />
        </form>
      </div>
      <div>
        {localStorage.getItem('searchDropdown') === 'true' && searchDropdown === true && (
          <div className="searchDropdown">
            {searchEngines.map(({ name }, key) => {
              return (
                <span
                  className={
                    'searchDropdownList' +
                    (currentSearch === name ? ' searchDropdownListActive' : '')
                  }
                  onClick={() => setSearch(name)}
                  key={key}
                >
                  {name}
                </span>
              );
            })}
            <span
              className={
                'searchDropdownList' +
                (currentSearch === customText ? ' searchDropdownListActive' : '')
              }
              onClick={() => setSearch(customText, 'custom')}
            >
              {customText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const MemoizedSearch = memo(Search);
export { MemoizedSearch as default, MemoizedSearch as Search };
