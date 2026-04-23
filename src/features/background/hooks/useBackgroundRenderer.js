import { useEffect, useRef, useMemo } from 'react';
import { createBlobUrl } from '../api/blobUrl';
import { generateBlurHashDataUrl } from '../api/blurHash';
import { getBackgroundFilterStyle, getBackgroundOverlayStyle } from '../api/backgroundFilters';

const TRANSITION_DURATION = 1200; // milliseconds

/**
 * Hook for rendering backgrounds to the DOM
 */
export function useBackgroundRenderer(backgroundData) {
  const blobRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (backgroundData.video) {
      return;
    }

    const element = document.getElementById('backgroundImage');
    if (!element) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const applyBackground = async () => {
      if (backgroundData.url) {
        const hasTransition = localStorage.getItem('bgtransition') !== 'false';
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!hasTransition || prefersReducedMotion) {
          element.style.background = `url(${backgroundData.url})`;
          document.querySelector('.photoInformation')?.style.setProperty('display', 'flex');
          return;
        }

        let overlay = document.getElementById('backgroundOverlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'backgroundOverlay';
          element.parentNode.insertBefore(overlay, element.nextSibling);
        }

        if (backgroundData.photoInfo?.colour) {
          element.style.backgroundColor = backgroundData.photoInfo.colour;
        }

        if (backgroundData.photoInfo?.blur_hash) {
          const blurHashUrl = generateBlurHashDataUrl(backgroundData.photoInfo.blur_hash, 64, 64);
          if (blurHashUrl) {
            element.style.backgroundImage = `url(${blurHashUrl})`;
          }
        }

        const blobUrl = await createBlobUrl(backgroundData.url);
        const finalUrl = blobUrl || backgroundData.url;

        if (blobUrl) {
          if (blobRef.current) {
            URL.revokeObjectURL(blobRef.current);
          }
          blobRef.current = blobUrl;
        }

        const img = new Image();
        img.src = finalUrl;

        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        overlay.style.transition = 'none';
        overlay.style.opacity = '0';
        overlay.style.backgroundImage = '';

        void overlay.offsetHeight;

        overlay.style.backgroundImage = `url(${finalUrl})`;

        void overlay.offsetHeight;

        overlay.style.transition = `opacity ${TRANSITION_DURATION / 1000}s ease-in-out`;

        void overlay.offsetHeight;

        overlay.style.opacity = '1';

        setTimeout(() => {
          element.style.backgroundImage = `url(${finalUrl})`;
          overlay.style.opacity = '0';
          overlay.style.backgroundImage = '';
        }, TRANSITION_DURATION + 100);
      } else if (backgroundData.style) {
        element.setAttribute('style', backgroundData.style);
      }
    };

    applyBackground();

    return () => {
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const overlay = document.getElementById('backgroundOverlay');
      if (overlay) {
        overlay.remove();
      }
    };
  }, [backgroundData.url, backgroundData.style, backgroundData.video, backgroundData.photoInfo]);
}

/**
 * Hook to get computed filter styles (legacy - for video backgrounds)
 */
export function useBackgroundFilters() {
  return useMemo(() => ({ WebkitFilter: getBackgroundFilterStyle() }), []);
}

/**
 * Hook to get computed overlay filter styles
 */
export function useBackgroundOverlayFilters() {
  return useMemo(() => getBackgroundOverlayStyle(), []);
}
