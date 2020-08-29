import detectBrowserLanguage from 'detect-browser-language';

const saveFile = (data, filename = 'file') => {
    if (!data) return console.error('No data');
    if (typeof data === 'object') data = JSON.stringify(data, undefined, 4);

    const blob = new Blob([data], { type: 'text/json' });
    let e = document.createEvent('MouseEvents');
    let a = document.createElement('a');

    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');

    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
}

const defaultSettings = require('./defaultSettings.json');

export default class SettingsFunctions {
    static exportSettings() {
        let settings = {};
        for (const key of Object.keys(localStorage)) settings[key] = localStorage.getItem(key);
        saveFile(settings, 'mue-settings.json');
    }

    static setItem(key, value) {
        let old = localStorage.getItem(key);
        let val = true;

        if (old !== null && !value) {
            if (old === 'true') val = false;
            if (old === 'false') val = true;
        }

        localStorage.setItem(key, val);
    }

    static toggleExtra(element, element2) {
        (element.style.display === 'none' || !element.style.display) ? element.style.display = 'block' : element.style.display = 'none';
        (element2.style.transform === 'rotate(-180deg)') ? element2.style.transform = 'rotate(0)' : element2.style.transform = 'rotate(-180deg)';
    }

    static setSearchEngine(input) {
        const searchEngineInput = document.getElementById('searchEngineInput');
        if (input === 'custom') {
          searchEngineInput.enabled = 'false';
          searchEngineInput.style.display = 'block';
        } else {
          searchEngineInput.style.display = 'none';
          searchEngineInput.enabled = 'true';
          localStorage.setItem('searchEngine', input);
        }
    }

    static saveStuff() {
        localStorage.setItem('blur', document.getElementById('blurRange').value);
        localStorage.setItem('brightness', document.getElementById('brightnessRange').value);
        localStorage.setItem('greetingName', document.getElementById('greetingName').value);
        localStorage.setItem('customBackground', document.getElementById('customBackground').value);
        if (!document.getElementById('searchEngineInput').enabled === 'false') {
          localStorage.setItem('customSearchEngine', document.getElementById('searchEngineInput').value);
        }
        window.location.reload();
    }

    static setDefaultSettings() {
        localStorage.clear();
        defaultSettings.forEach(element => localStorage.setItem(element.name, element.value));

        // Set theme depending on user preferred
        // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) localStorage.setItem('darkTheme', true);
        //else localStorage.setItem('darkTheme', false);

        switch(detectBrowserLanguage()) {
            case 'nl':
                localStorage.setItem('language', 'nl');
                break;
            case 'no':
                localStorage.setItem('language', 'no');
                break;
            case 'fr':
                localStorage.setItem('language', 'fr');
                break;
            default:
                localStorage.setItem('language', 'en');
        }

        // Finally we set this to true so it doesn't run the function on every load
        localStorage.setItem('firstRun', true);
        window.location.reload();
    }
}