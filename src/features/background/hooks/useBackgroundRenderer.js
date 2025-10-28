import { useEffect, useRef } from 'react';
import { createBlobUrl } from '../api/blobUrl';
import { generateBlurHashDataUrl } from '../api/blurHash';
import { getBackgroundFilterStyle } from '../api/backgroundFilters';

/**
 * Hook for rendering backgrounds to the DOM
 */
export function useBackgroundRenderer(backgroundData) {
  const blobRef = useRef(null);

  useEffect(() => {
    if (backgroundData.video) return;

    const element = document.getElementById('backgroundImage');
    if (!element) return;

    // Cleanup previous blob
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
    }

    const applyBackground = async () => {
      if (backgroundData.url) {
        const hasTransition = localStorage.getItem('bgtransition') !== 'false';

        if (!hasTransition) {
          element.style.background = `url(${backgroundData.url})`;
          document.querySelector('.photoInformation')?.style.setProperty('display', 'flex');
          return;
        }

        element.style.background = null;

        // Apply blur hash placeholder
        if (backgroundData.photoInfo?.blur_hash && backgroundData.photoInfo?.colour) {
          element.style.backgroundColor = backgroundData.photoInfo.colour;
          element.classList.add('fade-in');

          const blurHash = generateBlurHashDataUrl(backgroundData.photoInfo.blur_hash);
          if (blurHash) element.style.backgroundImage = `url(${blurHash})`;
        }

        // Load full image
        const blobUrl = await createBlobUrl(backgroundData.url);
        if (blobUrl) {
          blobRef.current = blobUrl;
          element.classList.add('backgroundTransform');
          element.style.backgroundImage = `url(${blobUrl})`;
        } else {
          element.style.backgroundImage = `url(${backgroundData.url})`;
        }
      } else if (backgroundData.style) {
        element.setAttribute('style', backgroundData.style);
      }
    };

    applyBackground();

    return () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    };
  }, [backgroundData.url, backgroundData.style, backgroundData.video, backgroundData.photoInfo]);
}

/**
 * Hook to get computed filter styles
 */
export function useBackgroundFilters() {
  return { WebkitFilter: getBackgroundFilterStyle() };
}
