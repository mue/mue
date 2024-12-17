import variables from 'config/variables';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';

import { Header, Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { Hero, Preview, Controls } from 'components/Layout/Settings/Hero';
import { Dropdown, Checkbox } from 'components/Form/Settings';

import EventBus from 'utils/eventbus';

import searchEngines from '../search_engines.json';
import defaults from './default';
import SearchPreview from './SearchPreview';

function SearchOptions() {
  const [customEnabled, setCustomEnabled] = useState(false);
  const [customValue, setCustomValue] = useState(
    localStorage.getItem('customSearchEngine') || defaults.customSearchEngine,
  );

  function resetSearch() {
    localStorage.removeItem('customSearchEngine');
    setCustomValue('');

    toast(variables.getMessage('toasts.reset'));
  }

  useEffect(() => {
    if (localStorage.getItem('searchEngine') === 'custom') {
      setCustomEnabled(true);
    } else {
      localStorage.removeItem('customSearchEngine');
    }
  }, []);

  useEffect(() => {
    if (customEnabled === true && customValue !== '') {
      localStorage.setItem('customSearchEngine', customValue);
    }

    EventBus.emit('refresh', 'search');
  }, [customEnabled, customValue]);

  function setSearchEngine(input) {
    if (input === 'custom') {
      setCustomEnabled(true);
    } else {
      setCustomEnabled(false);
      localStorage.setItem('searchEngine', input);
    }

    EventBus.emit('refresh', 'search');
  }

  const SEARCH_SECTION = 'settings:sections.search';

  const AdditionalOptions = () => {
    return (
      <Row>
        <Content
          title={variables.getMessage('settings:additional_settings')}
          subtitle={variables.getMessage(`${SEARCH_SECTION}.additional`)}
        />
        <Action>
          {/* not supported on firefox */}
          {navigator.userAgent.includes('Chrome') && typeof InstallTrigger === 'undefined' ? (
            <Checkbox
              name="voiceSearch"
              text={variables.getMessage(`${SEARCH_SECTION}.voice_search`)}
              category="search"
            />
          ) : null}
          <Checkbox
            name="searchDropdown"
            text={variables.getMessage(`${SEARCH_SECTION}.dropdown`)}
            category="search"
            element=".other"
          />
          <Checkbox
            name="searchFocus"
            text={variables.getMessage(`${SEARCH_SECTION}.focus`)}
            category="search"
            element=".other"
          />
          <Checkbox
            name="autocomplete"
            text={variables.getMessage(`${SEARCH_SECTION}.autocomplete`)}
            category="search"
          />
        </Action>
      </Row>
    );
  };

  const SearchEngineSelection = () => {
    return (
      <Row final={!customEnabled}>
        <Content
          title={variables.getMessage(`${SEARCH_SECTION}.search_engine`)}
          subtitle={variables.getMessage('settings:sections.search.search_engine_subtitle')}
        />
        <Action>
          <Dropdown
            name="searchEngine"
            onChange={(value) => setSearchEngine(value)}
            items={[
              ...searchEngines.map((engine) => ({
                value: engine.settingsName,
                text: engine.name,
              })),
              {
                value: 'custom',
                text: variables.getMessage(`${SEARCH_SECTION}.custom`),
              },
            ]}
          />
        </Action>
      </Row>
    );
  };

  const CustomOptions = () => {
    return (
      <Row final={true}>
        <Content title={variables.getMessage(`${SEARCH_SECTION}.custom`)} />
        <Action>
          <TextField
            label={variables.getMessage(`${SEARCH_SECTION}.custom`)}
            value={customValue}
            onInput={(e) => setCustomValue(e.target.value)}
            varient="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <p style={{ marginTop: '0px' }}>
            <span className="link" onClick={() => resetSearch()}>
              {variables.getMessage('settings:buttons.reset')}
            </span>
          </p>
        </Action>
      </Row>
    );
  };

  return (
    <>
      <Header
        title={variables.getMessage(`${SEARCH_SECTION}.title`)}
        setting="searchBar"
        category="widgets"
        visibilityToggle={true}
      />
      <Hero>
        <Preview>
          <SearchPreview />
        </Preview>
        <Controls
          title={variables.getMessage(`${SEARCH_SECTION}.title`)}
          setting="searchBar"
          category="widgets"
          visibilityToggle={true}
        />
      </Hero>
      <PreferencesWrapper setting="searchBar" category="widgets" visibilityToggle={true}>
        <SearchEngineSelection />
        <AdditionalOptions />
        {customEnabled && CustomOptions()}
      </PreferencesWrapper>
    </>
  );
}

export { SearchOptions as default, SearchOptions };
