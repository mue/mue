import React, { useState, useEffect, useCallback, useRef } from 'react';
import PhotoInformation from './components/PhotoInformation';
import EventBus from 'utils/eventbus';
import defaults from './options/default';
import Stats from 'features/stats/api/stats';
import BackgroundImage from './components/BackgroundImage';
import BackgroundVideo from './components/BackgroundVideo';
import './scss/index.scss';
import useBackgroundAPI from './api/useBackgroundAPI';
import { handleBackgroundType, applyBackground } from './api/backgroundTypeHandlers';
import {
  resetElements,
  handleBackgroundVisibility,
  handleBackgroundEffectEvent,
} from './api/backgroundHelpers';
import { getCustomImages } from 'utils/indexedDB';

const initialState = {
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
};

const Background = () => {
  const [backgroundState, setBackgroundState] = useState(initialState);
  const blobRef = useRef(null);
  const { getAPIImageData } = useBackgroundAPI(setBackgroundState);

  const setBackground = useCallback(async () => {
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
    }

    const elements = {
      backgroundImage: document.getElementById('backgroundImage'),
      blurhashOverlay: document.getElementById('blurhashOverlay'),
      backgroundImageActual: document.getElementById('backgroundImageActual'),
      photoInformation: document.querySelector('.photoInformation'),
    };

    resetElements(elements.backgroundImageActual, elements.blurhashOverlay);

    try {
      await applyBackground(backgroundState, elements);

      if (elements.backgroundImageActual.src) {
        elements.backgroundImageActual.onload = () => {
          elements.backgroundImageActual.style.opacity = 1;
          elements.blurhashOverlay.style.opacity = 0;
          Stats.postEvent('feature', 'background-image', 'shown');
        };
      }
    } catch (error) {
      console.error('Error setting background:', error);
      elements.backgroundImage.style.background = 'rgb(0,0,0)';
    }
  }, [backgroundState]);

  const getBackground = useCallback(async () => {
    let offline = localStorage.getItem('offlineMode') === 'true';
    if (localStorage.getItem('showWelcome') !== 'false') {
      offline = true;
    }

    const favourited = JSON.parse(localStorage.getItem('favourite'));
    if (favourited) {
      setFavouritedBackground(favourited);
      return;
    }

    const type = localStorage.getItem('backgroundType') || defaults.backgroundType;
    if (type === 'custom') {
      const customImages = await getCustomImages();
      if (customImages.length > 0) {
        const randomImage = customImages[Math.floor(Math.random() * customImages.length)];
        setBackgroundState({
          url: randomImage.url,
          type: 'custom',
        });
        return;
      }
    }

    await handleBackgroundType(type, offline, getAPIImageData, setBackgroundState);
  }, [getAPIImageData]);

  const setFavouritedBackground = ({ type, url, credit, location, camera, pun, offline }) => {
    if (type === 'random_colour' || type === 'random_gradient') {
      setBackgroundState({
        type: 'colour',
        style: url,
      });
    } else {
      setBackgroundState({
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

  const handleRefreshEvent = useCallback(
    (data) => {
      const element = document.getElementById('backgroundImage');
      const refresh = () => {
        element.classList.remove('fade-in');
        setBackgroundState(initialState);
        getBackground();
      };

      if (data === 'welcomeLanguage') {
        localStorage.setItem('welcomeImage', JSON.stringify(backgroundState));
      }
      if (data === 'background') {
        handleBackgroundVisibility(backgroundState, element);
        const backgroundType = localStorage.getItem('backgroundType') || defaults.backgroundType;
        if (backgroundState.photoInfo.offline !== true) {
          if (
            backgroundType !== backgroundState.type ||
            (backgroundState.type === 'api' &&
              localStorage.getItem('backgroundAPI') !== backgroundState.currentAPI) ||
            (backgroundState.type === 'custom' &&
              localStorage.getItem('customBackground') !== backgroundState.url) ||
            JSON.parse(localStorage.getItem('backgroundExclude')).includes(
              backgroundState.photoInfo.pun,
            )
          ) {
            refresh();
            return;
          }
        } else if (backgroundType !== backgroundState.type) {
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
    [backgroundState, getBackground],
  );

  useEffect(() => {
    if (localStorage.getItem('welcomeTab')) {
      setBackgroundState(JSON.parse(localStorage.getItem('welcomeImage')));
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
  }, [handleRefreshEvent]);

  useEffect(() => {
    if (backgroundState.video !== true) {
      setBackground();
    }
  }, [backgroundState, setBackground]);

  if (backgroundState.video === true) {
    return <BackgroundVideo url={backgroundState.url} />;
  }

  return (
    <>
      <BackgroundImage />
      {backgroundState.photoInfo && backgroundState.photoInfo.credit && (
        <PhotoInformation
          info={backgroundState.photoInfo}
          api={backgroundState.currentAPI}
          url={backgroundState.url}
        />
      )}
    </>
  );
};

export default Background;
