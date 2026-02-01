import { useEffect, useState } from 'react';
import { shouldUpdateByFrequency, FREQUENCY_INTERVALS } from 'utils/frequencyManager';

/**
 * Hook to manage active intervals for time-based content updates
 * Automatically starts/stops intervals based on tab visibility and frequency setting
 *
 * @param {string} type - 'background' or 'quote'
 * @param {Function} updateCallback - Function to call when update is needed
 */
export function useFrequencyInterval(type, updateCallback) {
  // Track frequency in state so we can react to changes
  const [frequency, setFrequency] = useState(
    () => localStorage.getItem(`${type}Frequency`) || 'refresh',
  );

  // Listen for frequency changes via custom storage events
  useEffect(() => {
    const handleFrequencyChange = (e) => {
      // Listen for custom event dispatched when frequency changes
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
    // No interval needed for refresh mode
    if (frequency === 'refresh') {
      return;
    }

    let intervalId;

    const startInterval = () => {
      const interval = FREQUENCY_INTERVALS[frequency];
      if (!interval) return;

      // Set up interval to check and update at the specified frequency
      intervalId = setInterval(() => {
        if (shouldUpdateByFrequency(type)) {
          updateCallback();
        }
      }, interval);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden - clear interval to save resources
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } else {
        // Tab visible - check for catch-up and start interval
        if (shouldUpdateByFrequency(type)) {
          updateCallback();
        }
        startInterval();
      }
    };

    // Start interval if tab is currently visible
    if (!document.hidden) {
      startInterval();
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount or frequency change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [type, updateCallback, frequency]);
}
