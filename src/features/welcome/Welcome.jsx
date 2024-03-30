// Importing necessary libraries and components
import { useState, useEffect } from 'react';
import variables from 'config/variables';
import { MdArrowBackIosNew, MdArrowForwardIos, MdOutlinePreview } from 'react-icons/md';

import EventBus from 'utils/eventbus';

import { ProgressBar, AsideImage } from './components/Elements';
import { Button } from 'components/Elements';
import { Wrapper, Panel } from './components/Layout';

import './welcome.scss';

import {
  Intro,
  ChooseLanguage,
  ImportSettings,
  ThemeSelection,
  StyleSelection,
  PrivacyOptions,
  Final,
} from './components/Sections';

// WelcomeModal component
function WelcomeModal({ modalClose, modalSkip }) {
  // State variables
  const [currentTab, setCurrentTab] = useState(0);
  const [buttonText, setButtonText] = useState(variables.getMessage('modals.welcome.buttons.next'));
  const [importedSettings, setImportedSettings] = useState([]);
  const finalTab = 6;

  // useEffect hook to handle tab changes and event bus listener
  useEffect(() => {
    // Get the current welcome tab from local storage
    const welcomeTab = localStorage.getItem('welcomeTab');
    if (welcomeTab) {
      const tab = Number(welcomeTab);
      setCurrentTab(tab);
      setButtonText(
        tab !== finalTab + 1
          ? variables.getMessage('modals.welcome.buttons.next')
          : variables.getMessage('modals.welcome.buttons.finish'),
      );
    }

    // Listener for the 'refresh' event
    const refreshListener = (data) => {
      if (data === 'welcomeLanguage') {
        localStorage.setItem('welcomeTab', currentTab);
        localStorage.setItem('bgtransition', false);
        window.location.reload();
      }
    };

    // Subscribe to the 'refresh' event
    EventBus.on('refresh', refreshListener);

    // Cleanup function to unsubscribe from the 'refresh' event
    return () => {
      EventBus.off('refresh', refreshListener);
    };
  }, [currentTab, finalTab]);

  // Function to update the current tab and button text
  const updateTabAndButtonText = (newTab) => {
    setCurrentTab(newTab);
    setButtonText(
      newTab !== finalTab
        ? variables.getMessage('modals.welcome.buttons.next')
        : variables.getMessage('modals.welcome.buttons.finish'),
    );

    localStorage.setItem('bgtransition', true);
    localStorage.removeItem('welcomeTab');
  };

  // Functions to navigate to the previous and next tabs
  const prevTab = () => {
    updateTabAndButtonText(currentTab - 1);
  };

  const nextTab = () => {
    if (buttonText === variables.getMessage('modals.welcome.buttons.finish')) {
      modalClose();
      return;
    }
    updateTabAndButtonText(currentTab + 1);
  };

  // Function to switch to a specific tab
  const switchToTab = (tab) => {
    updateTabAndButtonText(tab);
  };

  // Navigation component
  const Navigation = () => {
    return (
      <div className="welcomeButtons">
        {currentTab !== 0 ? (
          <Button
            type="settings"
            onClick={() => prevTab()}
            icon={<MdArrowBackIosNew />}
            label={variables.getMessage('modals.welcome.buttons.previous')}
          />
        ) : (
          <Button
            type="settings"
            onClick={() => modalSkip()}
            icon={<MdOutlinePreview />}
            label={variables.getMessage('modals.welcome.buttons.preview')}
          />
        )}
        <Button
          type="settings"
          onClick={() => nextTab()}
          icon={<MdArrowForwardIos />}
          label={buttonText}
          iconPlacement={'right'}
        />
      </div>
    );
  };

  // Mapping of tab numbers to components
  const tabComponents = {
    0: <Intro />,
    1: <ChooseLanguage />,
    2: <ImportSettings setImportedSettings={setImportedSettings} switchTab={switchToTab} />,
    3: <ThemeSelection />,
    4: <StyleSelection />,
    5: <PrivacyOptions />,
    6: (
      <Final currentTab={currentTab} switchTab={switchToTab} importedSettings={importedSettings} />
    ),
  };

  // Current tab component
  let CurrentTab = tabComponents[currentTab] || <Intro />;

  // Render the WelcomeModal component
  return (
    <Wrapper>
      <Panel type="aside">
        <AsideImage currentTab={currentTab} />
        <ProgressBar numberOfTabs={finalTab + 1} currentTab={currentTab} switchTab={switchToTab} />
      </Panel>
      <Panel type="content">
        {CurrentTab}
        <Navigation
          currentTab={currentTab}
          changeTab={switchToTab}
          buttonText={buttonText}
          modalSkip={modalSkip}
        />
      </Panel>
    </Wrapper>
  );
}

// Export the WelcomeModal component
export default WelcomeModal;
