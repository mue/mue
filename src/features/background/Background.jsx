import React, { useState, useEffect, useCallback, useRef } from 'react';
import variables from 'config/variables';
import PhotoInformation from './components/PhotoInformation';
import EventBus from 'utils/eventbus';
import { getOfflineImage } from './api/getOfflineImage';
import { supportsAVIF } from './api/avif';
import videoCheck from './api/videoCheck';
import { randomColourStyleBuilder } from './api/randomColour';
import { decodeBlurHash } from 'fast-blurhash';
import defaults from './options/default';
import Stats from 'features/stats/api/stats';
import BackgroundImage from './components/BackgroundImage';
import BackgroundVideo from './components/BackgroundVideo';
import './scss/index.scss';

const Background = () => {
  const [state, setState] = useState({
    blob: null,
    style: '',
    url: '',
    currentAPI: '',
    firstTime: false,
    photoInfo: {
      hidden: false,
      offline: false,
      photographerURL: '',
      photoURL: '',
    },
    type: '',
    video: false,
  });

  const blobRef = useRef(null);

  const getAPIImageData = useCallback(async (currentPun) => {
    let apiCategories;
    try {
      apiCategories = JSON.parse(localStorage.getItem('apiCategories'));
    } catch (error) {
      apiCategories = localStorage.getItem('apiCategories');
    }
    const backgroundAPI = localStorage.getItem('backgroundAPI') || defaults.backgroundAPI;
    const apiQuality = localStorage.getItem('apiQuality') || defaults.apiQuality;
    let backgroundExclude = JSON.parse(localStorage.getItem('backgroundExclude'));
    if (!Array.isArray(backgroundExclude)) {
      backgroundExclude = [];
    }
    if (currentPun) {
      backgroundExclude.push(currentPun);
    }

    let requestURL;
    switch (backgroundAPI) {
      case 'unsplash':
      case 'pexels':
        const collection =
          localStorage.getItem('unsplashCollections') || defaults.unsplashCollections;
        requestURL = collection
          ? `${variables.constants.API_URL}/images/unsplash?collections=${collection}&quality=${apiQuality}`
          : `${variables.constants.API_URL}/images/unsplash?categories=${apiCategories || ''}&quality=${apiQuality}`;
        break;
      default:
        requestURL = `${variables.constants.API_URL}/images/random?categories=${apiCategories || ''}&quality=${apiQuality}&excludes=${backgroundExclude}`;
        break;
    }

    const accept = `application/json, ${supportsAVIF() ? 'image/avif' : 'image/webp'}`;
    try {
      const response = await fetch(requestURL, { headers: { accept } });
      const data = await response.json();
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
    } catch (e) {
      setState(getOfflineImage('api'));
      Stats.postEvent('background', 'image', 'offline');
      return null;
    }
  }, []);

  const setBackground = useCallback(async () => {
    // Clean up previous blob URL
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
    }

    const backgroundImage = document.getElementById('backgroundImage');
    const blurhashOverlay = document.getElementById('blurhashOverlay');
    const backgroundImageActual = document.getElementById('backgroundImageActual');
    const photoInformation = document.querySelector('.photoInformation');

    // Reset elements to default state
    backgroundImageActual.style.opacity = 0;
    blurhashOverlay.style.backgroundImage = '';
    blurhashOverlay.style.backgroundColor = '';

    // Handle different background types
    try {
      switch (state.type) {
        case 'api':
          // Handle API image with blurhash
          if (state.url) {
            if (localStorage.getItem('bgtransition') === 'false') {
              if (photoInformation) {
                photoInformation.style.display = 'flex';
              }
              backgroundImage.style.background = `url(${state.url})`;
              return;
            }

            // Set blurhash overlay if available
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

            // Load actual image
            const newBlob = URL.createObjectURL(await (await fetch(state.url)).blob());
            blobRef.current = newBlob;
            backgroundImageActual.src = newBlob;
          }
          break;

        case 'colour':
        case 'random_colour':
        case 'random_gradient':
          backgroundImage.style.background = state.style;
          backgroundImageActual.src = '';
          Stats.postEvent('background', 'colour', 'set');
          break;

        case 'custom':
        case 'photo_pack':
          if (state.url) {
            backgroundImage.style.background = `url(${state.url})`;
            if (photoInformation && !state.photoInfo.hidden) {
              photoInformation.style.display = 'flex';
            }
          }
          Stats.postEvent('background', state.type, 'set');
          break;

        default:
          // Fallback to solid color
          backgroundImage.style.background = state.style || 'rgb(0,0,0)';
          Stats.postEvent('background', 'colour', 'set');
      }

      // Set up image load handler for all image types
      if (backgroundImageActual.src) {
        backgroundImageActual.onload = () => {
          backgroundImageActual.style.opacity = 1;
          blurhashOverlay.style.opacity = 0;
          Stats.postEvent('feature', 'background-image', 'shown');
        };
      }
    } catch (error) {
      console.error('Error setting background:', error);
      // Fallback to solid black background
      backgroundImage.style.background = 'rgb(0,0,0)';
    }
  }, [state]);

  const getBackground = useCallback(async () => {
    let offline = localStorage.getItem('offlineMode') === 'true';
    if (localStorage.getItem('showWelcome') !== 'false') {
      offline = true;
    }

    const setFavourited = ({ type, url, credit, location, camera, pun, offline }) => {
      if (type === 'random_colour' || type === 'random_gradient') {
        setState({
          type: 'colour',
          style: url,
        });
      } else {
        setState({
          url,
          photoInfo: {
            credit,
            location,
            camera,
            pun,
            offline,
            url,
          },
        });
      }
      Stats.postEvent('background', 'favourite', 'set');
    };

    const favourited = JSON.parse(localStorage.getItem('favourite'));
    if (favourited) {
      setFavourited(favourited);
      return;
    }

    const type = localStorage.getItem('backgroundType') || defaults.backgroundType;
    switch (type) {
      case 'api':
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
          localStorage.setItem(
            'nextImage',
            JSON.stringify(await getAPIImageData(data.photoInfo.pun)),
          );
          Stats.postEvent('background', 'image', 'api');
        }
        break;
      case 'colour':
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
        break;
      case 'random_colour':
      case 'random_gradient':
        const randomStyle = randomColourStyleBuilder(type);
        setState({
          type: 'colour',
          style: randomStyle,
        });
        Stats.postEvent('background', 'colour', 'random');
        break;
      case 'custom':
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
        if (
          customBackground !== '' &&
          customBackground !== 'undefined' &&
          customBackground !== undefined
        ) {
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
        break;
      case 'photo_pack':
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
        break;
      default:
        break;
    }
  }, [getAPIImageData]);

  const handleRefreshEvent = useCallback(
    (data) => {
      const element = document.getElementById('backgroundImage');
      const refresh = () => {
        element.classList.remove('fade-in');
        setState({
          url: '',
          style: '',
          type: '',
          video: false,
          photoInfo: {
            hidden: true,
          },
        });
        getBackground();
      };

      if (data === 'welcomeLanguage') {
        localStorage.setItem('welcomeImage', JSON.stringify(state));
      }
      if (data === 'background') {
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
        const backgroundType = localStorage.getItem('backgroundType') || defaults.backgroundType;
        if (state.photoInfo.offline !== true) {
          if (
            backgroundType !== state.type ||
            (state.type === 'api' && localStorage.getItem('backgroundAPI') !== state.currentAPI) ||
            (state.type === 'custom' && localStorage.getItem('customBackground') !== state.url) ||
            JSON.parse(localStorage.getItem('backgroundExclude')).includes(state.photoInfo.pun)
          ) {
            refresh();
            return;
          }
        } else if (backgroundType !== state.type) {
          refresh();
          return;
        }
      }
      if (
        data === 'marketplacebackgrounduninstall' ||
        data === 'backgroundwelcome' ||
        data === 'backgroundrefresh'
      ) {
        refresh();
      }
    },
    [state, getBackground],
  );

  const handleBackgroundEffectEvent = useCallback(() => {
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
  }, [state.video]);

  useEffect(() => {
    if (localStorage.getItem('welcomeTab')) {
      setState(JSON.parse(localStorage.getItem('welcomeImage')));
      return;
    }
    getBackground();
  }, [getBackground]);

  useEffect(() => {
    EventBus.on('refresh', handleRefreshEvent);
    EventBus.on('backgroundeffect', handleBackgroundEffectEvent);

    return () => {
      EventBus.off('refresh', handleRefreshEvent);
      EventBus.off('backgroundeffect', handleBackgroundEffectEvent);
    };
  }, [handleRefreshEvent, handleBackgroundEffectEvent]);

  useEffect(() => {
    if (state.video !== true) {
      setBackground();
    }
  }, [state, setBackground]);

  if (state.video === true) {
    return <BackgroundVideo url={state.url} />;
  }

  return (
    <>
      <BackgroundImage />
      {state.photoInfo && state.photoInfo.credit && (
        <PhotoInformation info={state.photoInfo} api={state.currentAPI} url={state.url} />
      )}
    </>
  );
};

export default Background;
