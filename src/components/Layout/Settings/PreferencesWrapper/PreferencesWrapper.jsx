import React, { useState, useEffect } from 'react';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import variables from 'config/variables';
import Slider from '../../../Form/Settings/Slider/Slider';

import values from 'utils/data/slider_values.json';
import EventBus from 'utils/eventbus';

const PreferencesWrapper = ({ children, ...props }) => {
  const [shown, setShown] = useState(() => {
    if (!props.setting) {
      return true;
    }
    return localStorage.getItem(props.setting) === 'true' || props.default || false;
  });

  useEffect(() => {
    const handleToggle = (setting) => {
      if (setting === props.setting) {
        setShown((prevShown) => !prevShown);
      }
    };

    EventBus.on('toggle', handleToggle);

    return () => {
      EventBus.off('toggle', handleToggle);
    };
  }, [props.setting]);

  return (
    <div
      className={
        shown
          ? 'preferences bg-modal-content-light dark:bg-modal-content-dark p-10 rounded divide-y divide-gray-500'
          : 'opacity-50 pointer-events-none transition-400 ease-in-out bg-modal-content-light dark:bg-modal-content-dark p-10 rounded divide-y divide-gray-500'
      }
    >
      {props.zoomSetting && (
        <Row>
          <Content
            title={variables.getMessage('settings:sections.appearance.accessibility.widget_zoom')}
            subtitle={variables.getMessage('settings:sections.header.size')}
          />
          <Action>
            <Slider
              name={props.zoomSetting}
              min="10"
              max="400"
              default="100"
              display="%"
              marks={values.zoom}
              category={props.zoomCategory || props.category}
            />
          </Action>
        </Row>
      )}
      {children}
    </div>
  );
};

export { PreferencesWrapper as default, PreferencesWrapper };
