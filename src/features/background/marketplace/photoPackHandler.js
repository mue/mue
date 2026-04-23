import { clearQueuesOnSettingChange } from 'utils/queueOperations';
import { refreshAPIPackCache } from 'features/background/api/photoPackAPI';

export const photoPackHandler = {
  install: (packData, context) => {
    console.log(`[Photo Handler] Installing ${packData.display_name || packData.name}`, {
      api_enabled: packData.api_enabled,
      requires_api_key: packData.requires_api_key,
      photo_count: packData.photos?.length,
      isNewInstall: context.isNewInstall,
    });

    const currentPhotos = JSON.parse(localStorage.getItem('photo_packs')) || [];
    const hadPhotoPacks = currentPhotos.length > 0;

    if (packData.api_enabled) {
      console.log(`[Photo Handler] Setting up API pack ${packData.id}`);
      const defaultSettings = {};
      packData.settings_schema?.forEach((field) => {
        defaultSettings[field.id] = field.default || '';
      });
      localStorage.setItem(`photopack_settings_${packData.id}`, JSON.stringify(defaultSettings));

      const apiPackCache = JSON.parse(localStorage.getItem('api_pack_cache') || '{}');
      apiPackCache[packData.id] = {
        photos: [],
        last_fetched: 0,
        last_refresh_attempt: 0,
      };
      localStorage.setItem('api_pack_cache', JSON.stringify(apiPackCache));

      if (!currentPhotos.length) {
        localStorage.setItem('photo_packs', JSON.stringify([]));
      }

      if (!packData.requires_api_key) {
        console.log(`[Photo Handler] Refreshing API cache for ${packData.id}`);
        refreshAPIPackCache(packData.id);
      }
    } else {
      console.log(`[Photo Handler] Adding ${packData.photos.length} static photos to pool`);
      packData.photos.forEach((photo) => {
        currentPhotos.push(photo);
      });
      localStorage.setItem('photo_packs', JSON.stringify(currentPhotos));
      console.log(`[Photo Handler] Photo pool now has ${currentPhotos.length} photos`);
    }

    if (localStorage.getItem('backgroundType') !== 'photo_pack') {
      localStorage.setItem('oldBackgroundType', localStorage.getItem('backgroundType'));
    }
    localStorage.setItem('backgroundType', 'photo_pack');
    localStorage.removeItem('backgroundchange');
    clearQueuesOnSettingChange('packInstall');

    const backgroundElement = document.getElementById('backgroundImage');
    const hasBackground = backgroundElement && backgroundElement.style.backgroundImage;

    console.log(`[Photo Handler] Background check:`, {
      elementExists: !!backgroundElement,
      hasBackgroundImage: !!hasBackground,
      willRefresh: !hasBackground,
    });

    return {
      refreshEvent: !hasBackground ? 'backgroundrefresh' : null,
    };
  },

  uninstall: (packData, context) => {
    let installedContents = JSON.parse(localStorage.getItem('photo_packs')) || [];

    if (packData) {
      if (packData.api_enabled) {
        const apiPackCache = JSON.parse(localStorage.getItem('api_pack_cache') || '{}');
        delete apiPackCache[packData.id];
        localStorage.setItem('api_pack_cache', JSON.stringify(apiPackCache));

        const apiPacksReady = JSON.parse(localStorage.getItem('api_packs_ready') || '[]');
        const filtered = apiPacksReady.filter((id) => id !== packData.id);
        localStorage.setItem('api_packs_ready', JSON.stringify(filtered));
      } else if (packData.photos) {
        installedContents = installedContents.filter((item) => {
          return !packData.photos.some((content) => content.url?.default === item.url?.default);
        });
        localStorage.setItem('photo_packs', JSON.stringify(installedContents));
      }
    }

    const remainingInstalled = JSON.parse(localStorage.getItem('installed')).filter(
      (item) => item.type === 'photos' && item.name !== context.name,
    );

    if (remainingInstalled.length === 0) {
      localStorage.setItem('backgroundType', localStorage.getItem('oldBackgroundType') || 'api');
      localStorage.removeItem('oldBackgroundType');
      localStorage.removeItem('photo_packs');
    }

    localStorage.removeItem('backgroundchange');
    clearQueuesOnSettingChange('packUninstall');

    return { refreshEvent: null };
  },
};
