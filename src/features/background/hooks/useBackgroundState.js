import { useState, useCallback } from 'react';

/**
 * Custom hook for managing background state
 */
export function useBackgroundState() {
  const [backgroundData, setBackgroundData] = useState({
    url: '',
    style: '',
    type: '',
    currentAPI: '',
    video: false,
    photoInfo: {
      hidden: false,
      offline: false,
      photographerURL: '',
      photoURL: '',
    },
  });

  const updateBackground = useCallback((newData) => {
    setBackgroundData((prev) => ({
      ...prev,
      ...newData,
      photoInfo: {
        ...prev.photoInfo,
        ...(newData.photoInfo || {}),
      },
    }));
  }, []);

  const resetBackground = useCallback(() => {
    setBackgroundData({
      url: '',
      style: '',
      type: '',
      currentAPI: '',
      video: false,
      photoInfo: { hidden: true },
    });
  }, []);

  return {
    backgroundData,
    updateBackground,
    resetBackground,
  };
}
