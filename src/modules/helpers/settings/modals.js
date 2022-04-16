import variables from 'modules/variables';
import { toast } from 'react-toastify';

const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

export function saveFile(data, filename = 'file', type = 'text/json') {
  if (typeof data === 'object') {
    data = JSON.stringify(data, undefined, 4);
  }

  const blob = new Blob([data], { type });

  const event = document.createEvent('MouseEvents');
  const a = document.createElement('a');

  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.dataset.downloadurl = [type, a.download, a.href].join(':');

  // i need to see what all this actually does, i think wessel wrote this function
  event.initMouseEvent(
    'click',
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
  );
  a.dispatchEvent(event);
}

export function exportSettings() {
  const settings = {};

  Object.keys(localStorage).forEach((key) => {
    settings[key] = localStorage.getItem(key);
  });

  // i think a good improvement would be to make the file names more descriptive, or allow for saving as custom
  // otherwise you'll end up with mue-settings (6000).json and have absolutely no idea what any of them are for
  saveFile(settings, 'mue-settings.json');
  variables.stats.postEvent('tab', 'Settings exported');
}

export function importSettings(e) {
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
      { value: 400, label: '4x' },
    ],
    pomodoroWork: [
      { value: 5, label: '5m' },
      { value: 25, label: '25m' },
      { value: 45, label: '45m' },
      { value: 60, label: '60m' },
    ],
    pomodoroBreak: [
      { value: 1, label: '1s' },
      { value: 5, label: '5m' },
      { value: 25, label: '25m' },
      { value: 45, label: '45m' },
    ],
    toast: [
      { value: 500, label: '0.5s' },
      { value: 1000, label: '1s' },
      { value: 1500, label: '1.5s' },
      { value: 2000, label: '2s' },
      { value: 2500, label: '2.5s' },
      { value: 3000, label: '3s' },
      { value: 4000, label: '4s' },
      { value: 5000, label: '5s' },
    ],
    background: [
      { value: 0, label: '0%' },
      { value: 25, label: '25%' },
      { value: 50, label: '50%' },
      { value: 75, label: '75%' },
      { value: 100, label: '100%' },
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
      { value: 5000, label: '5s' },
    ],
  };

  return marks[type];
}
