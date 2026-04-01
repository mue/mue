import EventBus from 'utils/eventbus';
import { clearQueuesOnSettingChange } from 'utils/queueOperations';
import variables from 'config/variables';
import { refreshAPIPackCache } from 'features/background/api/photoPackAPI';
import { getHandler } from './handlerRegistry';

function showReminder() {
  localStorage.setItem('showReminder', 'true');
  EventBus.emit('showReminder');
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
  console.log(`[Install] Installing ${type}: ${input.display_name || input.name}`, {
    sideload,
    collection,
    id: input.id,
  });

  const installed = JSON.parse(localStorage.getItem('installed') || '[]');
  const isNewInstall = !installed.some((item) => item.id === input.id || item.name === input.name);

  console.log(`[Install] isNewInstall: ${isNewInstall}`);

  // Prevent duplicate installations - if pack already exists, skip
  if (!isNewInstall) {
    console.log(`[Install] Pack ${input.display_name || input.name} already installed, skipping`);
    return;
  }

  let refreshEvent = null;

  const handler = getHandler(type);
  if (handler) {
    console.log(`[Install] Using handler for type: ${type}`);
    const result = handler.install(input, { isNewInstall, installed });
    refreshEvent = result.refreshEvent;
  } else {
    console.log(`[Install] No handler found, using fallback switch for type: ${type}`);
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

        if (input.api_enabled) {
          const defaultSettings = {};
          input.settings_schema?.forEach((field) => {
            defaultSettings[field.key] = field.default || '';
          });
          localStorage.setItem(`photopack_settings_${input.id}`, JSON.stringify(defaultSettings));

          const apiPackCache = JSON.parse(localStorage.getItem('api_pack_cache') || '{}');
          apiPackCache[input.id] = {
            photos: [],
            last_fetched: 0,
            last_refresh_attempt: 0,
          };
          localStorage.setItem('api_pack_cache', JSON.stringify(apiPackCache));

          if (!currentPhotos.length) {
            localStorage.setItem('photo_packs', JSON.stringify([]));
          }

          if (!input.requires_api_key) {
            refreshAPIPackCache(input.id);
          }
        } else {
          input.photos.forEach((photo) => {
            currentPhotos.push(photo);
          });
          localStorage.setItem('photo_packs', JSON.stringify(currentPhotos));
        }

        if (localStorage.getItem('backgroundType') !== 'photo_pack') {
          localStorage.setItem('oldBackgroundType', localStorage.getItem('backgroundType'));
        }
        localStorage.setItem('backgroundType', 'photo_pack');
        localStorage.removeItem('backgroundchange');
        clearQueuesOnSettingChange('packInstall');

        const backgroundElement = document.getElementById('backgroundImage');
        const hasBackground = backgroundElement && backgroundElement.style.backgroundImage;
        if (!hasBackground) {
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
        localStorage.removeItem('quoteQueue');
        localStorage.removeItem('currentQuote');
        refreshEvent = 'quote';
        break;
      }

      default:
        break;
    }
  }

  if (sideload) {
    input.sideload = true;
  }

  installed.push(input);

  localStorage.setItem('installed', JSON.stringify(installed));
  console.log(`[Install] Updated installed list, count: ${installed.length}`);

  if (isNewInstall) {
    const packId = input.id || input.name;
    const enabledPacks = JSON.parse(localStorage.getItem('enabledPacks') || '{}');
    enabledPacks[packId] = true;
    localStorage.setItem('enabledPacks', JSON.stringify(enabledPacks));
    console.log(`[Install] Set pack ${packId} as enabled`);
  }

  // Track download regardless of whether it's a new install or reinstall
  // This ensures download counts are accurate even after architectural changes
  if (input.id) {
    trackDownload(input.id);
  }

  if (refreshEvent) {
    console.log(`[Install] Emitting refresh event: ${refreshEvent}`);
    EventBus.emit('refresh', refreshEvent);
  }

  console.log(`[Install] Installation complete for ${input.display_name || input.name}`);
}
