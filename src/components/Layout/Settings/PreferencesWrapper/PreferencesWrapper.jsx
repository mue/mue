import React, { useState } from 'react';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import variables from 'config/variables';
import Slider from '../../../Form/Settings/Slider/Slider';

import values from 'utils/data/slider_values.json';
import EventBus from 'utils/eventbus';

const PreferencesWrapper = ({ children, ...props }) => {
  const [shown, setShown] = useState(
    localStorage.getItem(props.setting) === 'true' || props.default || false,
  );
  console.log(props.default);

  EventBus.on('toggle', (setting) => {
    if (setting === props.setting) {
      setShown(!shown);
    }
  });

  return (
    <div
      className={
        shown
          ? 'preferences bg-modal-content-light dark:bg-modal-content-dark p-10 rounded'
          : 'opacity-50 pointer-events-none transition-400 ease-in-out bg-modal-content-light dark:bg-modal-content-dark p-10 rounded'
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
