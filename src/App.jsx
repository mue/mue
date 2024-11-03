import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Background from 'features/background/Background';
import Widgets from 'features/misc/views/Widgets';
import Modals from 'features/misc/modals/Modals';
import { loadSettings, moveSettings } from 'utils/settings';
import EventBus from 'utils/eventbus';
import variables from 'config/variables';

const useAppSetup = () => {
  useEffect(() => {
    const initializeSettings = () => {
      const firstRun = localStorage.getItem('firstRun');
      const stats = localStorage.getItem('stats');

      if (!firstRun || !stats) {
        moveSettings();
        window.location.reload();
      }

      loadSettings();
    };

    initializeSettings();

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

const useLocalStorageState = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

const App = () => {
  const [toastDisplayTime, setToastDisplayTime] = useLocalStorageState('toastDisplayTime', 2500);
  const [showBackground, setShowBackground] = useLocalStorageState('background', false);

  useAppSetup();

  return (
    <>
      {showBackground && <Background />}
      <ToastContainer
        position="top-center"
        autoClose={toastDisplayTime}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
      />
      <div id="center">
        <Widgets />
        <Modals />
      </div>
    </>
  );
};

export default App;
