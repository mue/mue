/* global chrome */
import variables from 'config/variables';
import { memo, createRef, useEffect, useState, useCallback } from 'react';
import { MdSearch, MdMic } from 'react-icons/md';
import { Tooltip } from 'components/Elements';

import './search.scss';

function Search() {
  const [microphone, setMicrophone] = useState(null);
  const [classList] = useState(
    localStorage.getItem('widgetStyle') === 'legacy' ? 'searchIcons old' : 'searchIcons',
  );

  const micIcon = createRef();

  const startSpeechRecognition = useCallback(() => {
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
        // Use Chrome Search API - respects user's default search engine
        if (chrome && chrome.search && chrome.search.query) {
          chrome.search.query({
            text: searchText.value,
            disposition: 'CURRENT_TAB',
          }).catch((error) => {
            console.error('Search API error:', error);
            // Fallback to Google search if API fails
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchText.value)}`;
          });
        } else {
          // Fallback for browsers without chrome.search API
          window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchText.value)}`;
        }
      }, 1000);
    };
  }, [micIcon]);

  const init = useCallback(() => {
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
  }, [micIcon, startSpeechRecognition]);

  useEffect(() => {
    init();
    if (localStorage.getItem('searchFocus') === 'true') {
      const element = document.getElementById('searchtext');
      if (element) {
        element.focus();
      }
    }
  }, [init]);

  function searchButton(e) {
    e.preventDefault();
    const value = e.target.value || document.getElementById('searchtext').value || 'mue fast';
    variables.stats.postEvent('feature', 'Search');

    // Use Chrome Search API - respects user's default search engine
    if (chrome && chrome.search && chrome.search.query) {
      chrome.search.query({
        text: value,
        disposition: 'CURRENT_TAB',
      }).catch((error) => {
        console.error('Search API error:', error);
        // Fallback to Google search if API fails
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
      });
    } else {
      // Fallback for browsers without chrome.search API
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    }
  }

  return (
    <div className="searchComponents">
      <div className="searchMain">
        <div className={classList}>
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
          <input
            type="text"
            placeholder={variables.getMessage('widgets.search')}
            id="searchtext"
            className="searchInput"
          />
        </form>
      </div>
    </div>
  );
}

const MemoizedSearch = memo(Search);
export { MemoizedSearch as default, MemoizedSearch as Search };
