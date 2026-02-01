import { useCallback } from 'react';
import { safeParseJSON } from 'utils/jsonStorage';

/**
 * Custom hook for caching fetch results with expiry
 * @param {Object} options - Configuration options
 * @param {string} options.cacheKey - The localStorage key for the cache
 * @param {string} options.timestampKey - The localStorage key for the cache timestamp
 * @param {number} options.expiryDays - Number of days before cache expires (default: 7)
 * @returns {Object} - Cache utilities
 */
export function useCachedFetch({ cacheKey, timestampKey, expiryDays = 7 }) {
  // Check if cache is still valid
  const isCacheValid = useCallback(() => {
    const timestamp = localStorage.getItem(timestampKey);
    if (!timestamp) return false;
    const expiryMs = expiryDays * 24 * 60 * 60 * 1000;
    return Date.now() - Number(timestamp) < expiryMs;
  }, [timestampKey, expiryDays]);

  // Get cached data for a specific key
  const getCached = useCallback(
    (key) => {
      const cache = safeParseJSON(cacheKey, {});
      if (isCacheValid() && cache[key]) {
        return cache[key];
      }
      return null;
    },
    [cacheKey, isCacheValid],
  );

  // Fetch with caching
  const fetchWithCache = useCallback(
    async (key, fetchFn) => {
      // Check cache first
      const cached = getCached(key);
      if (cached) {
        return cached;
      }

      // Fetch from source
      const result = await fetchFn(key);

      // Cache the result (even if null/empty, to avoid re-fetching)
      if (result !== null && result !== undefined) {
        const cache = safeParseJSON(cacheKey, {});
        cache[key] = {
          ...result,
          timestamp: Date.now(),
        };
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cache));
          localStorage.setItem(timestampKey, Date.now().toString());
        } catch (error) {
          console.warn('Failed to cache data:', error);
        }
      }

      return result;
    },
    [cacheKey, timestampKey, getCached],
  );

  // Clear cache
  const clearCache = useCallback(() => {
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(timestampKey);
  }, [cacheKey, timestampKey]);

  return {
    isCacheValid,
    getCached,
    fetchWithCache,
    clearCache,
  };
}
