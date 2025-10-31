import { useEffect, useRef } from 'react';
import { createBlobUrl } from '../api/blobUrl';
import { generateBlurHashDataUrl } from '../api/blurHash';
import { getBackgroundFilterStyle, getBackgroundOverlayStyle } from '../api/backgroundFilters';

/**
 * Hook for rendering backgrounds to the DOM
 */
export function useBackgroundRenderer(backgroundData) {
  const blobRef = useRef(null);

  useEffect(() => {
    if (backgroundData.video) return;

    const element = document.getElementById('backgroundImage');
    if (!element) return;

    const applyBackground = async () => {
      if (backgroundData.url) {
        const hasTransition = localStorage.getItem('bgtransition') !== 'false';

        if (!hasTransition) {
          element.style.background = `url(${backgroundData.url})`;
          document.querySelector('.photoInformation')?.style.setProperty('display', 'flex');
          return;
        }

        // Create or get overlay element for smooth transitions
        let overlay = document.getElementById('backgroundOverlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'backgroundOverlay';
          // Insert right after the background element
          element.parentNode.insertBefore(overlay, element.nextSibling);
        }

        // Set background color
        if (backgroundData.photoInfo?.colour) {
          element.style.backgroundColor = backgroundData.photoInfo.colour;
        }

        // Generate and show blur hash immediately on main element
        if (backgroundData.photoInfo?.blur_hash) {
          const blurHashUrl = generateBlurHashDataUrl(backgroundData.photoInfo.blur_hash, 64, 64);
          if (blurHashUrl) {
            element.style.backgroundImage = `url(${blurHashUrl})`;
          }
        }

        // Load the full image
        const blobUrl = await createBlobUrl(backgroundData.url);
        const finalUrl = blobUrl || backgroundData.url;

        if (blobUrl) {
          if (blobRef.current) {
            URL.revokeObjectURL(blobRef.current);
          }
          blobRef.current = blobUrl;
        }

        // Preload the image
        const img = new Image();
        img.src = finalUrl;

        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        // CRITICAL: Reset overlay to invisible FIRST
        overlay.style.transition = 'none';
        overlay.style.opacity = '0';
        overlay.style.backgroundImage = '';

        // Force a reflow to ensure opacity is actually 0
        void overlay.offsetHeight;

        // Now set the new image
        overlay.style.backgroundImage = `url(${finalUrl})`;

        // Force another reflow
        void overlay.offsetHeight;

        // Re-enable transition
        overlay.style.transition = 'opacity 1.2s ease-in-out';

        // Force another reflow before changing opacity
        void overlay.offsetHeight;

        // Now fade it in
        overlay.style.opacity = '1';

        // After fade completes, swap to main element and reset overlay
        setTimeout(() => {
          element.style.backgroundImage = `url(${finalUrl})`;
          overlay.style.opacity = '0';
          overlay.style.backgroundImage = '';
        }, 1300);
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
 * Hook to get computed filter styles (legacy - for video backgrounds)
 */
export function useBackgroundFilters() {
  return { WebkitFilter: getBackgroundFilterStyle() };
}

/**
 * Hook to get computed overlay filter styles
 */
export function useBackgroundOverlayFilters() {
  return getBackgroundOverlayStyle();
}
