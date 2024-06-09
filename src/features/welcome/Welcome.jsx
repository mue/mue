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

function WelcomeModal() {
  const [currentTab, setCurrentTab] = useState(0);
  const [buttonText, setButtonText] = useState(variables.getMessage('modals.welcome.buttons.next'));
  const [importedSettings, setImportedSettings] = useState([]);
  const [image, setImage] = useState(null);
  const [credit, setCredit] = useState('');
  const finalTab = 6;
  const [direction, setDirection] = useState(1);
  const [firstRender, setFirstRender] = useState(true);
  const [quote, setQuote] = useState('');

  useEffect(() => {
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
    if (offlineImage === null) {
      offlineImage = getOfflineImage('background');
      setImage(offlineImage.url);
      setCredit(offlineImage.photoInfo.credit);
    }

    const refreshListener = (data) => {
      if (data === 'welcomeLanguage') {
        localStorage.setItem('welcomeTab', currentTab);
        localStorage.setItem('bgtransition', false);
        window.location.reload();
      }
    };

    EventBus.on('refresh', refreshListener);

    return () => {
      EventBus.off('refresh', refreshListener);
    };
  }, [currentTab, finalTab]);

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

  const prevTab = () => {
    setDirection(-1);
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

  const switchToTab = (tab) => {
    setDirection(tab > currentTab ? 1 : -1);
    updateTabAndButtonText(tab);
  };

  const modalSkip = () => {
    localStorage.setItem('showWelcome', false);
    localStorage.setItem('welcomePreview', true);
    window.location.reload();
  };

  console.log(localStorage.getItem('showWelcome'));

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

  const tabs = [
    <Intro key="intro" />,
    <ChooseLanguage key="chooseLanguage" />,
    <ImportSettings
      key="importSettings"
      setImportedSettings={setImportedSettings}
      switchTab={switchToTab}
    />,
    <ThemeSelection key="themeSelection" />,
    <StyleSelection key="styleSelection" />,
    <PrivacyOptions key="privacyOptions" />,
    <Final
      key="final"
      currentTab={currentTab}
      switchTab={switchToTab}
      importedSettings={importedSettings}
    />,
  ];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <Wrapper>
      <Panel type="aside">
        <motion.div
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100%',
            width: '100%',
          }}
          className="grid place-items-center text-center"
          key={currentTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', duration: 3 }}
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
      </Panel>
      <Panel type="content" style={{ position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentTab}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.8 }}
            style={{ position: 'absolute', height: '100%' }}
          >
            <div style={{ height: '100%', overflow: 'auto' }}>{tabs[currentTab]}</div>
          </motion.div>
        </AnimatePresence>
        <Navigation />
      </Panel>
    </Wrapper>
  );
}

export default WelcomeModal;
