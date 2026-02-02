import EventBus from 'utils/eventbus';
import { clearQueuesOnSettingChange } from 'utils/queueOperations';
import variables from 'config/variables';

// todo: relocate this function
function showReminder() {
  document.querySelector('.reminder-info').style.display = 'flex';
  localStorage.setItem('showReminder', true);
}

/**
 * Track download count in the API
 */
async function trackDownload(itemId) {
  if (!itemId) return;

  try {
    await fetch(`${variables.constants.API_URL}/marketplace/item/${itemId}/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.debug('Failed to track download:', error);
  }
}

export function install(type, input, sideload, collection) {
  let refreshEvent = null;

  // Check if item is already installed to determine if we should track download
  const installed = JSON.parse(localStorage.getItem('installed') || '[]');
  const isNewInstall = !installed.some((item) => item.id === input.id || item.name === input.name);

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
      const hadPhotoPacks = currentPhotos.length > 0;
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
      clearQueuesOnSettingChange('packInstall');
      // Only refresh background if this is the first photo pack being installed
      // Otherwise just update the queue without jarring the user with an immediate refresh
      if (!hadPhotoPacks) {
        refreshEvent = 'backgroundrefresh';
      }
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
      // Clear quote queue and cache when installing new quote packs
      localStorage.removeItem('quoteQueue');
      localStorage.removeItem('currentQuote');
      refreshEvent = 'quote';
      break;
    }

    default:
      break;
  }

  if (sideload) {
    input.sideload = true;
  }

  installed.push(input);

  localStorage.setItem('installed', JSON.stringify(installed));

  // Track download for new installs (not re-installs)
  if (isNewInstall && input.id) {
    trackDownload(input.id);
  }

  // Emit refresh event after all data is saved
  if (refreshEvent) {
    EventBus.emit('refresh', refreshEvent);
  }
}
