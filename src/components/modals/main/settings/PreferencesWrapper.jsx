import React, { useState } from 'react';
import SettingsItem from './SettingsItem';
import variables from 'modules/variables';
import Slider from './Slider';

import { values } from 'modules/helpers/settings/modals';
import EventBus from 'modules/helpers/eventbus';

const PreferencesWrapper = ({ children, ...props }) => {
  const [shown, setShown] = useState(localStorage.getItem(props.setting) === 'true');

  EventBus.on('toggle', (setting) => {
    if (setting === props.setting) {
      setShown(!shown);
    }
  });

  return (
    <div className={shown ? 'preferences' : 'preferencesInactive'}>
      {props.zoomSetting && (
        <SettingsItem
          title={variables.getMessage(
            'modals.main.settings.sections.appearance.accessibility.widget_zoom',
          )}
          subtitle={variables.getMessage('modals.main.settings.sections.header.size')}
        >
          <Slider
            name={props.zoomSetting}
            min="10"
            max="400"
            default="100"
            display="%"
            marks={values('zoom')}
            category={props.zoomCategory || props.category}
          />
        </SettingsItem>
      )}
      {children}
    </div>
  );
};

export default PreferencesWrapper;
