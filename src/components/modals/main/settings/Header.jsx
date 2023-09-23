import variables from 'modules/variables';

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  /*MdHelpOutline,*/ MdFlag,
  MdArrowBack,
  MdOutlineVisibilityOff,
  MdOutlineVisibility,
} from 'react-icons/md';

import Slider from './Slider';
import Switch from './Switch';
import SettingsItem from './SettingsItem';

import { values } from 'modules/helpers/settings/modals';
import Tooltip from 'components/helpers/tooltip/Tooltip';

class Header extends PureComponent {
  render() {
    return (
      <>
        <div className="flexTopMarketplace topAddons">
          {this.props.backButton ? (
            <div className="returnButton" onClick={this.props.clickEffect}>
              <Tooltip
                title={variables.getMessage('modals.main.navbar.marketplace.product.buttons.back')}
                key="backArrow"
              >
                <MdArrowBack className="backArrow" />
              </Tooltip>
            </div>
          ) : null}
          <span className="mainTitle">{this.props.title}</span>
          {this.props.switch && (
            <button
              className="sideload"
              onClick={() => {
                if (localStorage.getItem(this.props.settings) === 'true') {
                  localStorage.setItem(this.props.setting, false);
                } else {
                  localStorage.setItem(this.props.setting, true);
                }
              }}
            >
              {localStorage.getItem(this.props.setting) === 'true' ? (
                <>
                  Hide
                  <MdOutlineVisibilityOff />
                </>
              ) : (
                <>
                  Show
                  <MdOutlineVisibility />
                </>
              )}
            </button>
          )}
        </div>
        <div className="headerExtras">
          {/*<span
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
            <MdHelpOutline /> {variables.getMessage('modals.main.settings.sections.header.more_info')}
          </span>*/}
          <span
            className="link"
            onClick={() =>
              window.open(
                variables.constants.BUG_REPORT + this.props.title.split(' ').join('+'),
                '_blank',
              )
            }
          >
            <MdFlag /> {variables.getMessage('modals.main.settings.sections.header.report_issue')}
          </span>
        </div>
        {this.props.switch ? (
          <SettingsItem
            title={variables.getMessage('modals.main.settings.enabled')}
            subtitle={variables.getMessage('modals.main.settings.sections.header.enabled')}
          >
            <Switch
              name={this.props.setting}
              text={variables.getMessage('modals.main.settings.enabled')}
              category={this.props.category}
              element={this.props.element || null}
              header={true}
            />
          </SettingsItem>
        ) : null}
        {this.props.zoomSetting ? (
          <SettingsItem
            title={variables.getMessage(
              'modals.main.settings.sections.appearance.accessibility.widget_zoom',
            )}
            subtitle={variables.getMessage('modals.main.settings.sections.header.size')}
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

Header.propTypes = {
  title: PropTypes.string.isRequired,
  setting: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  element: PropTypes.string,
  backButton: PropTypes.bool,
  clickEffect: PropTypes.func,
  switch: PropTypes.bool,
  zoomSetting: PropTypes.string,
  zoomCategory: PropTypes.string,
};

export default Header;
