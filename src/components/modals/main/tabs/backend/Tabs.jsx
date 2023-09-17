import variables from 'modules/variables';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  MdSettings,
  MdOutlineShoppingBasket,
  MdOutlineExtension,
  MdRefresh,
  MdClose,
} from 'react-icons/md';
import Tab from './Tab';
import ErrorBoundary from '../../../ErrorBoundary';

class Tabs extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: this.props.children[0].props.label,
      currentName: this.props.children[0].props.name,
    };
  }

  onClick = (tab, name) => {
    if (name !== this.state.currentName) {
      variables.stats.postEvent('tab', `Opened ${name}`);
    }

    this.setState({
      currentTab: tab,
      currentName: name,
    });
  };

  hideReminder() {
    localStorage.setItem('showReminder', false);
    document.querySelector('.reminder-info').style.display = 'none';
  }

  render() {
    const reminderInfo = (
      <div
        className="reminder-info"
        style={{ display: localStorage.getItem('showReminder') === 'true' ? 'flex' : 'none' }}
      >
        <div className="shareHeader">
          <span className="title">
            {variables.getMessage('modals.main.settings.reminder.title')}
          </span>
          <span className="closeModal" onClick={() => this.hideReminder()}>
            <MdClose />
          </span>
        </div>
        <span className="subtitle">
          {variables.getMessage('modals.main.settings.reminder.message')}
        </span>
        <button onClick={() => window.location.reload()}>
          <MdRefresh />
          {variables.getMessage('modals.main.error_boundary.refresh')}
        </button>
      </div>
    );

    return (
      <div style={{ display: 'flex', width: '100%', minHeight: '100%' }}>
        <ul className="sidebar">
          {this.props.children.map((tab, index) => (
            <Tab
              currentTab={this.state.currentTab}
              key={index}
              label={tab.props.label}
              onClick={(nextTab) => this.onClick(nextTab, tab.props.name)}
              navbarTab={this.props.navbar || false}
            />
          ))}
          {reminderInfo}
        </ul>
        <div className="tab-content" style={{ width: '100%' }}>
          <ErrorBoundary>
            <div className="modalNavbar">
              <button
                className={
                  this.props.current === 'settings'
                    ? 'navbar-item navbar-item-active'
                    : 'navbar-item'
                }
                onClick={() => this.props.changeTab('settings')}
              >
                <MdSettings />
                <span>{variables.getMessage('modals.main.navbar.settings')}</span>
              </button>
              <button
                className={
                  this.props.current === 'addons' ? 'navbar-item navbar-item-active' : 'navbar-item'
                }
                onClick={() => this.props.changeTab('addons')}
              >
                <MdOutlineExtension />
                <span>{variables.getMessage('modals.main.navbar.addons')}</span>
              </button>
              <button
                className={
                  this.props.current === 'marketplace'
                    ? 'navbar-item navbar-item-active'
                    : 'navbar-item'
                }
                onClick={() => this.props.changeTab('marketplace')}
              >
                <MdOutlineShoppingBasket />
                <span>{variables.getMessage('modals.main.navbar.marketplace')}</span>
              </button>
            </div>
            {this.props.children.map((tab) => {
              if (tab.props.label !== this.state.currentTab) {
                return undefined;
              }

              return tab.props.children;
            })}
          </ErrorBoundary>
        </div>
      </div>
    );
  }
}

Tabs.propTypes = {
  children: PropTypes.instanceOf(Array).isRequired,
  current: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired,
  navbar: PropTypes.bool,
};

Tabs.defaultProps = {
  navbar: false,
};

export default Tabs;
