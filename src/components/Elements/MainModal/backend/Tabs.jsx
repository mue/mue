import variables from 'config/variables';
import React, { useState, useEffect } from 'react';
import {
  MdSettings,
  MdOutlineShoppingBasket,
  MdOutlineExtension,
  MdRefresh,
  MdClose,
} from 'react-icons/md';
import Tab from './Tab';
import { Button } from 'components/Elements';
import ErrorBoundary from '../../../../features/misc/modals/ErrorBoundary';

const Tabs = (props) => {
  const [currentTab, setCurrentTab] = useState(props.children[0].props.label);
  const [currentName, setCurrentName] = useState(props.children[0].props.name);

  const onClick = (tab, name) => {
    if (name !== currentName) {
      variables.stats.postEvent('tab', `Opened ${name}`);
    }

    setCurrentTab(tab);
    setCurrentName(name);
  };

  const hideReminder = () => {
    localStorage.setItem('showReminder', false);
    document.querySelector('.reminder-info').style.display = 'none';
  };

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
        <span className="closeModal" onClick={hideReminder}>
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
      <h1>{currentTab}</h1>
      <h1>{currentName}</h1>
      <h1>{props.current}</h1>
      <div className="modalSidebar">
        {props.children.map((tab, index) => (
          <Tab
            currentTab={currentTab}
            key={index}
            label={tab.props.label}
            onClick={(nextTab) => onClick(nextTab, tab.props.name)}
            navbarTab={props.navbar || false}
          />
        ))}
        {reminderInfo}
      </div>
      <div className="modalTabContent">
        <div className="modalNavbar">
          {navbarButtons.map(({ tab, icon }, index) => (
            <Button
              type="navigation"
              onClick={() => props.changeTab(tab)}
              icon={icon}
              label={variables.getMessage(`modals.main.navbar.${tab}`)}
              active={props.current === tab}
              key={`${tab}-${index}`}
            />
          ))}
        </div>
        {props.children.map((tab, index) => {
          if (tab.props.label !== currentTab) {
            return undefined;
          }

          return (
            <ErrorBoundary key={`error-boundary-${index}`}>{tab.props.children}</ErrorBoundary>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
