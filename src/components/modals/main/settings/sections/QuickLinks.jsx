import variables from 'modules/variables';
import { useState } from 'react';

import Header from '../Header';
import Checkbox from '../Checkbox';

import SettingsItem from '../SettingsItem';

export default function QuickLinks() {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);
  const [textOnly, setTextOnly] = useState(localStorage.getItem('quicklinksText') === 'true');

  return (
    <>
      <Header
        title={getMessage('modals.main.settings.sections.quicklinks.title')}
        setting="quicklinksenabled"
        category="quicklinks"
        element=".quicklinks-container"
        zoomSetting="zoomQuicklinks"
        switch={true}
      />
      <SettingsItem
        title={getMessage('modals.main.settings.additional_settings')}
        subtitle={getMessage('modals.main.settings.sections.quicklinks.additional')}
        final={true}
      >
        <Checkbox
          name="quicklinksText"
          text={getMessage('modals.main.settings.sections.quicklinks.text_only')}
          category="quicklinks"
          onChange={(value) => setTextOnly(value)}
        />
        <Checkbox
          name="quicklinksddgProxy"
          text={getMessage('modals.main.settings.sections.background.ddg_image_proxy')}
          category="quicklinks"
          disabled={textOnly}
        />
        <Checkbox
          name="quicklinksnewtab"
          text={getMessage('modals.main.settings.sections.quicklinks.open_new')}
          category="quicklinks"
        />
        <Checkbox
          name="quicklinkstooltip"
          text={getMessage('modals.main.settings.sections.quicklinks.tooltip')}
          category="quicklinks"
          disabled={textOnly}
        />
      </SettingsItem>
    </>
  );
}
