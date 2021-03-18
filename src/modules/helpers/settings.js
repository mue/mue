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

    // Set theme depending on user preferred
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      localStorage.setItem('darkTheme', true);
    } else {
      localStorage.setItem('darkTheme', false);
    }

    // Languages
    const languageCodes = languages.map(({ code }) => code);
    const browserLanguage = (navigator.languages && navigator.languages[0]) || navigator.language;

    if (languageCodes.includes(browserLanguage)) {
      localStorage.setItem('language', browserLanguage);
      if (browserLanguage !== 'en-GB' || browserLanguage !== 'en-US') {
        document.documentElement.lang = browserLanguage;
      }
    } else {
      localStorage.setItem('language', 'en-GB');
    }

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

      let url = '';
      if (google === 'true') {
        url = `@import url('https://fonts.googleapis.com/css2?family=${font}&display=swap');`;
      }

      document.head.insertAdjacentHTML('beforeend', `
        <style>
          ${url}
          * {
            font-family: '${font}', 'Lexend Deca' !important;
          }
      </style>`);
    }

    const zoom = localStorage.getItem('zoom');
    // don't bother if it's default zoom
    if (zoom !== 100) {
      document.body.style.zoom = zoom + '%';
    }
  }
}
