import BackgroundImage from './components/BackgroundImage';
import BackgroundVideo from './components/BackgroundVideo';

import { useBackgroundState } from './hooks/useBackgroundState';
import { useBackgroundLoader } from './hooks/useBackgroundLoader';
import { useBackgroundRenderer, useBackgroundFilters } from './hooks/useBackgroundRenderer';
import { useBackgroundEvents } from './hooks/useBackgroundEvents';

import './scss/index.scss';

/**
 * Background component - Manages and displays backgrounds
 * Supports: API images, custom images, colors, gradients, videos, and photo packs
 */
export default function Background() {
  const { backgroundData, updateBackground, resetBackground } = useBackgroundState();
  const { refreshBackground } = useBackgroundLoader(updateBackground, resetBackground);
  const filterStyle = useBackgroundFilters();

  useBackgroundRenderer(backgroundData);
  useBackgroundEvents(backgroundData, refreshBackground);

  return backgroundData.video ? (
    <BackgroundVideo url={backgroundData.url} filterStyle={filterStyle} />
  ) : (
    <BackgroundImage
      filterStyle={filterStyle}
      photoInfo={backgroundData.photoInfo}
      currentAPI={backgroundData.currentAPI}
      url={backgroundData.url}
    />
  );
}
