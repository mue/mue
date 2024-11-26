import { decodeBlurHash } from 'fast-blurhash';
import { getOfflineImage } from './getOfflineImage';
import { supportsAVIF } from './avif';
import videoCheck from './videoCheck';
import { randomColourStyleBuilder } from './randomColour';
import defaults from '../options/default';
import variables from 'config/variables';
import Stats from 'features/stats/api/stats';

export const getRequestURL = (backgroundAPI, apiCategories, apiQuality, backgroundExclude) => {
  switch (backgroundAPI) {
    case 'unsplash':
    case 'pexels':
      const collection =
        localStorage.getItem('unsplashCollections') || defaults.unsplashCollections;
      return collection
        ? `${variables.constants.API_URL}/images/unsplash?collections=${collection}&quality=${apiQuality}`
        : `${variables.constants.API_URL}/images/unsplash?categories=${apiCategories || ''}&quality=${apiQuality}`;
    default:
      return `${variables.constants.API_URL}/images/random?categories=${apiCategories || ''}&quality=${apiQuality}&excludes=${backgroundExclude}`;
  }
};

export const formatAPIData = (data, backgroundAPI) => {
  let photoURL, photographerURL;
  if (backgroundAPI === 'unsplash') {
    photoURL = data.photo_page;
    photographerURL = data.photographer_page;
  }
  return {
    url: data.file,
    type: 'api',
    currentAPI: backgroundAPI,
    photoInfo: {
      hidden: false,
      category: data.category,
      credit: data.photographer,
      location: data.location.name,
      camera: data.camera,
      url: data.file,
      photographerURL,
      photoURL,
      latitude: data.location.latitude || null,
      longitude: data.location.longitude || null,
      views: data.views || null,
      downloads: data.downloads || null,
      likes: data.likes || null,
      description: data.description || null,
      colour: data.colour,
      blur_hash: data.blur_hash,
      pun: data.pun || null,
    },
  };
};

export const resetElements = (backgroundImageActual, blurhashOverlay) => {
  backgroundImageActual.style.opacity = 0;
  blurhashOverlay.style.backgroundImage = '';
  blurhashOverlay.style.backgroundColor = '';
};

export const handleAPIBackground = async (
  state,
  backgroundImage,
  blurhashOverlay,
  backgroundImageActual,
  photoInformation,
) => {
  if (state.url) {
    if (localStorage.getItem('bgtransition') === 'false') {
      if (photoInformation) {
        photoInformation.style.display = 'flex';
      }
      backgroundImage.style.background = `url(${state.url})`;
      return;
    }

    if (state.photoInfo.blur_hash) {
      blurhashOverlay.style.backgroundColor = state.photoInfo.colour;
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(32, 32);
      imageData.data.set(decodeBlurHash(state.photoInfo.blur_hash, 32, 32));
      ctx.putImageData(imageData, 0, 0);
      blurhashOverlay.style.backgroundImage = `url(${canvas.toDataURL()})`;
    }

    const newBlob = URL.createObjectURL(await (await fetch(state.url)).blob());
    backgroundImageActual.src = newBlob;
  }
};

export const handleColourBackground = (state, backgroundImage) => {
  backgroundImage.style.background = state.style;
  Stats.postEvent('background', 'colour', 'set');
};

export const handleCustomBackground = (state, backgroundImage, photoInformation) => {
  if (state.url) {
    backgroundImage.style.background = `url(${state.url})`;
    if (photoInformation && !state.photoInfo.hidden) {
      photoInformation.style.display = 'flex';
    }
  }
  Stats.postEvent('background', state.type, 'set');
};

export const handleDefaultBackground = (state, backgroundImage) => {
  backgroundImage.style.background = state.style || 'rgb(0,0,0)';
  Stats.postEvent('background', 'colour', 'set');
};

export const handleAPIBackgroundType = async (offline, getAPIImageData, setState) => {
  if (offline) {
    setState(getOfflineImage('api'));
    Stats.postEvent('background', 'image', 'offline');
    return;
  }
  let data = JSON.parse(localStorage.getItem('nextImage')) || (await getAPIImageData());
  localStorage.setItem('nextImage', null);
  if (data) {
    setState(data);
    localStorage.setItem('currentBackground', JSON.stringify(data));
    localStorage.setItem('nextImage', JSON.stringify(await getAPIImageData(data.photoInfo.pun)));
    Stats.postEvent('background', 'image', 'api');
  }
};

export const handleColourBackgroundType = (setState) => {
  let customBackgroundColour = localStorage.getItem('customBackgroundColour');
  if (customBackgroundColour && customBackgroundColour.startsWith('{')) {
    const customBackground = JSON.parse(customBackgroundColour);
    try {
      localStorage.setItem('customBackgroundColour', customBackground.gradient[0].colour);
      customBackgroundColour = customBackground.gradient.colour;
    } catch (e) {
      customBackgroundColour = 'rgb(0,0,0)';
    }
  }
  setState({
    type: 'colour',
    style: customBackgroundColour || 'rgb(0,0,0)',
  });
  Stats.postEvent('background', 'colour', 'custom');
};

export const handleRandomColourBackgroundType = (type, setState) => {
  const randomStyle = randomColourStyleBuilder(type);
  setState({
    type: 'colour',
    style: randomStyle,
  });
  Stats.postEvent('background', 'colour', 'random');
};

export const handleCustomBackgroundType = async (offline, setState) => {
  let customBackground = [];
  const customSaved = localStorage.getItem('customBackground') || defaults.customBackground;
  try {
    customBackground = JSON.parse(customSaved);
  } catch (e) {
    if (customSaved !== '') {
      customBackground = [customSaved];
    }
    localStorage.setItem('customBackground', JSON.stringify(customBackground));
  }
  customBackground = customBackground[Math.floor(Math.random() * customBackground.length)];
  if (offline && !customBackground.startsWith('data:')) {
    setState(getOfflineImage('custom'));
    Stats.postEvent('background', 'image', 'offline');
    return;
  }
  if (customBackground) {
    const object = {
      url: customBackground,
      type: 'custom',
      video: videoCheck(customBackground),
      photoInfo: {
        hidden: true,
      },
    };
    setState(object);
    localStorage.setItem('currentBackground', JSON.stringify(object));
    Stats.postEvent('background', 'image', 'custom');
  }
};

export const handlePhotoPackBackgroundType = async (offline, setState) => {
  if (offline) {
    setState(getOfflineImage('photo'));
    Stats.postEvent('background', 'image', 'offline');
    return;
  }
  const photoPack = [];
  const installed = JSON.parse(localStorage.getItem('installed'));
  installed.forEach((item) => {
    if (item.type === 'photos') {
      const photos = item.photos.map((photo) => photo);
      photoPack.push(...photos);
    }
  });
  if (photoPack.length === 0) {
    setState(getOfflineImage('photo'));
    Stats.postEvent('background', 'image', 'offline');
    return;
  }
  const photo = photoPack[Math.floor(Math.random() * photoPack.length)];
  setState({
    url: photo.url.default,
    type: 'photo_pack',
    video: videoCheck(photo.url.default),
    photoInfo: {
      photographer: photo.photographer,
    },
  });
  Stats.postEvent('background', 'image', 'photo_pack');
};

export const handleBackgroundVisibility = (state, element) => {
  if (localStorage.getItem('background') === 'false') {
    if (state.photoInfo.hidden === false) {
      document.querySelector('.photoInformation').style.display = 'none';
    }
    if (state.video === true) {
      document.getElementById('backgroundVideo').style.display = 'none';
    } else {
      element.style.display = 'none';
    }
    return;
  }
  if (state.video === true) {
    document.getElementById('backgroundVideo').style.display = 'block';
  } else {
    if (state.photoInfo.hidden === false) {
      try {
        document.querySelector('.photoInformation').style.display = 'flex';
      } catch (e) {
        // Disregard exception
      }
    }
    element.style.display = 'block';
  }
};

export const handleBackgroundEffectEvent = (state) => {
  const element = document.getElementById('backgroundImage');
  const backgroundFilterSetting =
    localStorage.getItem('backgroundFilter') || defaults.backgroundFilter;
  const backgroundFilter = backgroundFilterSetting && backgroundFilterSetting !== 'none';
  const filterValue = `blur(${localStorage.getItem('blur')}px) brightness(${localStorage.getItem('brightness')}%) ${
    backgroundFilter
      ? backgroundFilterSetting + '(' + localStorage.getItem('backgroundFilterAmount') + '%)'
      : ''
  }`;
  if (state.video === true) {
    document.getElementById('backgroundVideo').style.filter = filterValue;
  } else {
    element.style.filter = filterValue;
  }
};
