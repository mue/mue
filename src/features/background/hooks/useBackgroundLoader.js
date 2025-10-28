import { useCallback, useEffect, useRef } from 'react';
import { getBackgroundData } from '../api/backgroundLoader';

/**
 * Hook for loading and refreshing background data
 */
export function useBackgroundLoader(updateBackground, resetBackground) {
  const isLoadingRef = useRef(false);

  const loadBackground = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      // Check for welcome tab first
      const welcomeImage = localStorage.getItem('welcomeImage');
      if (localStorage.getItem('welcomeTab') && welcomeImage) {
        updateBackground(JSON.parse(welcomeImage));
        return;
      }

      const data = await getBackgroundData();
      if (data) updateBackground(data);
    } catch (error) {
      console.error('Failed to load background:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [updateBackground]);

  const refreshBackground = useCallback(() => {
    resetBackground();
    loadBackground();
  }, [loadBackground, resetBackground]);

  // Initial load - only run once on mount
  useEffect(() => {
    const changeMode = localStorage.getItem('backgroundchange');
    if (changeMode === 'refresh' || !changeMode) {
      localStorage.setItem('backgroundStartTime', Date.now());
      loadBackground();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loadBackground, refreshBackground };
}
