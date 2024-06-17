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
  const [buttonText, setButtonText] = useState(variables.getMessage('welcome:buttons.next'));
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
    const usableQuotes = offline_quotes.filter((q) => q.quote.length <= 100);
    const randomQuote = usableQuotes[Math.floor(Math.random() * usableQuotes.length)].quote;
    setQuote(randomQuote);
    if (welcomeTab) {
      const tab = Number(welcomeTab);
      setCurrentTab(tab);
      setButtonText(
        tab !== finalTab + 1
          ? variables.getMessage('welcome:buttons.next')
          : variables.getMessage('welcome:buttons.finish'),
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
        ? variables.getMessage('welcome:buttons.next')
        : variables.getMessage('welcome:buttons.finish'),
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
    if (buttonText === variables.getMessage('welcome:buttons.finish')) {
      completeSetup();
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

  const completeSetup = () => {
    localStorage.setItem('showWelcome', false);
    localStorage.setItem('welcomePreview', false);
    window.location.reload();
  };

  const Navigation = () => {
    return (
      <div className="welcomeButtons z-50 backdrop-blur-sm absolute bottom-0 right-0 w-1/2">
        <div className="flex justify-end gap-5 p-6">
          {currentTab !== 0 ? (
            <Button
              type="settings"
              onClick={() => prevTab()}
              icon={<MdArrowBackIosNew />}
              label={variables.getMessage('welcome:buttons.previous')}
            />
          ) : (
            <Button
              type="settings"
              onClick={() => modalSkip()}
              icon={<MdOutlinePreview />}
              label={variables.getMessage('welcome:buttons.preview')}
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
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1,
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
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', duration: 3 }}
        >
          <motion.span
            className="text-6xl font-bold mx-auto max-w-[75%] 2xl:max-w-[50%] leading-tight lg:leading-snug"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ type: 'spring', duration: 2 }}
            key={currentTab}
          >
            <mark className="bg-transparent text-white shadow-black text-shadow-lg">"{quote}"</mark>
          </motion.span>
        </motion.div>
        <div className="absolute bottom-4 left-4 text-white">
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
            style={{ position: 'absolute', height: '100%', width: '50%' }}
          >
            <div className="h-full overflow-auto p-8">{tabs[currentTab]}</div>
          </motion.div>
        </AnimatePresence>
        <Navigation />
      </Panel>
    </Wrapper>
  );
}

export default WelcomeModal;
