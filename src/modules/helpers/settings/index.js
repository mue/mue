import variables from 'modules/variables';
import experimentalInit from '../experimental';

import defaultSettings from 'modules/default_settings.json';
import languages from 'modules/languages.json';

/**
 * It sets the default settings for the extension
 * @param reset - boolean
 */
export function setDefaultSettings(reset) {
  localStorage.clear();
  defaultSettings.forEach((element) => localStorage.setItem(element.name, element.value));

  // Languages
  const languageCodes = languages.map(({ value }) => value);
  const browserLanguage =
    (navigator.languages &&
      navigator.languages.find((lang) => lang.replace('-', '_') && languageCodes.includes(lang))) ||
    navigator.language.replace('-', '_');

  if (languageCodes.includes(browserLanguage)) {
    localStorage.setItem('language', browserLanguage);
  } else {
    localStorage.setItem('language', 'en_GB');
  }

  localStorage.setItem('tabName', variables.getMessage('tabname'));

  if (reset) {
    localStorage.setItem('showWelcome', false);
  }

  // finally we set this to true so it doesn't run the function on every load
  localStorage.setItem('firstRun', true);
}

/**
 * It loads the settings from localStorage and applies them to the page.
 * @param hotreload - boolean
 */
export function loadSettings(hotreload) {
  switch (localStorage.getItem('theme')) {
    case 'dark':
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      break;
    case 'auto':
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
      }
      break;
    default:
      document.body.classList.add('light');
      document.body.classList.remove('dark');
  }

  document.title = localStorage.getItem('tabName') || variables.getMessage('tabname');

  if (hotreload === true) {
    // remove old custom stuff and add new
    const custom = ['customcss', 'customfont'];
    custom.forEach((element) => {
      try {
        document.head.removeChild(document.getElementById(element));
      } catch (e) {
        // Disregard exception if custom stuff doesn't exist
      }
    });
  }

  if (localStorage.getItem('animations') === 'false') {
    document.body.classList.add('no-animations');
  } else {
    document.body.classList.remove('no-animations');
  }

  // technically, this is text SHADOW, and not BORDER
  // however it's a mess and we'll just leave it at this for now
  const textBorder = localStorage.getItem('textBorder');
  // enable/disable old text border from before redesign
  if (textBorder === 'true') {
    const elements = ['greeting', 'clock', 'quote', 'quoteauthor', 'date'];
    elements.forEach((element) => {
      try {
        document.querySelector('.' + element).classList.add('textBorder');
      } catch (e) {
        // Disregard exception
      }
    });
  } else {
    const elements = ['greeting', 'clock', 'quote', 'quoteauthor', 'date'];
    elements.forEach((element) => {
      try {
        document.querySelector('.' + element).classList.remove('textBorder');
      } catch (e) {
        // Disregard exception
      }
    });
  }

  // remove actual default shadow
  if (textBorder === 'none') {
    document.getElementById('center').classList.add('no-textBorder');
  } else {
    document.getElementById('center').classList.remove('no-textBorder');
  }

  const css = localStorage.getItem('customcss');
  if (css) {
    document.head.insertAdjacentHTML('beforeend', '<style id="customcss">' + css + '</style>');
  }

  const font = localStorage.getItem('font');
  if (font) {
    let url = '';
    if (localStorage.getItem('fontGoogle') === 'true') {
      url = `@import url('https://fonts.googleapis.com/css2?family=${font}&display=swap');`;
    }

    document.head.insertAdjacentHTML(
      'beforeend',
      `
      <style id='customfont'>
        ${url}
        * {
          font-family: '${font}', 'Lexend Deca', 'Montserrat', sans-serif !important;
          font-weight: ${localStorage.getItem('fontweight')};
          font-style: ${localStorage.getItem('fontstyle')};
        }
      </style>
    `,
    );
  }

  // everything below this shouldn't run on a hot reload event
  if (hotreload === true) {
    return;
  }

  if (localStorage.getItem('experimental') === 'true') {
    experimentalInit();
  }

  // easter egg
  console.log(`
█████████████████████████████████████████████████████████████                                                                        
██                                                         ██
██               ███    ███ ██    ██ ███████               ██  
██               ████  ████ ██    ██ ██                    ██ 
██               ██ ████ ██ ██    ██ █████                 ██ 
██               ██  ██  ██ ██    ██ ██                    ██ 
██               ██      ██  ██████  ███████               ██ 
██                                                         ██ 
██                                                         ██                                                                                                 
██           Copyright 2018-${new Date().getFullYear()} The Mue Authors           ██
██           GitHub: https://github.com/mue/mue            ██
██                                                         ██
██               Thank you for using Mue!                  ██
██              Feedback: hello@muetab.com                 ██
█████████████████████████████████████████████████████████████
`);
}

/**
 * Saves all of the current settings, resets them, sets the defaults and then overrides
 * the new settings with the old saved messages where they exist.
 * @returns the result of the setDefaultSettings() function.
 */
export function moveSettings() {
  const currentSettings = Object.keys(localStorage);
  if (currentSettings.length === 0) {
    return this.setDefaultSettings();
  }

  const settings = {};
  currentSettings.forEach((key) => {
    settings[key] = localStorage.getItem(key);
  });

  localStorage.clear();
  setDefaultSettings();

  Object.keys(settings).forEach((key) => {
    localStorage.setItem(key, settings[key]);
  });
}
