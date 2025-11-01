import EventBus from 'utils/eventbus';

// todo: relocate this function
function showReminder() {
  document.querySelector('.reminder-info').style.display = 'flex';
  localStorage.setItem('showReminder', true);
}

export function install(type, input, sideload, collection) {
  let refreshEvent = null;

  switch (type) {
    case 'settings': {
      localStorage.removeItem('backup_settings');

      const oldSettings = [];
      Object.keys(localStorage).forEach((key) => {
        oldSettings.push({ name: key, value: localStorage.getItem(key) });
      });

      localStorage.setItem('backup_settings', JSON.stringify(oldSettings));
      Object.keys(input.settings).forEach((key) => {
        localStorage.setItem(key, input.settings[key]);
      });
      showReminder();
      break;
    }

    case 'photos': {
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
      // Clear image queue to ensure fresh background loads
      localStorage.removeItem('imageQueue');
      // Set refresh event to emit after installed data is saved
      refreshEvent = 'backgroundrefresh';
      break;
    }

    case 'quotes': {
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
      refreshEvent = 'quote';
      break;
    }

    default:
      break;
  }

  const installed = JSON.parse(localStorage.getItem('installed'));

  if (sideload) {
    input.sideload = true;
  }

  installed.push(input);

  localStorage.setItem('installed', JSON.stringify(installed));

  // Emit refresh event after all data is saved
  if (refreshEvent) {
    EventBus.emit('refresh', refreshEvent);
  }
}
