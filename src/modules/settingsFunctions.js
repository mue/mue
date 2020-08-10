function saveFile(data, filename = 'file') {
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

export function exportSettings() {
    let settings = {};
    for (const key of Object.keys(localStorage)) settings[key] = localStorage.getItem(key);
    saveFile(settings, 'mue-settings.json');
}

export function setItem(key, value) {
    let old = localStorage.getItem(key);
    let val = true;

    if (old !== null && !value) {
        if (old === 'true') val = false;
        if (old === 'false') val = true;
    }

    localStorage.setItem(key, val);
}

export function toggleExtra(element, element2) {
    (element.style.display === 'none' || !element.style.display) ? element.style.display = 'block' : element.style.display = 'none';
    (element2.style.transform === 'rotate(-180deg)') ? element2.style.transform = 'rotate(0)' : element2.style.transform = 'rotate(-180deg)';
}

export function setSearchEngine(input) {
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

export function saveStuff() {
    localStorage.setItem('blur', document.getElementById('blurRange').value); // this is better than inline onChange for performance
    localStorage.setItem('greetingName', document.getElementById('greetingName').value);
    localStorage.setItem('customBackground', document.getElementById('customBackground').value);
    if (!document.getElementById('searchEngineInput').enabled === 'false') {
      localStorage.setItem('customSearchEngine', document.getElementById('searchEngineInput').value);
    }
    window.location.reload();
}