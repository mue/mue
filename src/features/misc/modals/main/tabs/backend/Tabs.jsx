import variables from 'config/variables';
import { PureComponent } from 'react';
import {
  MdSettings,
  MdOutlineShoppingBasket,
  MdOutlineExtension,
  MdRefresh,
  MdClose,
} from 'react-icons/md';
import Tab from './Tab';
import { Button } from 'components/Elements';
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
    const navbarButtons = [
      {
        tab: 'settings',
        icon: <MdSettings />,
      },
      {
        tab: 'addons',
        icon: <MdOutlineExtension />,
      },
      {
        tab: 'marketplace',
        icon: <MdOutlineShoppingBasket />,
      },
    ];

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
        <div className="modalSidebar">
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
        </div>
        <div className="modalTabContent">
          <div className="modalNavbar">
            {navbarButtons.map(({ tab, icon }, index) => (
              <Button
                type="navigation"
                onClick={() => this.props.changeTab(tab)}
                icon={icon}
                label={variables.getMessage(`modals.main.navbar.${tab}`)}
                active={this.props.current === tab}
                key={`${tab}-${index}`}
              />
            ))}
          </div>
          {this.props.children.map((tab, index) => {
            if (tab.props.label !== this.state.currentTab) {
              return undefined;
            }

            return (
              <ErrorBoundary key={`error-boundary-${index}`}>{tab.props.children}</ErrorBoundary>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Tabs;
