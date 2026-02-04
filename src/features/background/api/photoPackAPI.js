import variables from 'config/variables';

const responseParser = {
  pexels: (data, query) => {
    const photos = data.photos || [];
    if (photos.length === 0) return null;
    const photo = photos[Math.floor(Math.random() * photos.length)];
    return {
      photographer: photo.photographer,
      location: photo.alt || query.get('query') || 'Unknown',
      url: { default: photo.src.original },
      blur_hash: null,
      colour: photo.avg_color,
      photo_page: photo.url,
      photographer_page: photo.photographer_url,
    };
  },

  pixabay: (data, query) => {
    const hits = data.hits || [];
    if (hits.length === 0) return null;
    const photo = hits[Math.floor(Math.random() * hits.length)];
    return {
      photographer: photo.user,
      location: photo.tags || query.get('q') || 'Unknown',
      url: { default: photo.largeImageURL || photo.webformatURL },
      blur_hash: null,
      colour: null,
      photo_page: photo.pageURL,
      photographer_page: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`,
    };
  },

  flickr: async (data, query, apiKey) => {
    const photos = data.photos?.photo || [];
    if (photos.length === 0) return null;
    const photo = photos[Math.floor(Math.random() * photos.length)];

    const infoParams = new URLSearchParams({
      method: 'flickr.photos.getInfo',
      api_key: apiKey,
      photo_id: photo.id,
      format: 'json',
      nojsoncallback: '1',
    });
    const infoResp = await fetch(`https://api.flickr.com/services/rest/?${infoParams}`);
    const info = await infoResp.json();

    return {
      photographer: info.photo?.owner?.realname || info.photo?.owner?.username || 'Unknown',
      location: info.photo?.title?._content || photo.title || 'Unknown',
      url: { default: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg` },
      blur_hash: null,
      colour: null,
      photo_page: `https://www.flickr.com/photos/${photo.owner}/${photo.id}/`,
      photographer_page: `https://www.flickr.com/photos/${photo.owner}/`,
    };
  },

  default: (data) => ({
    photographer: data.photographer,
    location: data.location?.name || data.location || 'Unknown',
    url: { default: data.file },
    blur_hash: data.blur_hash || null,
    colour: data.colour,
    ...(data.photo_page && { photo_page: data.photo_page }),
    ...(data.photographer_page && { photographer_page: data.photographer_page }),
    ...(data.category && { category: data.category }),
    ...(data.camera && { camera: data.camera }),
  }),
};

/**
 * Generic function to fetch photos from any API provider
 * Supports both direct API calls and backend proxy
 * @param {string} packId - The ID of the photo pack
 * @param {object} pack - The pack configuration with api_endpoint
 * @param {object} settings - Pack-specific settings
 * @returns {Promise<object|null>} Photo object or null on error
 */
export async function fetchFromProvider(packId, pack, settings) {
  if (!pack.api_endpoint) {
    console.error(`Pack ${packId} has no api_endpoint defined`);
    return null;
  }

  try {
    const params = new URLSearchParams();
    const headers = {};
    let apiKey = null;

    if (pack.direct_api) {
      switch (pack.api_provider) {
        case 'pexels':
          apiKey = settings[`photoPack_${packId}_api_key`];
          if (apiKey) headers['Authorization'] = atob(apiKey);
          params.append('query', settings[`photoPack_${packId}_query`] || 'nature');
          params.append('orientation', settings[`photoPack_${packId}_orientation`] || 'landscape');
          params.append('per_page', '80');
          params.append('page', Math.floor(Math.random() * 5) + 1);
          break;

        case 'pixabay':
          apiKey = settings[`photoPack_${packId}_api_key`];
          if (apiKey) params.append('key', atob(apiKey));
          params.append('q', settings[`photoPack_${packId}_query`] || 'nature');
          if (settings[`photoPack_${packId}_category`]) {
            params.append('category', settings[`photoPack_${packId}_category`]);
          }
          params.append('image_type', 'photo');
          params.append('orientation', 'horizontal');
          params.append('safesearch', 'true');
          params.append('per_page', '200');
          params.append('page', Math.floor(Math.random() * 3) + 1);
          break;

        case 'flickr':
          apiKey = settings[`photoPack_${packId}_api_key`];
          if (apiKey) params.append('api_key', atob(apiKey));
          params.append('method', 'flickr.photos.search');
          params.append('tags', settings[`photoPack_${packId}_tags`] || 'landscape');
          const license = settings[`photoPack_${packId}_license`] || 'all';
          const licenseMap = {
            'all': '1,2,3,4,5,6,7,8,9,10',
            'cc_by': '4',
            'cc_by_sa': '5',
            'cc_by_nc': '2',
            'cc_by_nd': '6',
            'cc0': '9,10',
          };
          params.append('license', licenseMap[license] || licenseMap['all']);
          params.append('sort', 'interestingness-desc');
          params.append('content_type', '1');
          params.append('media', 'photos');
          params.append('per_page', '500');
          params.append('page', Math.floor(Math.random() * 3) + 1);
          params.append('format', 'json');
          params.append('nojsoncallback', '1');
          break;
      }
    } else {
      pack.settings_schema?.forEach((setting) => {
        let value = settings[`photoPack_${packId}_${setting.id}`];
        if (setting.secure && value) {
          value = atob(value);
        }
        if (value !== undefined && value !== null && value !== '') {
          params.append(setting.id, value);
        }
      });
    }

    const url = `${pack.api_endpoint}?${params}`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`${pack.api_provider} rate limit hit`);
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    const parser = responseParser[pack.api_provider] || responseParser.default;
    return await parser(data, params, apiKey ? atob(apiKey) : null);

  } catch (error) {
    console.error(`Fetch from ${pack.api_provider} failed:`, error);
    return null;
  }
}

/**
 * @deprecated Legacy function - use fetchFromProvider instead
 * Kept for backwards compatibility
 */
export async function fetchFromMUE(packId, settings) {
  const pack = {
    api_endpoint: `${variables.constants.API_URL}/images/random`,
    api_provider: 'mue',
    settings_schema: [],
  };
  return fetchFromProvider(packId, pack, settings);
}

/**
 * @deprecated Legacy function - use fetchFromProvider instead
 * Kept for backwards compatibility
 */
export async function fetchFromUnsplash(packId, settings) {
  const pack = {
    api_endpoint: `${variables.constants.API_URL}/images/unsplash`,
    api_provider: 'unsplash',
    settings_schema: [],
  };
  return fetchFromProvider(packId, pack, settings);
}

/**
 * Fetch multiple photos for a pack and update cache
 * @param {string} packId - The ID of the photo pack to refresh
 * @returns {Promise<boolean>} Success status
 */
export async function refreshAPIPackCache(packId) {
  const installed = JSON.parse(localStorage.getItem('installed') || '[]');
  const pack = installed.find((p) => p.id === packId);

  if (!pack || !pack.api_enabled) return false;

  const settings = JSON.parse(localStorage.getItem(`photopack_settings_${packId}`) || '{}');

  const promises = Array.from({ length: 8 }, () => fetchFromProvider(packId, pack, settings));
  const results = await Promise.all(promises);
  const validPhotos = results.filter(Boolean);

  if (validPhotos.length === 0) {
    console.warn(`No photos fetched for pack ${packId}`);
    return false;
  }

  const apiPackCache = JSON.parse(localStorage.getItem('api_pack_cache') || '{}');
  apiPackCache[packId] = {
    photos: validPhotos,
    last_fetched: Date.now(),
    last_refresh_attempt: Date.now(),
  };

  try {
    localStorage.setItem('api_pack_cache', JSON.stringify(apiPackCache));
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      apiPackCache[packId].photos = validPhotos.slice(0, 5);
      localStorage.setItem('api_pack_cache', JSON.stringify(apiPackCache));
    }
    return false;
  }
}

/**
 * Check all API packs and refresh if needed
 * Supports per-pack cache_refresh_interval (default: 1 hour)
 */
export async function checkAndRefreshAPIPacks() {
  const apiPacksReady = JSON.parse(localStorage.getItem('api_packs_ready') || '[]');
  const apiPackCache = JSON.parse(localStorage.getItem('api_pack_cache') || '{}');
  const installed = JSON.parse(localStorage.getItem('installed') || '[]');

  const DEFAULT_CACHE_REFRESH_INTERVAL = 3600 * 1000; // 1 hour in milliseconds

  for (const packId of apiPacksReady) {
    const pack = installed.find((p) => p.id === packId);
    const cached = apiPackCache[packId];

    const refreshInterval = pack?.cache_refresh_interval
      ? pack.cache_refresh_interval * 1000
      : DEFAULT_CACHE_REFRESH_INTERVAL;

    const needsRefresh =
      !cached ||
      Date.now() - cached.last_fetched > refreshInterval ||
      cached.photos.length < 3;

    if (needsRefresh) {
      refreshAPIPackCache(packId).catch((error) => {
        console.error(`Failed to refresh ${packId}:`, error);
      });
    }
  }
}

/**
 * Build combined photo pool from static and API packs
 * @returns {Array} Combined array of photos from all sources
 */
export function buildPhotoPool() {
  const pool = [];
  const installed = JSON.parse(localStorage.getItem('installed') || '[]');
  const enabledPacks = JSON.parse(localStorage.getItem('enabledPacks') || '{}');
  const apiPacksReady = JSON.parse(localStorage.getItem('api_packs_ready') || '[]');
  const apiPackCache = JSON.parse(localStorage.getItem('api_pack_cache') || '{}');

  installed.forEach((pack) => {
    if (pack.type !== 'photos') return;

    const packId = pack.id || pack.name;
    if (enabledPacks[packId] === false) return;

    if (pack.api_enabled) {
      if (apiPacksReady.includes(pack.id)) {
        const cached = apiPackCache[pack.id];
        if (cached && cached.photos.length > 0) {
          cached.photos.forEach((photo) => {
            pool.push({
              ...photo,
              source: `api:${pack.api_provider}`,
              pack_id: pack.id,
            });
          });
        }
      }
    } else {
      pack.photos.forEach((photo) => {
        pool.push({
          photographer: photo.photographer,
          location: photo.location,
          url: photo.url,
          blur_hash: photo.blur_hash,
          source: 'static',
          pack_id: pack.id,
        });
      });
    }
  });

  return pool;
}
