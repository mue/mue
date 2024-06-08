// Importing necessary libraries and components
import { useState, useEffect } from 'react';
import variables from 'config/variables';
import { MdArrowBackIosNew, MdArrowForwardIos, MdOutlinePreview } from 'react-icons/md';

import EventBus from 'utils/eventbus';

import { ProgressBar, AsideImage } from './components/Elements';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'components/Elements';
import { Wrapper, Panel } from './components/Layout';
import { getOfflineImage } from 'features/background/api/getOfflineImage.js';
import offline_quotes from 'features/quote/offline_quotes.json'; // Import the quotes

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
function WelcomeModal() {
  // State variables
  const [currentTab, setCurrentTab] = useState(0);
  const [buttonText, setButtonText] = useState(variables.getMessage('modals.welcome.buttons.next'));
  const [importedSettings, setImportedSettings] = useState([]);
  const [image, setImage] = useState(null); // New state variable for the image
  const [credit, setCredit] = useState(''); // New state variable for the credit
  const finalTab = 6;
  const [direction, setDirection] = useState(1); // New state variable for the direction
  const [firstRender, setFirstRender] = useState(true); // New state variable for the first render
  const [quote, setQuote] = useState(''); // New state variable for the quote

  // useEffect hook to handle tab changes and event bus listener
  useEffect(() => {
    // Get the current welcome tab from local storage
    setFirstRender(false);
    const welcomeTab = localStorage.getItem('welcomeTab');
    const randomQuote = offline_quotes[Math.floor(Math.random() * offline_quotes.length)].quote;
    setQuote(randomQuote);
    if (welcomeTab) {
      const tab = Number(welcomeTab);
      setCurrentTab(tab);
      setButtonText(
        tab !== finalTab + 1
          ? variables.getMessage('modals.welcome.buttons.next')
          : variables.getMessage('modals.welcome.buttons.finish'),
      );
    }

    let offlineImage = null;
    // Fetch the offline image if the current tab is 0
    if (offlineImage === null) {
      offlineImage = getOfflineImage('background');
      setImage(offlineImage.url);
      setCredit(offlineImage.photoInfo.credit);
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
    setDirection(-1); // Update the direction
    updateTabAndButtonText(currentTab - 1);
  };

  const nextTab = () => {
    setDirection(1);
    if (buttonText === variables.getMessage('modals.welcome.buttons.finish')) {
      // modalClose();
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
            //onClick={() => modalSkip()}
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
        <motion.div
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%', // adjust as needed
            width: '100%', // adjust as needed
          }}
          className="grid place-items-center text-center"
          key={currentTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', duration: 2 }}
        >
          <motion.span
            className="text-[40px] font-bold max-w-[50%]"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ type: 'spring', duration: 2 }}
            key={currentTab}
          >
            "{quote}"
          </motion.span>
        </motion.div>
        <div className="welcomeCredit">
          {variables.getMessage('widgets.background.credit')}{' '}
          <motion.span
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ type: 'spring', duration: 2 }}
            key={currentTab}
          >
            {credit}
          </motion.span>
        </div>
        {/*<AsideImage currentTab={currentTab} />
        <ProgressBar numberOfTabs={finalTab + 1} currentTab={currentTab} switchTab={switchToTab} />*/}
      </Panel>
      <Panel type="content" key={currentTab}>
        <motion.div
          initial={{ opacity: 0, x: firstRender ? 0 : 100 * direction }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 * direction }}
        >
          {CurrentTab}
        </motion.div>
        <Navigation
          currentTab={currentTab}
          changeTab={switchToTab}
          buttonText={buttonText}
          //modalSkip={modalSkip}
        />
      </Panel>
    </Wrapper>
  );
}

// Export the WelcomeModal component
export default WelcomeModal;
