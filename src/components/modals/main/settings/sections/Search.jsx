import variables from 'modules/variables';
import { PureComponent } from 'react';
import { toast } from 'react-toastify';
import { MenuItem, TextField } from '@mui/material';

import Header from '../Header';
import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';
import SettingsItem from '../SettingsItem';

import EventBus from 'modules/helpers/eventbus';

import searchEngines from 'components/widgets/search/search_engines.json';

export default class SearchSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      customEnabled: false,
      customDisplay: 'none',
      customValue: localStorage.getItem('customSearchEngine') || '',
    };
  }

  resetSearch() {
    localStorage.removeItem('customSearchEngine');
    this.setState({
      customValue: '',
    });

    toast(variables.getMessage('toasts.reset'));
  }

  componentDidMount() {
    if (localStorage.getItem('searchEngine') === 'custom') {
      this.setState({
        customDisplay: 'block',
        customEnabled: true,
      });
    } else {
      localStorage.removeItem('customSearchEngine');
    }
  }

  componentDidUpdate() {
    if (this.state.customEnabled === true && this.state.customValue !== '') {
      localStorage.setItem('customSearchEngine', this.state.customValue);
    }

    EventBus.emit('refresh', 'search');
  }

  setSearchEngine(input) {
    if (input === 'custom') {
      this.setState({
        customDisplay: 'block',
        customEnabled: true,
      });
    } else {
      this.setState({
        customDisplay: 'none',
        customEnabled: false,
      });
      localStorage.setItem('searchEngine', input);
    }

    EventBus.emit('refresh', 'search');
  }

  render() {
    const SEARCH_SECTION = 'modals.main.settings.sections.search';

    return (
      <>
        <Header
          title={variables.getMessage(`${SEARCH_SECTION}.title`)}
          setting="searchBar"
          category="widgets"
          switch={true}
        />
        <SettingsItem
          title={variables.getMessage('modals.main.settings.additional_settings')}
          subtitle={variables.getMessage(`${SEARCH_SECTION}.additional`)}
        >
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
        </SettingsItem>
        <SettingsItem
          title={variables.getMessage(`${SEARCH_SECTION}.search_engine`)}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.search.search_engine_subtitle',
          )}
          final={this.state.customDisplay === 'none' ? true : false}
        >
          <Dropdown
            name="searchEngine"
            onChange={(value) => this.setSearchEngine(value)}
            manual={true}
          >
            {searchEngines.map((engine) => (
              <MenuItem key={engine.name} value={engine.settingsName}>
                {engine.name}
              </MenuItem>
            ))}
            <MenuItem value="custom">
              {variables.getMessage(`${SEARCH_SECTION}.custom`).split(' ')[0]}
            </MenuItem>
          </Dropdown>
        </SettingsItem>
        <div style={{ display: this.state.customDisplay }}>
          <SettingsItem title={variables.getMessage(`${SEARCH_SECTION}.custom`)} final={true}>
            <TextField
              label={variables.getMessage(`${SEARCH_SECTION}.custom`)}
              value={this.state.customValue}
              onInput={(e) => this.setState({ customValue: e.target.value })}
              varient="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <p style={{ marginTop: '0px' }}>
              <span className="link" onClick={() => this.resetSearch()}>
                {variables.getMessage('modals.main.settings.buttons.reset')}
              </span>
            </p>
          </SettingsItem>
        </div>
      </>
    );
  }
}
