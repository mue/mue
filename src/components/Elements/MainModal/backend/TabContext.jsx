import { createContext, useContext, useState } from 'react';
import variables from 'config/variables';

const TabContext = createContext();

export const useTab = () => {
  return useContext(TabContext);
};

export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('settings');
  const [subTab, setSubTab] = useState(
    variables.getMessage('modals.main.marketplace.product.overview'),
  );
  const [subSection, setSubSection] = useState('');
  const [direction, setDirection] = useState(1);

  const changeTab = (tab, subtab = '', section = '') => {
    const tabs = [
      { id: 'settings', label: 'Settings' },
      { id: 'addons', label: 'Addons' },
      { id: 'marketplace', label: 'Marketplace' },
    ];

    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    const newIndex = tabs.findIndex((t) => t.id === tab);

    setDirection(newIndex > currentIndex ? 1 : -1);
    setSubTab(subtab);
    if (tab === 'settings' && subtab === '' && section === '') {
      setSubTab(variables.getMessage('modals.main.marketplace.product.overview'));
    }

    setActiveTab(tab);
    setSubSection(section);
  };

  const setSection = (type) => {
    setSubTab(type);
  };

  return (
    <TabContext.Provider
      value={{
        activeTab,
        subTab,
        direction,
        subSection,
        changeTab,
        setSubTab,
        setSection,
        setSubSection,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};
