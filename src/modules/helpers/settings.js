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
    for (const key of Object.keys(localStorage)) {
      settings[key] = localStorage.getItem(key);
    }
  
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
    const languageCodes = languages.map(({ code }) => code);
    const browserLanguage = (navigator.languages && navigator.languages[0]) || navigator.language;

    if (languageCodes.includes(browserLanguage.replace('-', '_'))) {
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
    window.location.reload();
  }

  static loadSettings() {
    const css = localStorage.getItem('customcss');
    if (css) {
      document.head.insertAdjacentHTML('beforeend', '<style>' + css + '</style>');
    }

    if (localStorage.getItem('darkTheme') === 'true') {
      document.getElementsByClassName('Toastify')[0].classList.add('dark');
    }

    const font = localStorage.getItem('font');
    if (font) {
      const google = localStorage.getItem('fontGoogle');

      let url, fontweight, fontstyle = '';
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
        <style>
          ${url}
          * {
            font-family: '${font}', 'Lexend Deca' !important;
            ${fontweight}
            ${fontstyle}
          }
        </style>
      `);
    }

    if (localStorage.getItem('experimental') === 'true') {
      experimentalInit();
    }

    const widgetzoom = localStorage.getItem('widgetzoom');
    // don't bother if it's default zoom
    if (widgetzoom !== '100') {
      document.getElementById('root').style.zoom = widgetzoom + '%';
    }

    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else if (theme === 'auto') {
      // Set theme depending on user preferred
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
      }
    }

    const tabName = localStorage.getItem('tabName');
    if (tabName !== window.language.tabname) {
      document.title = tabName;
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
 ██               Copyright 2018-2021 Mue                   ██
 ██           GitHub: https://github.com/mue/mue            ██
 ██                                                         ██
 ██               Thank you for using Mue!                  ██
 ██              Feedback: hello@muetab.com                 ██
 █████████████████████████████████████████████████████████████
`);
  }
}
