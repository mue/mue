import variables from 'config/variables';
import { supportsAVIF } from './avifSupport';
import { getOfflineImage } from './offlineImage';
import { randomColourStyleBuilder } from './randomColour';
import videoCheck from './videoCheck';
import { getAllBackgrounds, getAllBackgroundsWithMetadata } from 'utils/customBackgroundDB';

const parseJSON = (key, fallback = null) => {
  const item = localStorage.getItem(key);
  if (item === null || item === 'null') {
    return fallback;
  }
  try {
    const parsed = JSON.parse(item);
    return parsed !== null ? parsed : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Fetches image data from the configured API
 */
export async function fetchAPIImageData(excludedPun = null) {
  const api = localStorage.getItem('backgroundAPI') || 'mue';
  const quality = localStorage.getItem('apiQuality') || 'high';
  const categories = parseJSON('apiCategories', localStorage.getItem('apiCategories'));
  const excludes = [...parseJSON('backgroundExclude', []), ...(excludedPun ? [excludedPun] : [])];

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
 * Gets background data based on current configuration
 */
export async function getBackgroundData() {
  const isOffline =
    localStorage.getItem('offlineMode') === 'true' ||
    localStorage.getItem('showWelcome') === 'true';

  // Handle favourited background
  const fav = parseJSON('favourite');
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

  // Use cached next image if available
  const cachedQueue = parseJSON('imageQueue', []);
  let data;

  if (cachedQueue.length > 0) {
    data = cachedQueue.shift();
    localStorage.setItem('imageQueue', JSON.stringify(cachedQueue));
  } else {
    data = await fetchAPIImageData();
  }

  if (!data) return getOfflineImage('api');

  localStorage.setItem('currentBackground', JSON.stringify(data));

  // Pre-fetch next 3 images in the background
  const targetQueueSize = 3;
  const currentQueueSize = cachedQueue.length;

  if (currentQueueSize < targetQueueSize) {
    const excludedPuns = [
      data.photoInfo.pun,
      ...cachedQueue.map((img) => img.photoInfo?.pun).filter(Boolean),
    ];

    // Prefetch remaining images asynchronously
    Promise.all(
      Array.from({ length: targetQueueSize - currentQueueSize }, (_, i) =>
        fetchAPIImageData(excludedPuns[i] || data.photoInfo.pun),
      ),
    ).then((newImages) => {
      const validImages = newImages.filter(Boolean);
      if (validImages.length > 0) {
        const updatedQueue = [...cachedQueue, ...validImages];
        localStorage.setItem('imageQueue', JSON.stringify(updatedQueue));
      }
    });
  }

  return data;
}

/**
 * Gets custom background
 */
async function getCustomBackground(isOffline) {
  // Get full metadata from IndexedDB
  let backgrounds = await getAllBackgroundsWithMetadata();

  // Fallback to localStorage URLs if IndexedDB is empty
  if (!backgrounds || backgrounds.length === 0) {
    const urls = parseJSON('customBackground', []);
    if (urls && urls.length > 0) {
      // Convert old URL format to metadata format
      backgrounds = urls.map((url) => ({ url, photoInfo: { hidden: true } }));
    }
  }

  if (!backgrounds || backgrounds.length === 0) return null;

  const selected = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  // Check if selected is valid before using it
  if (!selected) return null;

  const url = selected.url || selected;

  if (isOffline && !url.startsWith('data:')) {
    return getOfflineImage('custom');
  }

  const data = {
    url,
    type: 'custom',
    video: videoCheck(url),
    photoInfo: {
      hidden: true,
      blur_hash: selected.blurHash || null,
    },
  };

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

  return data;
}

/**
 * Gets photo pack background
 */
function getPhotoPackBackground(isOffline) {
  if (isOffline) return getOfflineImage('photo_pack');

  const photos = parseJSON('installed', []).flatMap((item) =>
    item.type === 'photos' && item.photos ? item.photos : [],
  );

  if (photos.length === 0) return null;

  const interval = localStorage.getItem('backgroundchange');
  const startTime = Number(localStorage.getItem('backgroundStartTime'));
  const shouldRefresh =
    !interval || interval === 'refresh' || startTime + Number(interval) < Date.now();

  let index;
  if (shouldRefresh) {
    index = Math.floor(Math.random() * photos.length);
    localStorage.setItem('marketplaceNumber', index);
  } else {
    index = Number(localStorage.getItem('marketplaceNumber')) || 0;
  }

  const photo = photos[index];

  return photo
    ? {
        url: photo.url.default,
        type: 'photo_pack',
        photoInfo: { hidden: false, credit: photo.photographer, location: photo.location },
      }
    : null;
}
