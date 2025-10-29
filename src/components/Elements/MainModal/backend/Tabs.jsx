import variables from 'config/variables';
import { useState } from 'react';
import Tab from './Tab';
import ReminderInfo from '../components/ReminderInfo';
import ErrorBoundary from '../../../../features/misc/modals/ErrorBoundary';
import { TAB_TYPES } from '../constants/tabConfig';

const Tabs = ({ children, navbar = false, currentTab: activeTab }) => {
  const [currentTab, setCurrentTab] = useState(children[0]?.props.label);
  const [currentName, setCurrentName] = useState(children[0]?.props.name);
  const [showReminder, setShowReminder] = useState(localStorage.getItem('showReminder') === 'true');

  const handleTabClick = (tab, name) => {
    if (name !== currentName) {
      variables.stats.postEvent('tab', `Opened ${name}`);
    }

    setCurrentTab(tab);
    setCurrentName(name);
  };

  const handleHideReminder = () => {
    localStorage.setItem('showReminder', 'false');
    setShowReminder(false);
  };

  // Only show sidebar for Settings tab
  const showSidebar = activeTab === TAB_TYPES.SETTINGS;

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100%' }}>
      {showSidebar && (
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
      )}
      <div className="modalTabContent">
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
