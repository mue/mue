import EventBus from 'utils/eventbus';

// todo: relocate this function
function showReminder() {
  document.querySelector('.reminder-info').style.display = 'flex';
  localStorage.setItem('showReminder', true);
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
