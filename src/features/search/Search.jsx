import variables from 'config/variables';

import { memo, createRef, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { MdSearch, MdMic } from 'react-icons/md';

import { Tooltip } from 'components/Elements';
import { Autocomplete as AutocompleteInput } from './components/autocomplete';
import Icon from './components/dropdown/Icon';
import Dropdown from './components/dropdown/Dropdown';

import EventBus from 'utils/eventbus';

import './search.scss';

import defaults from './options/default';
import searchEngines from './search_engines.json';

function Search() {
  const [url, setURL] = useState('');
  const [query, setQuery] = useState('');
  const [microphone, setMicrophone] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [currentSearch, setCurrentSearch] = useState('');
  const [searchDropdown, setSearchDropdown] = useState(false);

  const [classList] = useState(
    localStorage.getItem('widgetStyle') === 'legacy' ? 'searchIcons old' : 'searchIcons',
  );

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

  return (
    <div className="searchComponents">
      <div className="searchMain">
        <div className={classList}>
          <Icon currentSearch={currentSearch} setSearchDropdown={setSearchDropdown} />
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
        <Dropdown
          url={url}
          setURL={setURL}
          setQuery={setQuery}
          setCurrentSearch={setCurrentSearch}
          currentSearch={currentSearch}
          searchDropdown={searchDropdown}
          setSearchDropdown={setSearchDropdown}
          searchEngines={searchEngines}
        />
      </div>
    </div>
  );
}

const MemoizedSearch = memo(Search);
export { MemoizedSearch as default, MemoizedSearch as Search };
