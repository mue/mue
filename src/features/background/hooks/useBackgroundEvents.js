import { useEffect } from 'react';
import EventBus from 'utils/eventbus';
import { getBackgroundFilterStyle, getBackgroundOverlayStyle } from '../api/backgroundFilters';

/**
 * Hook for handling EventBus background events
 */
export function useBackgroundEvents(backgroundData, refreshBackground) {
  useEffect(() => {
    const handleEvent = (event) => {
      if (event === 'welcomeLanguage') {
        localStorage.setItem('welcomeImage', JSON.stringify(backgroundData));
      } else if (event === 'background') {
        handleVisibilityToggle();
      } else if (['marketplacebackgrounduninstall', 'backgroundwelcome', 'backgroundrefresh'].includes(event)) {
        refreshBackground();
      } else if (event === 'backgroundeffect') {
        applyFilters();
      }
    };

    const handleVisibilityToggle = () => {
      const element = document.getElementById(backgroundData.video ? 'backgroundVideo' : 'backgroundImage');
      const photoInfo = document.querySelector('.photoInformation');
      const isEnabled = localStorage.getItem('background') !== 'false';

      if (!isEnabled) {
        element?.style.setProperty('display', 'none');
        if (!backgroundData.photoInfo?.hidden) photoInfo?.style.setProperty('display', 'none');
        return;
      }

      element?.style.setProperty('display', 'block');
      if (!backgroundData.photoInfo?.hidden) photoInfo?.style.setProperty('display', 'flex');

      // Check if refresh needed
      const type = localStorage.getItem('backgroundType');
      const needsRefresh =
        (type !== backgroundData.type && !(backgroundData.photoInfo?.offline && type === backgroundData.type)) ||
        (backgroundData.type === 'api' && localStorage.getItem('backgroundAPI') !== backgroundData.currentAPI) ||
        (backgroundData.type === 'custom' && localStorage.getItem('customBackground') !== backgroundData.url) ||
        (backgroundData.photoInfo?.pun && JSON.parse(localStorage.getItem('backgroundExclude') || '[]').includes(backgroundData.photoInfo.pun));

      if (needsRefresh) refreshBackground();
    };

    const applyFilters = () => {
      // For video backgrounds, apply filters directly to the video element
      if (backgroundData.video) {
        const filter = getBackgroundFilterStyle();
        const element = document.getElementById('backgroundVideo');
        if (element) element.style.webkitFilter = filter;
      } else {
        // For image backgrounds, apply filters to the overlay element
        const overlayElement = document.getElementById('backgroundFilterOverlay');
        if (overlayElement) {
          const overlayStyle = getBackgroundOverlayStyle();
          overlayElement.style.backdropFilter = overlayStyle.backdropFilter;
          overlayElement.style.webkitBackdropFilter = overlayStyle.WebkitBackdropFilter;
          overlayElement.style.backgroundColor = overlayStyle.backgroundColor;
        }
      }
    };

    EventBus.on('refresh', handleEvent);
    return () => EventBus.off('refresh', handleEvent);
  }, [backgroundData, refreshBackground]);
}
