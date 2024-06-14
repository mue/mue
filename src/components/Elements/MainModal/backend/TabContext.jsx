import { createContext, useContext, useState } from 'react';

const TabContext = createContext();

export const useTab = () => {
  return useContext(TabContext);
};

export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('settings');
  const [subTab, setSubTab] = useState('Overview');
  const [subSection, setSubSection] = useState('');
  const [direction, setDirection] = useState(1);

  const changeTab = (type) => {
    const tabs = [
      { id: 'settings', label: 'Settings' },
      { id: 'addons', label: 'Addons' },
      { id: 'marketplace', label: 'Marketplace' },
    ];

    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const newIndex = tabs.findIndex((tab) => tab.id === type);

    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(type);
    setSubTab('');
  };

  const setSection = (type) => {
    setSubTab(type);
  }

  return (
    <TabContext.Provider value={{ activeTab, subTab, direction, subSection, changeTab, setSubTab, setSection, setSubSection }}>
      {children}
    </TabContext.Provider>
  );
};
