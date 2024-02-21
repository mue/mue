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
} from './Sections';

function WelcomeModal({ modalClose, modalSkip }) {
  const [currentTab, setCurrentTab] = useState(0);
  const [buttonText, setButtonText] = useState(variables.getMessage('modals.welcome.buttons.next'));
  const finalTab = 6;

  useEffect(() => {
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
    updateTabAndButtonText(currentTab - 1);
  };

  const nextTab = () => {
    if (buttonText === variables.getMessage('modals.welcome.buttons.finish')) {
      modalClose();
      return;
    }
    updateTabAndButtonText(currentTab + 1);
  };

  const switchToTab = (tab) => {
    updateTabAndButtonText(tab);
  };

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

  const tabComponents = {
    0: <Intro />,
    1: <ChooseLanguage />,
    2: <ImportSettings switchTab={switchToTab} />,
    3: <ThemeSelection />,
    4: <StyleSelection />,
    5: <PrivacyOptions />,
    6: <Final currentTab={currentTab} switchTab={switchToTab} />,
  };

  let CurrentTab = tabComponents[currentTab] || <Intro />;

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

export default WelcomeModal;
