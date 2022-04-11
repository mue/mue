import variables from 'modules/variables';
import { PureComponent } from 'react';
import { toast } from 'react-toastify';
import { MenuItem, TextField } from '@mui/material';

import Header from '../Header';
import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';
import Radio from '../Radio';
import SettingsItem from '../SettingsItem';

import EventBus from 'modules/helpers/eventbus';

const searchEngines = require('components/widgets/search/search_engines.json');
const autocompleteProviders = require('components/widgets/search/autocomplete_providers.json');

export default class SearchSettings extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

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

    toast(this.getMessage('toasts.reset'));
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

    EventBus.dispatch('refresh', 'search');
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

    EventBus.dispatch('refresh', 'search');
  }

  render() {
    return (
      <>
        <Header
          title={this.getMessage('modals.main.settings.sections.search.title')}
          setting="searchBar"
          category="widgets"
          switch={true}
        />
        <SettingsItem title="Extra Options" subtitle="eeeee">
          {/* not supported on firefox */}
          {navigator.userAgent.includes('Chrome') && typeof InstallTrigger === 'undefined' ? (
            <Checkbox
              name="voiceSearch"
              text={this.getMessage('modals.main.settings.sections.search.voice_search')}
              category="search"
            />
          ) : null}
          <Checkbox
            name="searchDropdown"
            text={this.getMessage('modals.main.settings.sections.search.dropdown')}
            category="search"
            element=".other"
          />
          <Checkbox
            name="searchFocus"
            text={this.getMessage('modals.main.settings.sections.search.focus')}
            category="search"
            element=".other"
          />
          <ul style={{ display: this.state.customDisplay }}>
            <p style={{ marginTop: '0px' }}>
              <span className="link" onClick={() => this.resetSearch()}>
                {this.getMessage('modals.main.settings.buttons.reset')}
              </span>
            </p>
            <TextField
              label={this.getMessage('modals.main.settings.sections.search.custom')}
              value={this.state.customValue}
              onInput={(e) => this.setState({ customValue: e.target.value })}
              varient="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </ul>
          <Checkbox
            name="autocomplete"
            text={this.getMessage('modals.main.settings.sections.search.autocomplete')}
            category="search"
          />
        </SettingsItem>
        <SettingsItem
          title={this.getMessage('modals.main.settings.sections.search.search_engine')}
          subtitle="cheese is gucci tbf"
        >
          <Dropdown
            label={this.getMessage('modals.main.settings.sections.search.search_engine')}
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
              {this.getMessage('modals.main.settings.sections.search.custom').split(' ')[0]}
            </MenuItem>
          </Dropdown>
        </SettingsItem>
        <SettingsItem
          title={this.getMessage('modals.main.settings.sections.search.autocomplete_provider')}
          subtitle="cheese"
        >
          <Radio options={autocompleteProviders} name="autocompleteProvider" category="search" />
        </SettingsItem>
      </>
    );
  }
}
