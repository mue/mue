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

  const cachedQueue = queueManager.getQueue();
  if (cachedQueue.length > 0) {
    data = queueManager.shift();
  } else {
    data = await fetchAPIImageData();
  }

  if (!data) {
    return getOfflineImage('api');
  }

  try {
    localStorage.setItem('currentBackground', JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save currentBackground to localStorage:', e);
  }

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
  let backgrounds = await getAllBackgroundsWithMetadata();

  if (!backgrounds || backgrounds.length === 0) {
    const urls = safeParseJSON('customBackground', []);
    if (urls && urls.length > 0) {
      backgrounds = urls.map((url) => ({ url, photoInfo: { hidden: true } }));
    }
  }

  if (!backgrounds || backgrounds.length === 0) {
    return null;
  }

  const queueManager = new BackgroundQueueManager('customQueue', 3);
  let selected;

  const cachedQueue = queueManager.getQueue();
  if (cachedQueue.length > 0) {
    const queuedId = queueManager.shift();
    selected = backgrounds.find((bg) => bg.id === queuedId);

    if (!selected) {
      selected = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    }
  } else {
    selected = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  }

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
    console.warn('Could not save currentBackground to localStorage:', e);
  }

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

  const usedIds = [currentId, ...currentQueue.filter(Boolean)];

  const available = allBackgrounds.filter(
    (bg) => bg.id && !usedIds.includes(bg.id) && !videoCheck(bg.url || bg),
  );

  if (available.length === 0) return;

  const shuffled = available.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

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

  const pool = buildPhotoPool();

  if (pool.length === 0) {
    console.warn('Photo pack pool is empty, falling back to API background');
    return getAPIBackground(isOffline);
  }

  const queueManager = new BackgroundQueueManager('photoPackQueue', 3);
  let photoData;

  const cachedQueue = queueManager.getQueue();
  if (cachedQueue.length > 0) {
    photoData = queueManager.shift();
  } else {
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
        pack_name: selected.pack_name || null,
        ...(selected.colour && { colour: selected.colour }),
        ...(selected.camera && { camera: selected.camera }),
        ...(selected.category && { category: selected.category }),
        ...(selected.latitude &&
          selected.longitude && {
            latitude: selected.latitude,
            longitude: selected.longitude,
          }),
        ...(selected.photographer_page && { photographerURL: selected.photographer_page }),
        ...(selected.photo_page && { photoURL: selected.photo_page }),
      },
    };
  }

  try {
    localStorage.setItem('currentBackground', JSON.stringify(photoData));
  } catch (e) {
    console.warn('Could not save currentBackground to localStorage:', e);
  }

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

  const usedUrls = [currentPhoto.url, ...currentQueue.map((p) => p.url)];

  const available = pool.filter((p) => {
    const url = p.url.default || p.url;
    return !usedUrls.includes(url) && !usedUrls.includes(getProxiedImageUrl(url));
  });

  if (available.length === 0) return;

  const shuffled = available.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

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
      pack_name: photo.pack_name || null,
      ...(photo.colour && { colour: photo.colour }),
      ...(photo.camera && { camera: photo.camera }),
      ...(photo.category && { category: photo.category }),
      ...(photo.latitude &&
        photo.longitude && {
          latitude: photo.latitude,
          longitude: photo.longitude,
        }),
      ...(photo.photographer_page && { photographerURL: photo.photographer_page }),
      ...(photo.photo_page && { photoURL: photo.photo_page }),
    },
  }));

  queueManager.push(normalized);

  checkAndRefreshAPIPacks();
}
