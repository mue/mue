import variables from 'modules/variables';
import { PureComponent } from 'react';
import { toast } from 'react-toastify';
import { MenuItem, TextField } from '@mui/material';

import Header from '../Header';
import Dropdown from '../Dropdown';
import Checkbox from '../Checkbox';

import { Row, Content, Action } from '../SettingsItem';

import EventBus from 'modules/helpers/eventbus';

import searchEngines from 'components/widgets/search/search_engines.json';
import PreferencesWrapper from '../PreferencesWrapper';

export default class SearchSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      customEnabled: false,
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
        customEnabled: true,
      });
    } else {
      this.setState({
        customEnabled: false,
      });
      localStorage.setItem('searchEngine', input);
    }

    EventBus.emit('refresh', 'search');
  }

  render() {
    const SEARCH_SECTION = 'modals.main.settings.sections.search';

    const AdditionalOptions = () => {
      return (
        <Row>
          <Content
            title={variables.getMessage('modals.main.settings.additional_settings')}
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
        <Row final={!this.state.customEnabled}>
          <Content
            title={variables.getMessage(`${SEARCH_SECTION}.search_engine`)}
            subtitle={variables.getMessage(
              'modals.main.settings.sections.search.search_engine_subtitle',
            )}
          />
          <Action>
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
        <PreferencesWrapper setting="searchBar" category="widgets" visibilityToggle={true}>
          <AdditionalOptions />
          <SearchEngineSelection />
          {this.state.customEnabled && (
            <Row final={true}>
              <Content title={variables.getMessage(`${SEARCH_SECTION}.custom`)} />
              <Action>
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
              </Action>
            </Row>
          )}
        </PreferencesWrapper>
      </>
    );
  }
}
