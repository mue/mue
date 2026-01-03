import variables from 'config/variables';
import { useState, useEffect } from 'react';
import Tab from './Tab';
import ReminderInfo from '../components/ReminderInfo';
import ErrorBoundary from '../../../../features/misc/modals/ErrorBoundary';
import { TAB_TYPES } from '../constants/tabConfig';

const Tabs = ({ children, navbar = false, currentTab: activeTab, onSectionChange, resetToFirst }) => {
  const [currentTab, setCurrentTab] = useState(children[0]?.props.label);
  const [currentName, setCurrentName] = useState(children[0]?.props.name);
  const [showReminder, setShowReminder] = useState(localStorage.getItem('showReminder') === 'true');

  const handleTabClick = (tab, name) => {
    if (name !== currentName) {
      variables.stats.postEvent('tab', `Opened ${name}`);
    }

    setCurrentTab(tab);
    setCurrentName(name);

    // Notify parent of section change
    if (onSectionChange) {
      onSectionChange(tab);
    }
  };

  // Notify parent of initial section on mount
  useEffect(() => {
    if (onSectionChange && currentTab) {
      onSectionChange(currentTab);
    }
  }, []);

  // Reset to first tab when requested
  useEffect(() => {
    if (resetToFirst) {
      setCurrentTab(children[0]?.props.label);
      setCurrentName(children[0]?.props.name);
      if (onSectionChange) {
        onSectionChange(children[0]?.props.label);
      }
    }
  }, [resetToFirst]);

  const handleHideReminder = () => {
    localStorage.setItem('showReminder', 'false');
    setShowReminder(false);
  };

  // Show sidebar for Settings and Discover tabs
  const showSidebar = activeTab === TAB_TYPES.SETTINGS || activeTab === TAB_TYPES.DISCOVER;

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100%' }}>
      {showSidebar ? (
        <div className="modalSidebar">
          {children.map((tab, index) => (
            <Tab
              key={index}
              currentTab={currentTab}
              label={tab.props.label}
              onClick={(nextTab) => handleTabClick(nextTab, tab.props.name)}
              navbarTab={navbar}
            />
          ))}
          <ReminderInfo isVisible={showReminder} onHide={handleHideReminder} />
        </div>
      ) : null}
      <div className="modalTabContent" style={{ marginLeft: showSidebar ? '1rem' : '0' }}>
        {children.map((tab, index) => {
          if (tab.props.label !== currentTab) {
            return null;
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
