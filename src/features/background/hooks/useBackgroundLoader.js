import { useCallback, useEffect, useRef } from 'react';
import { getBackgroundData } from '../api/backgroundLoader';
import { shouldUpdateByFrequency, resetStartTime } from 'utils/frequencyManager';

/**
 * Hook for loading and refreshing background data
 */
export function useBackgroundLoader(updateBackground, resetBackground) {
  const isLoadingRef = useRef(false);

  const loadBackground = useCallback(async () => {
    if (isLoadingRef.current) {return;}
    isLoadingRef.current = true;

    try {
      const welcomeTab = localStorage.getItem('welcomeTab');
      if (welcomeTab) {
        const welcomeImage = localStorage.getItem('welcomeImage');
        if (welcomeImage) {
          updateBackground(JSON.parse(welcomeImage));
          return;
        }
      }

      const data = await getBackgroundData();
      if (data) {
        updateBackground(data);
        resetStartTime('background');
      }
    } catch (error) {
      console.error('Failed to load background:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [updateBackground]);

  const refreshBackground = useCallback(() => {
    resetStartTime('background');
    resetBackground();
    loadBackground();
  }, [loadBackground, resetBackground]);

  useEffect(() => {
    if (shouldUpdateByFrequency('background')) {
      loadBackground();
    } else {
      const cached = localStorage.getItem('currentBackground');
      if (cached) {
        try {
          updateBackground(JSON.parse(cached));
        } catch {
          loadBackground();
        }
      } else {
        loadBackground();
      }
    }
  }, [loadBackground, updateBackground]);

  return { loadBackground, refreshBackground };
}
