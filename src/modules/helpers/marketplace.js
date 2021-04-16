import { toast } from 'react-toastify';

import EventBus from './eventbus';

export default class MarketplaceFunctions {
  // based on https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
  static urlParser (input) {
    const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/;
    return input.replace(urlPattern, '<a href="$&" target="_blank">$&</a>');
  }

  static uninstall(name, type) {
    switch (type) {
      case 'settings':
        const oldSettings = JSON.parse(localStorage.getItem('backup_settings'));
        localStorage.clear();
        oldSettings.forEach((item) => localStorage.setItem(item.name, item.value));
        break;
      case 'quote_packs':
        localStorage.removeItem('quote_packs');
        localStorage.removeItem('quoteAPI');
        break;
      case 'photos':
      case 'photo_packs':
        localStorage.removeItem('photo_packs');
        localStorage.setItem('backgroundType', localStorage.getItem('oldBackgroundType'));
        localStorage.removeItem('oldBackgroundType');
        EventBus.dispatch('refresh', 'marketplacebackgrounduninstall');
        break;
      default:
        try {
          localStorage.removeItem(type);
        } catch (e) {
          toast('Failed to uninstall addon, check the console');
          console.error(e);
        }
    }

    let installed = JSON.parse(localStorage.getItem('installed'));
    for (let i = 0; i < installed.length; i++) {
      if (installed[i].name === name) {
        installed.splice(i, 1);
        break;
      }
    }
    localStorage.setItem('installed', JSON.stringify(installed));
  }

  static install(type, input, sideload) {
    switch (type) {
      case 'settings':
        localStorage.removeItem('backup_settings');

        let oldSettings = [];
        for (const key of Object.keys(localStorage)) {
          oldSettings.push({
            name: key,
            value: localStorage.getItem(key)
          });
        }

        localStorage.setItem('backup_settings', JSON.stringify(oldSettings));
        input.settings.forEach((element) => localStorage.setItem(element.name, element.value));
        break;

      case 'photos':
      case 'photo_packs':
        localStorage.setItem('photo_packs', JSON.stringify(input.photos));
        localStorage.setItem('oldBackgroundType', localStorage.getItem('backgroundType'));
        localStorage.setItem('backgroundType', 'photo_pack');
        EventBus.dispatch('refresh', 'background');
        break;

      case 'quote_packs':
        if (input.quote_api) {
          localStorage.setItem('quoteAPI', JSON.stringify(input.quote_api));
        }

        localStorage.setItem('quote_packs', JSON.stringify(input.quotes));
        break;
      default:
        break;
    }

    let installed = JSON.parse(localStorage.getItem('installed'));

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
  }
}
