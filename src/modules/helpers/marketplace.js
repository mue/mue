import EventBus from './eventbus';

// based on https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
export function urlParser(input) {
  const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/;
  return input.replace(urlPattern, '<a href="$&" target="_blank">$&</a>');
}

export function uninstall(type, name) {
  switch (type) {
    case 'settings':
      const oldSettings = JSON.parse(localStorage.getItem('backup_settings'));
      localStorage.clear();
      oldSettings.forEach((item) => {
        localStorage.setItem(item.name, item.value);
      });
      break;
    case 'quotes':
      localStorage.removeItem('quote_packs');
      localStorage.removeItem('quoteAPI');
      localStorage.setItem('quoteType', localStorage.getItem('oldQuoteType'));
      localStorage.removeItem('oldQuoteType');
      EventBus.dispatch('refresh', 'marketplacequoteuninstall');
      break;
    case 'photos':
      localStorage.removeItem('photo_packs');
      localStorage.setItem('backgroundType', localStorage.getItem('oldBackgroundType'));
      localStorage.removeItem('oldBackgroundType');
      EventBus.dispatch('refresh', 'marketplacebackgrounduninstall');
      break;
    default:
      break;
  }

  let installed = JSON.parse(localStorage.getItem('installed'));
  for (let i = 0; i < installed.length; i++) {
    if (installed[i].name === name) {
      installed.splice(i, 1);
      break;
    }
  }
  localStorage.setItem('installed', JSON.stringify(installed));
};

export function install(type, input, sideload) {
  switch (type) {
    case 'settings':
      localStorage.removeItem('backup_settings');

      let oldSettings = [];
      Object.keys(localStorage).forEach((key) => {
        oldSettings.push({
          name: key,
          value: localStorage.getItem(key)
        });
      });

      localStorage.setItem('backup_settings', JSON.stringify(oldSettings));
      Object.keys(input.settings).forEach((key) => {
        localStorage.setItem(key, input.settings[key]);
      });
      break;

    case 'photos':
      localStorage.setItem('photo_packs', JSON.stringify(input.photos));
      localStorage.setItem('oldBackgroundType', localStorage.getItem('backgroundType'));
      localStorage.setItem('backgroundType', 'photo_pack');
      EventBus.dispatch('refresh', 'background');
      break;

    case 'quotes':
      if (input.quote_api) {
        localStorage.setItem('quoteAPI', JSON.stringify(input.quote_api));
      }

      localStorage.setItem('quote_packs', JSON.stringify(input.quotes));
      localStorage.setItem('oldQuoteType', localStorage.getItem('quoteType'));
      localStorage.setItem('quoteType', 'quote_pack');
      EventBus.dispatch('refresh', 'quote');
      break;
    default:
      break;
  }

  const installed = JSON.parse(localStorage.getItem('installed'));

  if (sideload) {
    installed.push({
      content: {
        updated: 'Unpublished',
        data: input
      }
    });
  } else {
    installed.push(input);
  }

  localStorage.setItem('installed', JSON.stringify(installed));
};
