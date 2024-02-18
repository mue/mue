import variables from 'config/variables';
import { useState } from 'react';
import { MdAutoAwesome, MdLightMode, MdDarkMode } from 'react-icons/md';
import { loadSettings } from 'modules/helpers/settings';
import { Header } from '../components/Layout';

function ThemeSelection() {
  const [theme, setTheme] = useState({
    autoClass: 'toggle auto active',
    lightClass: 'toggle lightTheme',
    darkClass: 'toggle darkTheme',
  });

  const changeTheme = (type) => {
    setTheme({
      autoClass: type === 'auto' ? 'toggle auto active' : 'toggle auto',
      lightClass: type === 'light' ? 'toggle lightTheme active' : 'toggle lightTheme',
      darkClass: type === 'dark' ? 'toggle darkTheme active' : 'toggle darkTheme',
    });

    localStorage.setItem('theme', type);
    loadSettings(true);
  };
  return (
    <>
      <Header
        title={variables.getMessage('modals.welcome.sections.theme.title')}
        subtitle={variables.getMessage('modals.welcome.sections.theme.description')}
      />
      <div className="themesToggleArea">
        <div className={theme.autoClass} onClick={() => changeTheme('auto')}>
          <MdAutoAwesome />
          <span>{variables.getMessage('modals.main.settings.sections.appearance.theme.auto')}</span>
        </div>
        <div className="options">
          <div className={theme.lightClass} onClick={() => changeTheme('light')}>
            <MdLightMode />
            <span>
              {variables.getMessage('modals.main.settings.sections.appearance.theme.light')}
            </span>
          </div>
          <div className={theme.darkClass} onClick={() => changeTheme('dark')}>
            <MdDarkMode />
            <span>
              {variables.getMessage('modals.main.settings.sections.appearance.theme.dark')}
            </span>
          </div>
        </div>
      </div>
      <span className="title">{variables.getMessage('modals.welcome.tip')}</span>
      <span className="subtitle">{variables.getMessage('modals.welcome.sections.theme.tip')}</span>
    </>
  );
}

export { ThemeSelection as default, ThemeSelection };
