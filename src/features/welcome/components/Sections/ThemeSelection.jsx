import variables from 'config/variables';
import { useState } from 'react';
import { MdAutoAwesome, MdLightMode, MdDarkMode } from 'react-icons/md';
import { loadSettings } from 'utils/settings';
import { Header, Content } from '../Layout';

const THEMES = {
  AUTO: 'auto',
  LIGHT: 'light',
  DARK: 'dark',
};

function ThemeSelection() {
  const currentTheme = localStorage.getItem('theme') || THEMES.AUTO;
  const [theme, setTheme] = useState(currentTheme);

  const changeTheme = (type) => {
    setTheme(type);
    localStorage.setItem('theme', type);
    loadSettings(true);
  };

  const themeMapping = {
    [THEMES.AUTO]: {
      className: theme === THEMES.AUTO ? 'toggle auto active' : 'toggle auto',
      icon: <MdAutoAwesome />,
      text: variables.getMessage('modals.main.settings.sections.appearance.theme.auto'),
    },
    [THEMES.LIGHT]: {
      className: theme === THEMES.LIGHT ? 'toggle lightTheme active' : 'toggle lightTheme',
      icon: <MdLightMode />,
      text: variables.getMessage('modals.main.settings.sections.appearance.theme.light'),
    },
    [THEMES.DARK]: {
      className: theme === THEMES.DARK ? 'toggle darkTheme active' : 'toggle darkTheme',
      icon: <MdDarkMode />,
      text: variables.getMessage('modals.main.settings.sections.appearance.theme.dark'),
    },
  };

  return (
    <Content>
      <Header
        title={variables.getMessage('modals.welcome.sections.theme.title')}
        subtitle={variables.getMessage('modals.welcome.sections.theme.description')}
      />
      <div className="themesToggleArea">
        <div
          className={themeMapping[THEMES.AUTO].className}
          onClick={() => changeTheme(THEMES.AUTO)}
        >
          {themeMapping[THEMES.AUTO].icon}
          <span>{themeMapping[THEMES.AUTO].text}</span>
        </div>
        <div className="options">
          {Object.entries(themeMapping)
            .filter(([type]) => type !== THEMES.AUTO)
            .map(([type, { className, icon, text }]) => (
              <div className={className} onClick={() => changeTheme(type)} key={type}>
                {icon}
                <span>{text}</span>
              </div>
            ))}
        </div>
      </div>
      <span className="title">{variables.getMessage('modals.welcome.tip')}</span>
      <span className="subtitle">{variables.getMessage('modals.welcome.sections.theme.tip')}</span>
    </Content>
  );
}

export { ThemeSelection as default, ThemeSelection };
