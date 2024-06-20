import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Background from 'features/background/Background';
import Widgets from 'features/misc/views/Widgets';
import Modals from 'features/misc/modals/Modals';
import { loadSettings } from 'utils/settings';
import EventBus from 'utils/eventbus';
import variables from 'config/variables';
import Preview from 'features/helpers/preview/Preview';

import Welcome from 'features/welcome/Welcome';

import BackgroundDefaults from 'features/background/options/default';
import defaults from 'config/default';

import '@fontsource-variable/lexend-deca';
import '@fontsource-variable/montserrat';

const useAppSetup = () => {
  useEffect(() => {
    loadSettings();

    const refreshHandler = (data) => {
      if (data === 'other') {
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
    const storedToastDisplayTime = localStorage.getItem('toastDisplayTime') || defaults.toastDisplayTime;
    const storedBackground = localStorage.getItem('background') || BackgroundDefaults.background;

    if (storedToastDisplayTime) {
      setToastDisplayTime(parseInt(storedToastDisplayTime, 10));
    }

    if (storedBackground === 'true' || storedBackground === true) {
      setShowBackground(true);
    }
  }, []);

  useAppSetup();

  if (localStorage.getItem('showWelcome') !== 'false') {
    return <Welcome />;
  }

  return (
    <>
      {showBackground && <Background />}
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
      {localStorage.getItem('welcomePreview') === 'true' && (
        <Preview setup={() => window.location.reload()} />
      )}
    </>
  );
};

export default App;
