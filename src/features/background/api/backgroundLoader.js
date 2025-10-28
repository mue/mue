import variables from 'config/variables';
import { supportsAVIF } from './avifSupport';
import { getOfflineImage } from './offlineImage';
import { randomColourStyleBuilder } from './randomColour';
import videoCheck from './videoCheck';

const parseJSON = (key, fallback = null) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
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

  const url = (api === 'unsplash' || api === 'pexels')
    ? `${baseURL}/unsplash?${collection ? `collections=${collection}` : `categories=${categories || ''}`}&quality=${quality}`
    : `${baseURL}/random?categories=${categories || ''}&quality=${quality}&excludes=${excludes}`;

  try {
    const accept = `application/json, ${await supportsAVIF() ? 'image/avif' : 'image/webp'}`;
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
  const isOffline = localStorage.getItem('offlineMode') === 'true' || localStorage.getItem('showWelcome') === 'true';

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
      return getCustomBackground(isOffline);

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
  let colour = localStorage.getItem('customBackgroundColour');

  // Migrate legacy format
  if (colour?.startsWith('{')) {
    try {
      colour = JSON.parse(colour).gradient[0].colour;
      localStorage.setItem('customBackgroundColour', colour);
    } catch {
      colour = 'rgb(0,0,0)';
    }
  }

  return { type: 'colour', style: `background: ${colour || 'rgb(0,0,0)'}` };
}

/**
 * Gets API background with caching
 */
async function getAPIBackground(isOffline) {
  if (isOffline) return getOfflineImage('api');

  // Use cached next image if available
  const cached = parseJSON('nextImage');
  const data = cached || await fetchAPIImageData();

  if (!data) return getOfflineImage('api');

  localStorage.setItem('currentBackground', JSON.stringify(data));
  localStorage.setItem('nextImage', null);

  // Pre-fetch next image
  fetchAPIImageData(data.photoInfo.pun).then((next) => {
    if (next) localStorage.setItem('nextImage', JSON.stringify(next));
  });

  return data;
}

/**
 * Gets custom background
 */
function getCustomBackground(isOffline) {
  let backgrounds = parseJSON('customBackground');

  // Migrate legacy format
  if (!Array.isArray(backgrounds)) {
    const saved = localStorage.getItem('customBackground');
    backgrounds = saved ? [saved] : [];
    localStorage.setItem('customBackground', JSON.stringify(backgrounds));
  }

  if (backgrounds.length === 0) return null;

  const selected = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  if (isOffline && !selected.startsWith('data:')) return getOfflineImage('custom');

  const data = {
    url: selected,
    type: 'custom',
    video: videoCheck(selected),
    photoInfo: { hidden: true },
  };

  localStorage.setItem('currentBackground', JSON.stringify(data));
  return data;
}

/**
 * Gets photo pack background
 */
function getPhotoPackBackground(isOffline) {
  if (isOffline) return getOfflineImage('photo_pack');

  const photos = parseJSON('installed', []).flatMap((item) =>
    item.type === 'photos' && item.photos ? item.photos : []
  );

  if (photos.length === 0) return null;

  const interval = localStorage.getItem('backgroundchange');
  const startTime = Number(localStorage.getItem('backgroundStartTime'));
  const shouldRefresh = !interval || interval === 'refresh' || startTime + Number(interval) < Date.now();

  let index;
  if (shouldRefresh) {
    index = Math.floor(Math.random() * photos.length);
    localStorage.setItem('marketplaceNumber', index);
  } else {
    index = Number(localStorage.getItem('marketplaceNumber')) || 0;
  }

  const photo = photos[index];

  return photo ? {
    url: photo.url.default,
    type: 'photo_pack',
    photoInfo: {
      hidden: false,
      credit: photo.photographer,
      location: photo.location,
    },
  } : null;
}
