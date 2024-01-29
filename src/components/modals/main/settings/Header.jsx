import variables from 'modules/variables';

import { PureComponent } from 'react';
import {
  /*MdHelpOutline,*/ MdFlag,
  MdArrowBack,
  MdOutlineVisibilityOff,
  MdOutlineVisibility,
} from 'react-icons/md';

import Slider from './Slider';
import SettingsItem from './SettingsItem';
import EventBus from 'modules/helpers/eventbus';

import { values } from 'modules/helpers/settings/modals';
import Tooltip from 'components/helpers/tooltip/Tooltip';

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      [this.props.setting]: localStorage.getItem(this.props.setting) === 'true',
    };
  }

  changeSetting() {
    if (localStorage.getItem(this.props.setting) === 'true') {
      localStorage.setItem(this.props.setting, false);
      this.setState({ [this.props.setting]: false });
    } else {
      localStorage.setItem(this.props.setting, true);
      this.setState({ [this.props.setting]: true });
    }

    variables.stats.postEvent(
      'setting',
      `${this.props.name} ${this.state.checked === true ? 'enabled' : 'disabled'}`,
    );

    if (this.props.element) {
      if (!document.querySelector(this.props.element)) {
        document.querySelector('.reminder-info').style.display = 'flex';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.emit('refresh', this.props.category);
  }

  render() {
    return (
      <>
        <div className="flexTopMarketplace topAddons">
          {this.props.backButton && (
            <div className="returnButton" onClick={this.props.clickEffect}>
              <Tooltip
                title={variables.getMessage('modals.main.navbar.marketplace.product.buttons.back')}
                key="backArrow"
              >
                <MdArrowBack className="backArrow" />
              </Tooltip>
            </div>
          )}
          <span className="mainTitle">{this.props.title}</span>
          <div className="headerActions">
            {this.props.switch && (
              <button className="sideload" onClick={() => this.changeSetting()}>
                {this.state[this.props.setting] ? (
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
            <button
              className="sideload"
              onClick={() =>
                window.open(
                  variables.constants.BUG_REPORT + this.props.title.split(' ').join('+'),
                  '_blank',
                )
              }
            >
              {variables.getMessage('modals.main.settings.sections.header.report_issue')} <MdFlag />
            </button>
          </div>
        </div>
        {this.props.zoomSetting && (
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
        )}
      </>
    );
  }
}

export default Header;
