import { useState, useCallback, memo } from 'react';
import variables from 'config/variables';
import Tab from './Tab';
import { useTab } from './TabContext';

const Sidebar = memo(({ sections, currentTab, setCurrentTab }) => {
  const { subTab, setSubTab, setSubSection } = useTab();
  const handleClick = useCallback(
    (label) => () => {
      setCurrentTab(variables.getMessage(label));
      setSubTab(variables.getMessage(label));
      setSubSection('');
    },
    [setCurrentTab, setSubTab, setSubSection],
  );


  return (
    <div className="modalSidebar">
      {sections.map((section, index) => (
        <Tab
          key={index}
          currentTab={currentTab}
          label={variables.getMessage(section.label)}
          onClick={handleClick(section.label)}
          navbarTab={section.navbar || false}
        />
      ))}
    </div>
  );
});

const Content = memo(({ sections, currentTab }) => (
  <>
    {sections.map(
      ({ label, name, component: Component }) =>
        variables.getMessage(label) === currentTab && (
          <div
            className="modalTabContent"
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
  const [currentTab, setCurrentTab] = useState(variables.getMessage(sections[0].label));

  return (
    <div className="flex flex-row w-full">
      <Sidebar sections={sections} currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <Content sections={sections} currentTab={currentTab} />
    </div>
  );
};

export { Tabs };
