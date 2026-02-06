import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Background from 'features/background/Background';
import Widgets from 'features/misc/views/Widgets';
import Modals from 'features/misc/modals/Modals';
import CustomWidgets from 'features/misc/CustomWidgets';
import { loadSettings, moveSettings } from 'utils/settings';
import EventBus from 'utils/eventbus';
import variables from 'config/variables';
import { TranslationProvider } from 'contexts/TranslationContext';
import { installDefaultPhotoPacks } from 'utils/marketplace/installDefaultPacks';

const useAppSetup = () => {
  useEffect(() => {
    const firstRun = localStorage.getItem('firstRun');
    const stats = localStorage.getItem('stats');

    if (!firstRun || !stats) {
      moveSettings();
      window.location.reload();
    }

    loadSettings();

    installDefaultPhotoPacks();

    const refreshHandler = (data) => {
      if (data === 'other' || data === 'greeting' || data === 'clock' || data === 'quote') {
        loadSettings(true);
      }
    };

    EventBus.on('refresh', refreshHandler);

    variables.stats.tabLoad();

    return () => {
      EventBus.off('refresh', refreshHandler);
    };
  }, []);
};

const App = () => {
  const [toastDisplayTime, setToastDisplayTime] = useState(2500);
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    const storedToastDisplayTime = localStorage.getItem('toastDisplayTime');
    const storedBackground = localStorage.getItem('background');

    if (storedToastDisplayTime) {
      setToastDisplayTime(parseInt(storedToastDisplayTime, 10));
    }

    if (storedBackground === 'true') {
      setShowBackground(true);
    }
  }, []);

  useAppSetup();

  const languagecode = variables.languagecode || localStorage.getItem('language') || 'en_GB';

  return (
    <TranslationProvider
      initialLanguage={languagecode}
      initialTranslations={variables.language?.messages || {}}
    >
      {showBackground && <Background />}
      <CustomWidgets />
      <ToastContainer
        position="top-center"
        autoClose={toastDisplayTime}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
      />
      <div id="center">
        <Widgets />
        <Modals />
      </div>
    </TranslationProvider>
  );
};

export default App;
