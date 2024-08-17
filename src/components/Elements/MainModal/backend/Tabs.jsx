import variables from 'config/variables';
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MdSettings,
  MdOutlineShoppingBasket,
  MdOutlineExtension,
  MdRefresh,
  MdClose,
} from 'react-icons/md';
import Tab from './Tab';
import { Button, Tooltip } from 'components/Elements';
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
    props.setSubTab(name);
  };

  const hideReminder = () => {
    localStorage.setItem('showReminder', false);
    document.querySelector('.reminder-info').style.display = 'none';
  };

  const reminderInfo = useMemo(
    () => (
      <div
        className="reminder-info"
        style={{ display: localStorage.getItem('showReminder') === 'true' ? 'flex' : 'none' }}
      >
        <div className="shareHeader">
          <span className="title">{variables.getMessage('settings:reminder.title')}</span>
          <span className="closeModal" onClick={hideReminder}>
            <MdClose />
          </span>
        </div>
        <span className="subtitle">{variables.getMessage('settings:reminder.message')}</span>
        <button onClick={() => window.location.reload()}>
          <MdRefresh />
          {variables.getMessage('modals.main.error_boundary.refresh')}
        </button>
      </div>
    ),
    [],
  );

  return (
    <>
      {props.current === 'settings' && (
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
      )}
      <div className="w-full rounded h-[calc(78vh-80px)] bg-modal-content-light dark:bg-modal-content-dark p-10 flex flex-col overflow-scroll">
        {props.children.map((tab, index) => {
          if (tab.props.label !== currentTab) {
            return null;
          }

          return (
            <ErrorBoundary key={`error-boundary-${index}`}>{tab.props.children}</ErrorBoundary>
          );
        })}
      </div>
    </>
  );
};

export default React.memo(Tabs);
