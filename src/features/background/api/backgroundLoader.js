import variables from 'config/variables';
import { supportsAVIF } from './avifSupport';
import { getOfflineImage } from './offlineImage';
import { randomColourStyleBuilder } from './randomColour';
import videoCheck from './videoCheck';
import { getAllBackgrounds, getAllBackgroundsWithMetadata } from 'utils/customBackgroundDB';
import { BackgroundQueueManager } from 'utils/backgroundQueue';
import { getProxiedImageUrl } from 'utils/marketplace';
import { safeParseJSON } from 'utils/jsonStorage';
import { buildPhotoPool, checkAndRefreshAPIPacks } from './photoPackAPI';

/**
 * Fetches image data from the configured API
 */
export async function fetchAPIImageData(excludedPun = null) {
  const api = localStorage.getItem('backgroundAPI') || 'mue';
  const quality = localStorage.getItem('apiQuality') || 'high';
  const categories = safeParseJSON('apiCategories', localStorage.getItem('apiCategories'));
  const excludes = [
    ...safeParseJSON('backgroundExclude', []),
    ...(excludedPun ? [excludedPun] : []),
  ];

  const baseURL = `${variables.constants.API_URL}/images`;
  const collection = localStorage.getItem('unsplashCollections');

  const url =
    api === 'unsplash' || api === 'pexels'
      ? `${baseURL}/unsplash?${collection ? `collections=${collection}` : `categories=${categories || ''}`}&quality=${quality}`
      : `${baseURL}/random?categories=${categories || ''}&quality=${quality}&excludes=${excludes}`;

  try {
    const accept = `application/json, ${(await supportsAVIF()) ? 'image/avif' : 'image/webp'}`;
    const data = await (await fetch(url, { headers: { accept } })).json();

    return {
      url: data.file,
      type: 'api',
      currentAPI: api,
      photoInfo: {
        hidden: false,
        category: data.category,
        credit: data.photographer,
        location: data.location.name,
        camera: data.camera,
        url: data.file,
        photographerURL: api === 'unsplash' ? data.photographer_page : undefined,
        photoURL: api === 'unsplash' ? data.photo_page : undefined,
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        views: data.views,
        downloads: data.downloads,
        likes: data.likes,
        description: data.description,
        colour: data.colour,
        blur_hash: data.blur_hash,
        pun: data.pun,
      },
    };
  } catch (error) {
    console.error('Failed to fetch API image:', error);
    return null;
  }
}

/**
 * Gets solid colour background
 */
function getColourBackground() {
  return {
    type: 'colour',
    style: `background: ${localStorage.getItem('customBackgroundColour') || 'rgb(0,0,0)'}`,
  };
}

/**
 * Gets API background with caching and prefetching
 */
async function getAPIBackground(isOffline) {
  if (isOffline) return getOfflineImage('api');

  const queueManager = new BackgroundQueueManager('imageQueue', 3);
  let data;

  // Use cached next image if available
  const cachedQueue = queueManager.getQueue();
  if (cachedQueue.length > 0) {
    data = queueManager.shift();
  } else {
    data = await fetchAPIImageData();
  }

  if (!data) {return getOfflineImage('api');}

  try {
    localStorage.setItem('currentBackground', JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save currentBackground to localStorage:', e);
  }

  // Pre-fetch next images in the background
  if (queueManager.needsPrefetch()) {
    prefetchAPIImages(queueManager, data, cachedQueue).catch((error) => {
      console.error('Failed to prefetch API images:', error);
    });
  }

  return data;
}

/**
 * Prefetch API images in the background
 * @param {BackgroundQueueManager} queueManager - The queue manager
 * @param {Object} currentImage - The current image data
 * @param {Array} currentQueue - The current queue state
 */
async function prefetchAPIImages(queueManager, currentImage, currentQueue) {
  const count = queueManager.getSpaceNeeded();
  const excludedPuns = [
    currentImage.photoInfo.pun,
    ...currentQueue.map((img) => img.photoInfo?.pun).filter(Boolean),
  ];

  // Prefetch remaining images asynchronously
  const newImages = await Promise.all(
    Array.from({ length: count }, (_, i) =>
      fetchAPIImageData(excludedPuns[i] || currentImage.photoInfo.pun),
    ),
  );

  const validImages = newImages.filter(Boolean);
  if (validImages.length > 0) {
    queueManager.push(validImages);
  }
}

/**
 * Gets custom background with prefetching
 */
async function getCustomBackground(isOffline) {
  // Get full metadata from IndexedDB
  let backgrounds = await getAllBackgroundsWithMetadata();

  // Fallback to localStorage URLs if IndexedDB is empty
  if (!backgrounds || backgrounds.length === 0) {
    const urls = safeParseJSON('customBackground', []);
    if (urls && urls.length > 0) {
      // Convert old URL format to metadata format
      backgrounds = urls.map((url) => ({ url, photoInfo: { hidden: true } }));
    }
  }

  if (!backgrounds || backgrounds.length === 0) {
    return null;
  }

  const queueManager = new BackgroundQueueManager('customQueue', 3);
  let selected;

  // Use cached next background ID if available
  const cachedQueue = queueManager.getQueue();
  if (cachedQueue.length > 0) {
    // Queue contains IDs only, not full data
    const queuedId = queueManager.shift();
    // Look up the full background data by ID
    selected = backgrounds.find((bg) => bg.id === queuedId);

    // If not found (maybe deleted), pick random
    if (!selected) {
      selected = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    }
  } else {
    // Pick random background
    selected = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  }

  // Check if selected is valid before using it
  if (!selected) {
    return null;
  }

  const url = selected.url || selected;

  const data = {
    id: selected.id,
    url,
    type: 'custom',
    video: videoCheck(url),
    photoInfo: {
      hidden: true,
      blur_hash: selected.blurHash || null,
    },
  };

  if (isOffline && !data.url.startsWith('data:')) {
    return getOfflineImage('custom');
  }

  // Don't store full image data in localStorage to avoid quota errors
  // Just store metadata
  try {
    localStorage.setItem(
      'currentBackground',
      JSON.stringify({
        type: 'custom',
        video: data.video,
        photoInfo: data.photoInfo,
      }),
    );
  } catch (e) {
    // Ignore quota errors for currentBackground
    console.warn('Could not save currentBackground to localStorage:', e);
  }

  // Prefetch next backgrounds if needed
  if (queueManager.needsPrefetch()) {
    const count = queueManager.getSpaceNeeded();
    const currentIds = [selected.id, ...cachedQueue];
    const available = backgrounds.filter((bg) => !currentIds.includes(bg.id));

    if (available.length > 0) {
      const nextBackgrounds = [];
      for (let i = 0; i < count; i++) {
        const randomBg = available[Math.floor(Math.random() * available.length)];
        if (randomBg) {
          nextBackgrounds.push(randomBg.id);
          available.splice(available.indexOf(randomBg), 1);
        }
      }

      if (nextBackgrounds.length > 0) {
        queueManager.push(nextBackgrounds);
      }
    }
  }

  return data;
}

/**
 * Gets background data based on current configuration
 */
export async function getBackgroundData() {
  const isOffline =
    localStorage.getItem('offlineMode') === 'true' ||
    localStorage.getItem('showWelcome') === 'true';

  // Handle favourited background
  const fav = safeParseJSON('favourite');
  if (fav) {
    if (fav.type === 'random_colour' || fav.type === 'random_gradient') {
      return { type: 'colour', style: `background:${fav.url}` };
    }
    return { url: fav.url, photoInfo: { ...fav, url: fav.url } };
  }

  const type = localStorage.getItem('backgroundType');

  switch (type) {
    case 'api':
      return getAPIBackground(isOffline);

    case 'colour':
      return getColourBackground();

    case 'random_colour':
    case 'random_gradient':
      return randomColourStyleBuilder(type);

    case 'custom':
      return await getCustomBackground(isOffline);

    case 'photo_pack':
      return getPhotoPackBackground(isOffline);

    default:
      return null;
  }
}

/**
 * Prefetch custom backgrounds in the background
 * Store only IDs in queue to avoid localStorage quota issues with large data URLs
 * @param {BackgroundQueueManager} queueManager - The queue manager
 * @param {Array} allBackgrounds - All available custom backgrounds
 * @param {number} currentId - The current background ID
 * @param {Array} currentQueue - The current queue state (array of IDs)
 */
async function prefetchCustomBackgrounds(queueManager, allBackgrounds, currentId, currentQueue) {
  const count = queueManager.getSpaceNeeded();

  // Get already used IDs (queue now contains IDs only)
  const usedIds = [currentId, ...currentQueue.filter(Boolean)];

  // Filter available (exclude videos from prefetch and already used)
  const available = allBackgrounds.filter(
    (bg) => bg.id && !usedIds.includes(bg.id) && !videoCheck(bg.url || bg),
  );

  if (available.length === 0) return;

  // Shuffle and take N
  const shuffled = available.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  // Store only IDs to avoid quota issues (custom backgrounds use large data URLs)
  const ids = selected.map((bg) => bg.id).filter(Boolean);

  if (ids.length > 0) {
    queueManager.push(ids);
  }
}

/**
 * Gets photo pack background with prefetching and blurhash
 * Now supports both static and API-based photo packs
 */
function getPhotoPackBackground(isOffline) {
  if (isOffline) return getOfflineImage('photo_pack');

  // Build combined pool from static and API packs
  const pool = buildPhotoPool();

  if (pool.length === 0) return null;

  const queueManager = new BackgroundQueueManager('photoPackQueue', 3);
  let photoData;

  // Use cached next photo if available
  const cachedQueue = queueManager.getQueue();
  if (cachedQueue.length > 0) {
    photoData = queueManager.shift();
  } else {
    // Pick random photo from pool
    const selected = pool[Math.floor(Math.random() * pool.length)];

    photoData = {
      url: getProxiedImageUrl(selected.url.default || selected.url),
      type: 'photo_pack',
      photoInfo: {
        hidden: false,
        credit: selected.photographer,
        location: selected.location,
        blur_hash: selected.blur_hash || null,
        url: selected.url.default || selected.url,
        source: selected.source,
        pack_id: selected.pack_id,
      },
    };
  }

  try {
    localStorage.setItem('currentBackground', JSON.stringify(photoData));
  } catch (e) {
    console.warn('Could not save currentBackground to localStorage:', e);
  }

  // Prefetch more photos in the background
  if (queueManager.needsPrefetch()) {
    prefetchPhotoPackImages(queueManager, pool, photoData, cachedQueue).catch((error) => {
      console.error('Failed to prefetch photo pack images:', error);
    });
  }

  return photoData;
}

/**
 * Prefetch photo pack images in the background
 * Supports both static and API-based photo packs
 * @param {BackgroundQueueManager} queueManager - The queue manager
 * @param {Array} pool - Combined pool of photos from all packs
 * @param {Object} currentPhoto - The current photo data
 * @param {Array} currentQueue - The current queue state
 */
async function prefetchPhotoPackImages(queueManager, pool, currentPhoto, currentQueue) {
  const count = queueManager.getSpaceNeeded();

  // Get already used URLs
  const usedUrls = [currentPhoto.url, ...currentQueue.map((p) => p.url)];

  // Filter available photos (handle both URL formats)
  const available = pool.filter((p) => {
    const url = p.url.default || p.url;
    return !usedUrls.includes(url) && !usedUrls.includes(getProxiedImageUrl(url));
  });

  if (available.length === 0) return;

  // Shuffle and take N
  const shuffled = available.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  // Normalize metadata
  const normalized = selected.map((photo) => ({
    url: getProxiedImageUrl(photo.url.default || photo.url),
    type: 'photo_pack',
    photoInfo: {
      hidden: false,
      credit: photo.photographer,
      location: photo.location,
      blur_hash: photo.blur_hash || null,
      url: photo.url.default || photo.url,
      source: photo.source,
      pack_id: photo.pack_id,
    },
  }));

  queueManager.push(normalized);

  // Check if any API pack cache needs refresh
  checkAndRefreshAPIPacks();
}
