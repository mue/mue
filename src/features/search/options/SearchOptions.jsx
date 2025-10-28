import variables from 'config/variables';
import { PureComponent } from 'react';
import { MdOutlineWarning } from 'react-icons/md';

import { Header, Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { Checkbox } from 'components/Form/Settings';

import EventBus from 'utils/eventbus';

class SearchOptions extends PureComponent {

  render() {
    const SEARCH_SECTION = 'modals.main.settings.sections.search';

    const ChromePolicyWarning = () => {
      return (
        <div className="itemWarning" style={{ marginBottom: '20px' }}>
          <MdOutlineWarning />
          <div className="text">
            <span className="header">Search Engine Selection Removed</span>
            <span>{variables.getMessage(`${SEARCH_SECTION}.chrome_policy_warning`)}</span>
          </div>
        </div>
      );
    };

    const AdditionalOptions = () => {
      return (
        <Row final={true}>
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
              name="searchFocus"
              text={variables.getMessage(`${SEARCH_SECTION}.focus`)}
              category="search"
              element=".other"
            />
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
          <ChromePolicyWarning />
          <AdditionalOptions />
        </PreferencesWrapper>
      </>
    );
  }
}

export { SearchOptions as default, SearchOptions };
