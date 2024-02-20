import { useState, useEffect } from 'react';
import variables from 'config/variables';
import { MdArrowBackIosNew, MdArrowForwardIos, MdOutlinePreview } from 'react-icons/md';

import EventBus from 'utils/eventbus';

import { ProgressBar, AsideImage, Navigation } from './components/Elements';
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

  const changeTab = (minus) => {
    localStorage.setItem('bgtransition', true);
    localStorage.removeItem('welcomeTab');

    if (minus) {
      setCurrentTab(currentTab - 1);
      setButtonText(variables.getMessage('modals.welcome.buttons.next'));
      return;
    }

    if (buttonText === variables.getMessage('modals.welcome.buttons.finish')) {
      modalClose();
      return;
    }

    const newTab = currentTab + 1;
    setCurrentTab(newTab);
    setButtonText(
      newTab !== finalTab
        ? variables.getMessage('modals.welcome.buttons.next')
        : variables.getMessage('modals.welcome.buttons.finish'),
    );
  };

  const switchTab = (tab) => {
    setCurrentTab(tab);
    setButtonText(
      tab !== finalTab + 1
        ? variables.getMessage('modals.welcome.buttons.next')
        : variables.getMessage('modals.welcome.buttons.finish'),
    );

    localStorage.setItem('bgtransition', true);
    localStorage.removeItem('welcomeTab');
  };

  const Navigation = () => {
    return (
      <div className="welcomeButtons">
        {currentTab !== 0 ? (
          <Button
            type="settings"
            onClick={() => changeTab(true)}
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
          onClick={() => changeTab()}
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
    2: <ImportSettings switchTab={switchTab} />,
    3: <ThemeSelection />,
    4: <StyleSelection />,
    5: <PrivacyOptions />,
    6: <Final currentTab={currentTab} switchTab={switchTab} />,
  };

  let CurrentTab = tabComponents[currentTab] || <Intro />;

  return (
    <Wrapper>
      <Panel type="aside">
        <AsideImage currentTab={currentTab} />
        <ProgressBar numberOfTabs={finalTab + 1} currentTab={currentTab} switchTab={switchTab} />
      </Panel>
      <Panel type="content">
        {CurrentTab}
        <Navigation
          currentTab={currentTab}
          changeTab={changeTab}
          buttonText={buttonText}
          modalSkip={modalSkip}
        />
      </Panel>
    </Wrapper>
  );
}

export default WelcomeModal;
