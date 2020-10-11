const defaultSettings = require('./defaultSettings.json');

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
};

export default class SettingsFunctions {
    static exportSettings() {
        let settings = {};
        for (const key of Object.keys(localStorage)) settings[key] = localStorage.getItem(key);
        saveFile(settings, 'mue-settings.json');
    }

    static setItem(key, value) {
        const old = localStorage.getItem(key);
        let val = true;

        if (old !== null && !value) {
            if (old === 'true') val = false;
            if (old === 'false') val = true;
        }

        localStorage.setItem(key, val);
    }

    static setSearchEngine(input) {
        const searchEngineInput = document.getElementById('searchEngineInput');
        if (input === 'custom') {
            searchEngineInput.enabled = 'true';
            searchEngineInput.style.display = 'block';
        } else {
            searchEngineInput.style.display = 'none';
            searchEngineInput.enabled = 'false';
            localStorage.setItem('searchEngine', input);
        }
    }

    static saveStuff() {
        localStorage.setItem('blur', document.getElementById('blurRange').value);  // this is better than inline onChange for performance
        localStorage.setItem('brightness', document.getElementById('brightnessRange').value);
        localStorage.setItem('greetingName', document.getElementById('greetingName').value);
        localStorage.setItem('customBackground', document.getElementById('customBackground').value);
        if (document.getElementById('customBackgroundHex').value !== 'Disabled') {
            localStorage.setItem('customBackgroundColour', document.getElementById('customBackgroundHex').value);
        }
        if (document.getElementById('searchEngineInput').enabled === 'true') {
            const input = document.getElementById('customSearchEngine').value;
            if (input) {
                localStorage.setItem('searchEngine', 'custom');
                localStorage.setItem('customSearchEngine', input);
            }
        }
        window.location.reload();
    }

    static setDefaultSettings() {
        localStorage.clear();
        defaultSettings.forEach((element) => localStorage.setItem(element.name, element.value));

        // Set theme depending on user preferred
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) localStorage.setItem('darkTheme', true);
        else localStorage.setItem('darkTheme', false);

        // Webp support
        const supportsWebP = require('supports-webp'); // We import it here so it doesn't run the function on each page load
        if (supportsWebP) localStorage.setItem('supportswebp', 'true');

        // Languages
        const languages = ['nl', 'no', 'fr', 'ru'];
        const browserLanguage = (navigator.languages && navigator.languages[0]) || navigator.language;
        if (languages.includes(browserLanguage)) {
            localStorage.setItem('language', browserLanguage);
            document.documentElement.lang = browserLanguage;
        } else localStorage.setItem('language', 'en');

        // Finally we set this to true so it doesn't run the function on every load
        localStorage.setItem('firstRun', true);
        window.location.reload();
    }
}