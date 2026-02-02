import variables from 'config/variables';

/**
 * Fetch photos from MUE API based on pack settings
 * @param {string} packId - The ID of the photo pack
 * @param {object} settings - Pack-specific settings
 * @returns {Promise<object|null>} Photo object or null on error
 */
export async function fetchFromMUE(packId, settings) {
  const { quality, categories } = settings;

  const params = new URLSearchParams({
    quality: quality || 'high',
    categories: (categories || []).join(','),
  });

  try {
    const response = await fetch(`${variables.constants.API_URL}/images/random?${params}`);

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();

    return {
      photographer: data.photographer,
      location: data.location?.name || 'Unknown',
      url: { default: data.file },
      blur_hash: data.blur_hash,
      colour: data.colour,
      category: data.category,
      camera: data.camera,
    };
  } catch (error) {
    console.error('MUE API fetch failed:', error);
    return null;
  }
}

/**
 * Fetch photos from Unsplash API
 * @param {string} packId - The ID of the photo pack
 * @param {object} settings - Pack-specific settings (must include api_key)
 * @returns {Promise<object|null>} Photo object or null on error
 */
export async function fetchFromUnsplash(packId, settings) {
  const { api_key, collections } = settings;

  if (!api_key) {
    console.warn('Unsplash API key not configured');
    return null;
  }

  // Deobfuscate API key
  const decodedKey = atob(api_key);

  const params = new URLSearchParams({
    orientation: 'landscape',
  });

  if (collections) {
    params.append('collections', collections);
  }

  try {
    const response = await fetch(`https://api.unsplash.com/photos/random?${params}`, {
      headers: {
        Authorization: `Client-ID ${decodedKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Unsplash rate limit hit');
      }
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      photographer: data.user.name,
      location: data.location?.title || 'Unknown',
      url: { default: data.urls.regular },
      blur_hash: data.blur_hash,
      colour: data.color,
      unsplash_url: data.links.html,
      photographer_url: data.user.links.html,
    };
  } catch (error) {
    console.error('Unsplash API fetch failed:', error);
    return null;
  }
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

  const fetchFunction = pack.api_provider === 'mue' ? fetchFromMUE : fetchFromUnsplash;

  // Fetch 8 photos
  const promises = Array.from({ length: 8 }, () => fetchFunction(packId, settings));
  const results = await Promise.all(promises);
  const validPhotos = results.filter(Boolean);

  if (validPhotos.length === 0) {
    console.warn(`No photos fetched for pack ${packId}`);
    return false;
  }

  // Update cache
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
      // Keep only 5 most recent photos
      apiPackCache[packId].photos = validPhotos.slice(0, 5);
      localStorage.setItem('api_pack_cache', JSON.stringify(apiPackCache));
    }
    return false;
  }
}

/**
 * Check all API packs and refresh if needed
 * Hardcoded 1 hour refresh interval (separate from global background change frequency)
 */
export async function checkAndRefreshAPIPacks() {
  const apiPacksReady = JSON.parse(localStorage.getItem('api_packs_ready') || '[]');
  const apiPackCache = JSON.parse(localStorage.getItem('api_pack_cache') || '{}');

  // Hardcoded 1 hour refresh interval (separate from global background change frequency)
  const CACHE_REFRESH_INTERVAL = 3600 * 1000; // 1 hour in milliseconds

  for (const packId of apiPacksReady) {
    const cached = apiPackCache[packId];

    const needsRefresh =
      !cached ||
      Date.now() - cached.last_fetched > CACHE_REFRESH_INTERVAL ||
      cached.photos.length < 3;

    if (needsRefresh) {
      // Don't block - refresh in background
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
  const apiPacksReady = JSON.parse(localStorage.getItem('api_packs_ready') || '[]');
  const apiPackCache = JSON.parse(localStorage.getItem('api_pack_cache') || '{}');

  installed.forEach((pack) => {
    if (pack.type !== 'photos') return;

    if (pack.api_enabled) {
      // API pack - check if configured and ready
      if (apiPacksReady.includes(pack.id)) {
        const cached = apiPackCache[pack.id];
        if (cached && cached.photos.length > 0) {
          // Add cached photos with source metadata
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
      // Static pack - add all photos
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
