import EventBus from 'utils/eventbus';

// todo: relocate these 2 functions
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showReminder() {
  document.querySelector('.reminder-info').style.display = 'flex';
  localStorage.setItem('showReminder', true);
}

export function install(type, input, sideload, collection) {
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
      if (!collection) {
        window.location.reload();
      }
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
    input.sideload = true;
  }

  installed.push(input);

  localStorage.setItem('installed', JSON.stringify(installed));
}
