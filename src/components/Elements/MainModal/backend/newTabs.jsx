import { useState, useCallback, memo, useMemo } from 'react';
import variables from 'config/variables';
import Tab from './Tab';
import { useTab } from './TabContext';
import { MdRefresh, MdClose } from 'react-icons/md';

const Sidebar = memo(({ sections, currentTab, setCurrentTab }) => {
  const { subTab, setSubTab, setSubSection } = useTab();
  const handleClick = useCallback(
    (label) => () => {
      setSubTab(variables.getMessage(label));
      setSubSection('');
    },
    [setSubTab, setSubSection],
  );

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
    <div className="modalSidebar">
      {sections.map((section, index) => (
        <Tab
          key={index}
          currentTab={subTab}
          label={variables.getMessage(section.label)}
          onClick={handleClick(section.label)}
          navbarTab={section.navbar || false}
        />
      ))}
      {reminderInfo}
    </div>
  );
});

const Content = memo(({ sections, currentTab }) => (
  <>
    {sections.map(
      ({ label, name, component: Component }) =>
        variables.getMessage(label) === currentTab && (
          <div
            className="w-full rounded min-h-[69vh] bg-modal-content-light dark:bg-modal-content-dark p-10 flex flex-col"
            key={name}
            label={variables.getMessage(label)}
            name={name}
          >
            <Component />
          </div>
        ),
    )}
  </>
));

const Tabs = ({ sections }) => {
  const { subTab, setSubTab, setSubSection } = useTab();

  return (
    <div className="flex flex-row w-full gap-2">
      <Sidebar sections={sections} currentTab={subTab} />
      <Content sections={sections} currentTab={subTab} />
    </div>
  );
};

export { Tabs };
