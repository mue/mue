import { toast } from 'react-toastify';

export function saveFile(data, filename = 'file') {
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
}

export function exportSettings() {
  let settings = {};
  Object.keys(localStorage).forEach((key) => {
      settings[key] = localStorage.getItem(key);
  });
  saveFile(settings, 'mue-settings.json');
  window.stats.postEvent('tab', 'Settings exported');
};

export function importSettings(e) {
  const content = JSON.parse(e.target.result);

  Object.keys(content).forEach((key) => {
    localStorage.setItem(key, content[key]);
  });

  toast(window.language.toasts.imported);
  window.stats.postEvent('tab', 'Settings imported');
};
