import EventBus from './eventbus';

function showReminder() {
  document.querySelector('.reminder-info').style.display = 'flex';
  localStorage.setItem('showReminder', true);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// based on https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
export function urlParser(input) {
  const urlPattern =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/;
  return input.replace(urlPattern, '<br/><a class="link" href="$&" target="_blank">$&</a>');
}

export function install(type, input, sideload) {
  switch (type) {
    case 'settings':
      localStorage.removeItem('backup_settings');

      let oldSettings = [];
      Object.keys(localStorage).forEach((key) => {
        oldSettings.push({
          name: key,
          value: localStorage.getItem(key),
        });
      });

      localStorage.setItem('backup_settings', JSON.stringify(oldSettings));
      Object.keys(input.settings).forEach((key) => {
        localStorage.setItem(key, input.settings[key]);
      });
      showReminder();
      break;

    case 'photos':
      const currentPhotos = JSON.parse(localStorage.getItem('photo_packs')) || [];
      input.photos.forEach((photo) => {
        currentPhotos.push(photo);
      });
      localStorage.setItem('photo_packs', JSON.stringify(currentPhotos));

      if (localStorage.getItem('backgroundType') !== 'photo_pack') {
        localStorage.setItem('oldBackgroundType', localStorage.getItem('backgroundType'));
      }
      localStorage.setItem('backgroundType', 'photo_pack');
      localStorage.removeItem('backgroundchange');
      EventBus.emit('refresh', 'background');
      // TODO: make this legitimately good and work without a reload - currently we just refresh
      sleep(4000);
      window.location.reload();
      break;

    case 'quotes':
      const currentQuotes = JSON.parse(localStorage.getItem('quote_packs')) || [];
      input.quotes.forEach((quote) => {
        currentQuotes.push(quote);
      });
      localStorage.setItem('quote_packs', JSON.stringify(currentQuotes));

      if (localStorage.getItem('quoteType') !== 'quote_pack') {
        localStorage.setItem('oldQuoteType', localStorage.getItem('quoteType'));
      }
      localStorage.setItem('quoteType', 'quote_pack');
      localStorage.removeItem('quotechange');
      EventBus.emit('refresh', 'quote');
      break;

    default:
      break;
  }

  const installed = JSON.parse(localStorage.getItem('installed'));

  if (sideload) {
    installed.push({
      content: {
        updated: 'Unpublished',
        data: input,
      },
    });
  } else {
    installed.push(input);
  }

  localStorage.setItem('installed', JSON.stringify(installed));
}

export function uninstall(type, name) {
  let installedContents, packContents;
  switch (type) {
    case 'settings':
      const oldSettings = JSON.parse(localStorage.getItem('backup_settings'));
      localStorage.clear();
      oldSettings.forEach((item) => {
        localStorage.setItem(item.name, item.value);
      });
      showReminder();
      break;

    case 'quotes':
      installedContents = JSON.parse(localStorage.getItem('quote_packs'));
      packContents = JSON.parse(localStorage.getItem('installed')).find(
        (content) => content.name === name,
      );
      installedContents.forEach((item, index) => {
        const exists = packContents.quotes.find(
          (content) => content.quote === item.quote || content.author === item.author,
        );
        if (exists !== undefined) {
          installedContents.splice(index, 1);
        }
      });
      localStorage.setItem('quote_packs', JSON.stringify(installedContents));
      if (installedContents.length === 0) {
        localStorage.setItem('quoteType', localStorage.getItem('oldQuoteType') || 'api');
        localStorage.removeItem('oldQuoteType');
        localStorage.removeItem('quote_packs');
      }
      localStorage.removeItem('quotechange');
      EventBus.emit('refresh', 'marketplacequoteuninstall');
      break;

    case 'photos':
      installedContents = JSON.parse(localStorage.getItem('photo_packs'));
      packContents = JSON.parse(localStorage.getItem('installed')).find(
        (content) => content.name === name,
      );
      installedContents.forEach((item, index) => {
        const exists = packContents.photos.find((content) => content.photo === item.photo);
        if (exists !== undefined) {
          installedContents.splice(index, 1);
        }
      });
      localStorage.setItem('photo_packs', JSON.stringify(installedContents));
      if (installedContents.length === 0) {
        localStorage.setItem('backgroundType', localStorage.getItem('oldBackgroundType') || 'api');
        localStorage.removeItem('oldBackgroundType');
        localStorage.removeItem('photo_packs');
      }
      localStorage.removeItem('backgroundchange');
      EventBus.emit('refresh', 'marketplacebackgrounduninstall');
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
}
