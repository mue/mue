import { useState, useCallback, memo, useMemo } from 'react';
import variables from 'config/variables';
import Tab from './Tab';
import { useTab } from './TabContext';
import { MdOutlineWarning, MdRefresh, MdClose } from 'react-icons/md';

const Sidebar = memo(({ sections, currentTab, setCurrentTab }) => {
  const { subTab, setSubTab, setSubSection } = useTab();
  const handleClick = useCallback(
    (label) => () => {
      setSubTab(variables.getMessage(label));
      setSubSection('');
    },
    [setSubTab, setSubSection],
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
    </div>
  );
});

const Content = memo(({ sections, currentTab }) => {
  const hideReminder = () => {
    localStorage.setItem('showReminder', false);
    document.querySelector('.reminder-info').style.display = 'none';
  };

  const reminderInfo = useMemo(
    () => (
      <div
        className="bg-rose-800 border-rose-700 border-2 flex-row px-10 py-5 rounded items-center justify-between"
        style={{ display: localStorage.getItem('showReminder') === 'true' ? 'flex' : 'none' }}
      >
        <div className="flex flex-row items-center gap-5">
          <MdOutlineWarning />
          <span>{variables.getMessage('settings:reminder.message')}</span>
        </div>
        <div class="flex flex-row items-center gap-5">
          <button
            className="bg-neutral-900 border-neutral-800 border-2 px-8 py-2 flex flex-row items-center gap-2 rounded"
            onClick={() => window.location.reload()}
          >
            <MdRefresh /> {variables.getMessage('modals.main.error_boundary.refresh')}
          </button>
          <button
            className="bg-neutral-900 border-neutral-800 border-2 px-8 py-2 flex flex-row items-center gap-2 rounded"
            onClick={hideReminder}
          >
            <MdClose />
            Close
          </button>
        </div>
      </div>
    ),
    [],
  );

  return (
    <>
      {sections.map(
        ({ label, name, component: Component }) =>
          variables.getMessage(label) === currentTab && (
            <div
              className="w-full rounded h-[calc(78vh-80px)] flex flex-col overflow-scroll pr-2 gap-3"
              key={name}
              label={variables.getMessage(label)}
              name={name}
            >
              {reminderInfo}
              <Component />
            </div>
          ),
      )}
    </>
  );
});

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
