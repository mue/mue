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
  variables.stats.postEvent('tab', 'Settings exported');
}

export function importSettings(e) {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);
  const content = JSON.parse(e.target.result);

  Object.keys(content).forEach((key) => {
    localStorage.setItem(key, content[key]);
  });

  toast(getMessage('toasts.imported'));
  variables.stats.postEvent('tab', 'Settings imported');
}

export function values(type) {
  const marks = {
    zoom: [
      { value: 10, label: '0.1x' }, 
      { value: 100, label: '1x' }, 
      { value: 200, label: '2x' }, 
      { value: 400, label: '4x' }
    ],
    toast: [
      { value: 500, label: '0.5s' }, 
      { value: 1000, label: '1s' }, 
      { value: 1500, label: '1.5s' }, 
      { value: 2000, label: '2s' }, 
      { value: 2500, label: '2.5s' }, 
      { value: 3000, label: '3s' }, 
      { value: 4000, label: '4s' }, 
      { value: 5000, label: '5s'}
    ],
    background: [
      { value: 0, label: '0%'}, 
      { value: 25, label: '25%' }, 
      { value: 50, label: '50%' }, 
      { value: 75, label: '75%' }, 
      { value: 100, label: '100%' }
    ],
    experimental: [
      { value: 0, label: '0s' },
      { value: 500, label: '0.5s' }, 
      { value: 1000, label: '1s' }, 
      { value: 1500, label: '1.5s' }, 
      { value: 2000, label: '2s' }, 
      { value: 2500, label: '2.5s' }, 
      { value: 3000, label: '3s' }, 
      { value: 4000, label: '4s' }, 
      { value: 5000, label: '5s'}
    ]
  };

  return marks[type];
}
