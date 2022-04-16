import variables from 'modules/variables';

import { useState } from 'react';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';

import SettingsItem from '../SettingsItem';
import Header from '../Header';

export default function Navbar() {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);
  const [showRefreshOptions, setShowRefreshOptions] = useState(
    localStorage.getItem('refresh') === 'true',
  );

  return (
    <>
      <Header
        title={getMessage('modals.main.settings.sections.appearance.navbar.title')}
        setting="navbar"
        category="widgets"
        zoomSetting="zoomNavbar"
        zoomCategory="navbar"
      />
      <SettingsItem title="Extra Options" subtitle="subtitle" final={!showRefreshOptions}>
        <Checkbox
          name="navbarHover"
          text={getMessage('modals.main.settings.sections.appearance.navbar.hover')}
          category="navbar"
        />
        <Checkbox
          name="notesEnabled"
          text={getMessage('modals.main.settings.sections.appearance.navbar.notes')}
          category="navbar"
        />
        <Checkbox
          name="view"
          text={getMessage('modals.main.settings.sections.background.buttons.view')}
          category="navbar"
        />
        <Checkbox
          name="refresh"
          text={getMessage('modals.main.settings.sections.appearance.navbar.refresh')}
          category="navbar"
          onChange={setShowRefreshOptions}
        />
        <Checkbox name="todo" text="Todos" category="navbar" />
      </SettingsItem>
      {showRefreshOptions ? (
        <SettingsItem
          title={getMessage('modals.main.settings.sections.appearance.navbar.refresh')}
          subtitle="Choose what is refreshed when you click the refresh button"
          final={true}
        >
          <Dropdown name="refreshOption" category="navbar">
            <option value="page">
              {getMessage('modals.main.settings.sections.appearance.navbar.refresh_options.page')}
            </option>
            <option value="background">
              {getMessage('modals.main.settings.sections.background.title')}
            </option>
            <option value="quote">{getMessage('modals.main.settings.sections.quote.title')}</option>
            <option value="quotebackground">
              {getMessage('modals.main.settings.sections.quote.title')} +{' '}
              {getMessage('modals.main.settings.sections.background.title')}
            </option>
          </Dropdown>
        </SettingsItem>
      ) : null}
    </>
  );
}
