import { useEffect, useState } from 'react';
import { shouldUpdateByFrequency, FREQUENCY_INTERVALS } from 'utils/frequencyManager';

export function useFrequencyInterval(type, updateCallback) {
  const [frequency, setFrequency] = useState(
    () => localStorage.getItem(`${type}Frequency`) || 'refresh',
  );

  useEffect(() => {
    const handleFrequencyChange = (e) => {
      if (e.detail && e.detail.type === type) {
        const newFrequency = localStorage.getItem(`${type}Frequency`) || 'refresh';
        setFrequency(newFrequency);
      }
    };

    window.addEventListener(`frequencyChanged`, handleFrequencyChange);

    return () => {
      window.removeEventListener(`frequencyChanged`, handleFrequencyChange);
    };
  }, [type]);

  useEffect(() => {
    if (frequency === 'refresh') {
      return;
    }

    let intervalId;

    const startInterval = () => {
      const interval = FREQUENCY_INTERVALS[frequency];
      if (!interval) return;

      intervalId = setInterval(() => {
        if (shouldUpdateByFrequency(type)) {
          updateCallback();
        }
      }, interval);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } else {
        if (shouldUpdateByFrequency(type)) {
          updateCallback();
        }
        startInterval();
      }
    };

    if (!document.hidden) {
      startInterval();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [type, updateCallback, frequency]);
}
