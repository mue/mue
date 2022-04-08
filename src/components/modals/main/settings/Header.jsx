import variables from 'modules/variables';

import { PureComponent } from 'react';
import { MdHelpOutline, MdFlag } from 'react-icons/md';

import Slider from './Slider';
import Switch from './Switch';
import SettingsItem from './SettingsItem';

import { values } from 'modules/helpers/settings/modals';

export default class Header extends PureComponent {
  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    return (
      <>
        <span className="mainTitle">{this.props.title}</span>
        <div className="headerExtras">
          <span className="link">
            <MdHelpOutline /> More Info
          </span>
          <span
            className="link"
            onClick={() =>
              window.open(
                variables.constants.BUG_REPORT + this.props.title.split(' ').join('+'),
                '_blank',
              )
            }
          >
            <MdFlag /> Report Issue
          </span>
        </div>
        {this.props.switch ? (
          <SettingsItem
            title={getMessage('modals.main.settings.enabled')}
            subtitle={getMessage('modals.main.settings.enabled')}
          >
            <Switch
              name={this.props.setting}
              text={getMessage('modals.main.settings.enabled')}
              category={this.props.category}
              element={this.props.element || null}
            />
          </SettingsItem>
        ) : null}
        {this.props.zoomSetting ? (
          <div className="settingsRow">
            <div className="content">
              <span className="title">
                {getMessage('modals.main.settings.sections.appearance.accessibility.widget_zoom')}
              </span>
              <span className="subtitle">eeeh course</span>
            </div>
            <div className="action">
              <Slider
                name={this.props.zoomSetting}
                min="10"
                max="400"
                default="100"
                display="%"
                marks={values('zoom')}
                category={this.props.zoomCategory || this.props.category}
              />
            </div>
          </div>
        ) : null}
      </>
    );
  }
}
