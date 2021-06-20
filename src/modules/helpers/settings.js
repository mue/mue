import experimentalInit from './experimental';

const defaultSettings = require('../default_settings.json');
const languages = require('../languages.json');

const saveFile = (data, filename = 'file') => {
  if (typeof data === 'object') {
    data = JSON.stringify(data, undefined, 4);
  }

  const blob = new Blob([data], { type: 'text/json' });
  let e = document.createEvent('MouseEvents');
  let a = document.createElement('a');

  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');

  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(e);
};

export default class SettingsFunctions {
  static exportSettings() {
    let settings = {};
    Object.keys(localStorage).forEach((key) => {
      settings[key] = localStorage.getItem(key);
    });
    saveFile(settings, 'mue-settings.json');
  }

  static setItem(key, value) {
    const old = localStorage.getItem(key);
    let val = true;

    if (old !== null && !value) {
      if (old === 'true') {
        val = false;
      }

      if (old === 'false') {
        val = true;
      }
    }

    localStorage.setItem(key, val);
  }

  static setDefaultSettings(reset) {
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

  static loadSettings(hotreload) {
    document.getElementById('widgets').style.zoom = localStorage.getItem('widgetzoom') + '%';

    const theme = localStorage.getItem('theme');
    switch (theme) {
      case 'dark':
        document.body.classList.add('dark');
        break;
      case 'auto':
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.body.classList.add('dark');
        }
        break;
      default:
        document.body.classList.remove('dark');
    }

    const tabName = localStorage.getItem('tabName') || window.language.tabname;
    document.title = tabName;

    if (hotreload === true) {
      const custom = ['customcss', 'customjs', 'customfont'];
      custom.forEach((element) => {
        try {
          document.head.removeChild(document.getElementById(element));
        } catch (e) {}
      });
    }

    const css = localStorage.getItem('customcss');
    if (css) {
      document.head.insertAdjacentHTML('beforeend', '<style id="customcss">' + css + '</style>');
    }

    const font = localStorage.getItem('font');
    if (font) {
      const google = localStorage.getItem('fontGoogle');

      let url = '';
      let fontweight = '';
      let fontstyle = '';

      if (google === 'true') {
        url = `@import url('https://fonts.googleapis.com/css2?family=${font}&display=swap');`;
      }

      const fontWeight = localStorage.getItem('fontweight');
      if (fontWeight) {
        fontweight = `font-weight: ${fontWeight};`;
      }

      const fontStyle = localStorage.getItem('fontstyle');
      if (fontStyle) {
        fontstyle = `font-style: ${fontStyle};`;
      }

      document.head.insertAdjacentHTML('beforeend', `
        <style id='customfont'>
          ${url}
          * {
            font-family: '${font}', 'Lexend Deca', 'Montserrat' !important;
            ${fontweight}
            ${fontstyle}
          }
        </style>
      `);
    }

    if (hotreload === true) {
      return;
    }

    const js = localStorage.getItem('customjs');
    if (js) {
      // eslint-disable-next-line no-eval
      eval(js);
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
 ██           Copyright 2018-2021 The Mue Authors           ██
 ██           GitHub: https://github.com/mue/mue            ██
 ██                                                         ██
 ██               Thank you for using Mue!                  ██
 ██              Feedback: hello@muetab.com                 ██
 █████████████████████████████████████████████████████████████
`);
  }

  // in a nutshell, this function saves all of the current settings, resets them, sets the defaults and then overrides 
  // the new settings with the old saved messages where they exist
  static moveSettings() {
    if (Object.keys(localStorage).length === 0) {
      return this.setDefaultSettings();
    }

    let settings = {};
    Object.keys(localStorage).forEach((key) => {
      settings[key] = localStorage.getItem(key);
    });

    localStorage.clear();

    this.setDefaultSettings();
    Object.keys(settings).forEach((key) => {
      localStorage.setItem(key, settings[key]);
    });
  }
}
