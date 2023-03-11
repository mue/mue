import variables from 'modules/variables';

import { useState, memo } from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';

import SettingsItem from '../SettingsItem';
import Header from '../Header';

function Navbar() {
  const [showRefreshOptions, setShowRefreshOptions] = useState(
    localStorage.getItem('refresh') === 'true',
  );

  return (
    <>
      <Header
        title={variables.getMessage('modals.main.settings.sections.appearance.navbar.title')}
        setting="navbar"
        category="widgets"
        zoomSetting="zoomNavbar"
        zoomCategory="navbar"
      />
      <SettingsItem
        title={variables.getMessage('modals.main.settings.additional_settings')}
        subtitle={variables.getMessage(
          'modals.main.settings.sections.appearance.navbar.additional',
        )}
        final={!showRefreshOptions}
      >
        <Checkbox
          name="navbarHover"
          text={variables.getMessage('modals.main.settings.sections.appearance.navbar.hover')}
          category="navbar"
        />
        <Checkbox
          name="notesEnabled"
          text={variables.getMessage('modals.main.settings.sections.appearance.navbar.notes')}
          category="navbar"
        />
        <Checkbox
          name="view"
          text={variables.getMessage('modals.main.settings.sections.background.buttons.view')}
          category="navbar"
        />
        <Checkbox
          name="refresh"
          text={variables.getMessage('modals.main.settings.sections.appearance.navbar.refresh')}
          category="navbar"
          onChange={setShowRefreshOptions}
        />
        <Checkbox
          name="todoEnabled"
          text={variables.getMessage('widgets.navbar.todo.title')}
          category="navbar"
        />
      </SettingsItem>
      {showRefreshOptions ? (
        <SettingsItem
          title={variables.getMessage('modals.main.settings.sections.appearance.navbar.refresh')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.appearance.navbar.refresh_subtitle',
          )}
          final={true}
        >
          <Dropdown name="refreshOption" category="navbar">
            <option value="page">
              {variables.getMessage(
                'modals.main.settings.sections.appearance.navbar.refresh_options.page',
              )}
            </option>
            <option value="background">
              {variables.getMessage('modals.main.settings.sections.background.title')}
            </option>
            <option value="quote">
              {variables.getMessage('modals.main.settings.sections.quote.title')}
            </option>
            <option value="quotebackground">
              {variables.getMessage('modals.main.settings.sections.quote.title')} +{' '}
              {variables.getMessage('modals.main.settings.sections.background.title')}
            </option>
          </Dropdown>
        </SettingsItem>
      ) : null}
    </>
  );
}

export default memo(Navbar);
