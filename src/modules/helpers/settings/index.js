import experimentalInit from '../experimental';

const defaultSettings = require('../../default_settings.json');
const languages = require('../../languages.json');

export function setDefaultSettings(reset) {
  localStorage.clear();
  defaultSettings.forEach((element) => localStorage.setItem(element.name, element.value));

  // Languages
  const languageCodes = languages.map(({ value }) => value);
  const browserLanguage = (navigator.languages && navigator.languages.find((lang) => lang.replace('-', '_') && languageCodes.includes(lang))) || navigator.language.replace('-', '_');

  if (languageCodes.includes(browserLanguage)) {
    localStorage.setItem('language', browserLanguage);
  } else {
    localStorage.setItem('language', 'en_GB');
  }

  localStorage.setItem('tabName', window.language.tabname);

  if (reset) {
    localStorage.setItem('showWelcome', false);
  }

  // Finally we set this to true so it doesn't run the function on every load
  localStorage.setItem('firstRun', true);
}

export function loadSettings(hotreload) {
  switch (localStorage.getItem('theme')) {
    case 'dark':
      document.body.classList.add('dark');
      break;
    case 'auto':
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      break;
    default:
      document.body.classList.remove('dark');
  }

  document.title = localStorage.getItem('tabName') || window.language.tabname;

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

  if (localStorage.getItem('textBorder') === 'true') {
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

    document.head.insertAdjacentHTML('beforeend', `
      <style id='customfont'>
        ${url}
        * {
          font-family: '${font}', 'Lexend Deca', 'Montserrat', sans-serif !important;
          font-weight: ${localStorage.getItem('fontweight')};
          font-style: ${localStorage.getItem('fontstyle')};
        }
      </style>
    `);
  }

  // everything below this either doesn't support hot reload (custom js) or shouldn't run on a hot reload event
  if (hotreload === true) {
    return;
  }

  const js = localStorage.getItem('customjs');
  if (js) {
    try {
      // eslint-disable-next-line no-eval
      eval(js);
    } catch (e) {
      console.error('Failed to run custom JS: ', e);
    }
  }

  if (localStorage.getItem('experimental') === 'true') {
    experimentalInit();
  }

  // easter egg
  console.log(`
█████████████████████████████████████████████████████████████                                                                        
██                                                         ██
██              ███    ███ ██    ██ ███████                ██  
██              ████  ████ ██    ██ ██                     ██ 
██              ██ ████ ██ ██    ██ █████                  ██ 
██              ██  ██  ██ ██    ██ ██                     ██ 
██              ██      ██  ██████  ███████                ██ 
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

// in a nutshell, this function saves all of the current settings, resets them, sets the defaults and then overrides 
// the new settings with the old saved messages where they exist
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
