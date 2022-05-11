import variables from 'modules/variables';

import { PureComponent } from 'react';
import { MdHelpOutline, MdFlag, MdArrowBack } from 'react-icons/md';

import Slider from './Slider';
import Switch from './Switch';
import SettingsItem from './SettingsItem';

import { values } from 'modules/helpers/settings/modals';
import Tooltip from '../../../helpers/tooltip/Tooltip';

export default class Header extends PureComponent {
  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    return (
      <>
        <div className="flexTopMarketplace">
          {this.props.backButton ? (
            <div className="returnButton" onClick={this.props.clickEffect}>
              <Tooltip title="back" key="backArrow">
                <MdArrowBack className="backArrow" />
              </Tooltip>
            </div>
          ) : null}
          <span className="mainTitle">{this.props.title}</span>
        </div>
        <div className="headerExtras">
          <span
            className="link"
            onClick={() =>
              window.open(
                variables.constants.KNOWLEDGEBASE +
                  '/settings/' +
                  this.props.setting.toLowerCase().replace('enabled', ''),
                '_blank',
              )
            }
          >
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
            subtitle="Choose whether or not to show this widget"
          >
            <Switch
              name={this.props.setting}
              text={getMessage('modals.main.settings.enabled')}
              category={this.props.category}
              element={this.props.element || null}
              header={true}
            />
          </SettingsItem>
        ) : null}
        {this.props.zoomSetting ? (
          <SettingsItem
            title={getMessage('modals.main.settings.sections.appearance.accessibility.widget_zoom')}
            subtitle="Slider to control how large the widget is"
          >
            <Slider
              name={this.props.zoomSetting}
              min="10"
              max="400"
              default="100"
              display="%"
              marks={values('zoom')}
              category={this.props.zoomCategory || this.props.category}
            />
          </SettingsItem>
        ) : null}
      </>
    );
  }
}
