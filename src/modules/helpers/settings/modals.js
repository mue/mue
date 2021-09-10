import variables from 'modules/variables';
import { toast } from 'react-toastify';

export function saveFile(data, filename = 'file') {
  if (typeof data === 'object') {
    data = JSON.stringify(data, undefined, 4);
  }
  
  const blob = new Blob([data], { type: 'text/json' });

  const event = document.createEvent('MouseEvents');
  const a = document.createElement('a');
  
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
  
  event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(event);
}

export function exportSettings() {
  const settings = {};
  Object.keys(localStorage).forEach((key) => {
    settings[key] = localStorage.getItem(key);
  });
  saveFile(settings, 'mue-settings.json');
  window.stats.postEvent('tab', 'Settings exported');
}

export function importSettings(e) {
  const getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  const languagecode = variables.languagecode;
  const content = JSON.parse(e.target.result);

  Object.keys(content).forEach((key) => {
    localStorage.setItem(key, content[key]);
  });

  toast(getMessage(languagecode, 'toats.imported'));
  window.stats.postEvent('tab', 'Settings imported');
}
