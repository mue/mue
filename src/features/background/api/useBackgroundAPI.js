import { useCallback } from 'react';
import { getRequestURL, formatAPIData } from './backgroundHelpers';
import { getOfflineImage } from './getOfflineImage';
import { supportsAVIF } from './avif';
import defaults from '../options/default';
import Stats from 'features/stats/api/stats';

const useBackgroundAPI = (setBackgroundState) => {
  const getAPIImageData = useCallback(
    async (currentPun) => {
      let apiCategories;
      try {
        apiCategories = JSON.parse(localStorage.getItem('apiCategories'));
      } catch (error) {
        apiCategories = localStorage.getItem('apiCategories');
      }

      const backgroundAPI = localStorage.getItem('backgroundAPI') || defaults.backgroundAPI;
      const apiQuality = localStorage.getItem('apiQuality') || defaults.apiQuality;
      let backgroundExclude = JSON.parse(localStorage.getItem('backgroundExclude')) || [];

      if (currentPun) {
        backgroundExclude.push(currentPun);
      }

      const requestURL = getRequestURL(backgroundAPI, apiCategories, apiQuality, backgroundExclude);
      const accept = `application/json, ${supportsAVIF() ? 'image/avif' : 'image/webp'}`;

      try {
        const response = await fetch(requestURL, { headers: { accept } });
        const data = await response.json();
        return formatAPIData(data, backgroundAPI);
      } catch (e) {
        setBackgroundState(getOfflineImage('api'));
        Stats.postEvent('background', 'image', 'offline');
        return null;
      }
    },
    [setBackgroundState],
  );

  return { getAPIImageData };
};

export default useBackgroundAPI;
