import variables from 'config/variables';
import { refreshAPIPackCache } from 'features/background/api/photoPackAPI';

const DEFAULT_PHOTO_PACKS = [
  { id: 'd58909e759ec', enabled: true },
  { id: 'c0094361594f', enabled: false },
];

export async function installDefaultPhotoPacks() {
  if (localStorage.getItem('defaultPacksNeedInstall') !== 'true') {
    return;
  }

  const installed = [];
  const enabledPacks = {};

  for (const pack of DEFAULT_PHOTO_PACKS) {
    try {
      const response = await fetch(`${variables.constants.API_URL}/marketplace/item/${pack.id}`);
      const { data } = await response.json();

      if (data && data.type === 'photos') {
        installed.push(data);
        enabledPacks[data.id] = pack.enabled;

        if (data.api_enabled) {
          const defaultSettings = {};
          data.settings_schema?.forEach((field) => {
            defaultSettings[field.key] = field.default || '';
          });
          localStorage.setItem(`photopack_settings_${data.id}`, JSON.stringify(defaultSettings));

          const apiPackCache = JSON.parse(localStorage.getItem('api_pack_cache') || '{}');
          apiPackCache[data.id] = {
            photos: [],
            last_fetched: 0,
            last_refresh_attempt: 0,
          };
          localStorage.setItem('api_pack_cache', JSON.stringify(apiPackCache));

          if (pack.enabled && !data.requires_api_key) {
            refreshAPIPackCache(data.id);
          }
        }
      }
    } catch (error) {
      console.error(`Failed to install default pack ${pack.id}:`, error);
    }
  }

  if (installed.length > 0) {
    const existingInstalled = JSON.parse(localStorage.getItem('installed') || '[]');
    localStorage.setItem('installed', JSON.stringify([...existingInstalled, ...installed]));

    const existingEnabledPacks = JSON.parse(localStorage.getItem('enabledPacks') || '{}');
    localStorage.setItem(
      'enabledPacks',
      JSON.stringify({ ...existingEnabledPacks, ...enabledPacks }),
    );

    localStorage.removeItem('defaultPacksNeedInstall');
    window.dispatchEvent(new Event('installedAddonsChanged'));
  }
}
