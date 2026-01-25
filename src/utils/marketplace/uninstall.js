import EventBus from 'utils/eventbus';

// todo: relocate this function
function showReminder() {
  document.querySelector('.reminder-info').style.display = 'flex';
  localStorage.setItem('showReminder', true);
}

export function uninstall(type, name) {
  let installedContents, packContents;
  let refreshEvent = null;

  switch (type) {
    case 'settings': {
      const oldSettings = JSON.parse(localStorage.getItem('backup_settings'));
      localStorage.clear();
      oldSettings.forEach((item) => {
        localStorage.setItem(item.name, item.value);
      });
      showReminder();
      break;
    }

    case 'quotes':
      installedContents = JSON.parse(localStorage.getItem('quote_packs')) || [];
      packContents = JSON.parse(localStorage.getItem('installed')).find(
        (content) => content.name === name,
      );
      if (packContents && packContents.quotes) {
        installedContents = installedContents.filter((item) => {
          return !packContents.quotes.some(
            (content) => content.quote === item.quote && content.author === item.author,
          );
        });
      }
      localStorage.setItem('quote_packs', JSON.stringify(installedContents));
      if (installedContents.length === 0) {
        localStorage.setItem('quoteType', localStorage.getItem('oldQuoteType') || 'api');
        localStorage.removeItem('oldQuoteType');
        localStorage.removeItem('quote_packs');
      }
      localStorage.removeItem('quotechange');
      refreshEvent = 'marketplacequoteuninstall';
      break;

    case 'photos':
      installedContents = JSON.parse(localStorage.getItem('photo_packs')) || [];
      packContents = JSON.parse(localStorage.getItem('installed')).find(
        (content) => content.name === name,
      );
      if (packContents && packContents.photos) {
        installedContents = installedContents.filter((item) => {
          return !packContents.photos.some(
            (content) => content.url?.default === item.url?.default,
          );
        });
      }
      localStorage.setItem('photo_packs', JSON.stringify(installedContents));
      if (installedContents.length === 0) {
        // Switch back to old background type or default to mue api
        localStorage.setItem('backgroundType', localStorage.getItem('oldBackgroundType') || 'api');
        localStorage.removeItem('oldBackgroundType');
        localStorage.removeItem('photo_packs');
      }
      localStorage.removeItem('backgroundchange');
      // Clear image queue to ensure fresh background loads
      localStorage.removeItem('imageQueue');
      // Set refresh event to emit after installed data is saved
      refreshEvent = 'marketplacebackgrounduninstall';
      break;

    default:
      break;
  }

  const installed = JSON.parse(localStorage.getItem('installed'));
  for (let i = 0; i < installed.length; i++) {
    if (installed[i].name === name) {
      // Track uninstalled pack IDs to prevent auto-reinstall
      if (installed[i].id) {
        const uninstalledPacks = JSON.parse(localStorage.getItem('uninstalledPacks') || '[]');
        if (!uninstalledPacks.includes(installed[i].id)) {
          uninstalledPacks.push(installed[i].id);
          localStorage.setItem('uninstalledPacks', JSON.stringify(uninstalledPacks));
        }
      }
      installed.splice(i, 1);
      break;
    }
  }

  localStorage.setItem('installed', JSON.stringify(installed));

  // Emit refresh event after all data is saved
  if (refreshEvent) {
    EventBus.emit('refresh', refreshEvent);
  }
}
