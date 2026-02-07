import { useState, useEffect, useCallback } from 'react';
import { API_URL } from 'config/constants';
import { safeParseJSON } from 'utils/jsonStorage';

/**
 * Custom hook for fetching and caching suggested packs from the marketplace
 * @param {string} category - 'quote_packs' or 'photo_packs'
 * @param {number} limit - Number of suggestions to display (default: 4)
 * @param {number} minToShow - Minimum number of suggestions to show, hide if fewer (default: 2)
 * @returns {Object} - { suggestions, loading, error, refresh }
 */
export function useSuggestedPacks(category, limit = 4, minToShow = 2) {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cacheKey = `suggested_${category}`;
  const timestampKey = `${cacheKey}_timestamp`;
  const cacheExpiryMs = 24 * 60 * 60 * 1000; // 24 hours

  const getInstalledPackIds = useCallback(() => {
    const installed = safeParseJSON('installed', []);
    // Create a Set of installed pack IDs for O(1) lookup
    return new Set(installed.map((item) => item.id));
  }, []);

  const isCacheValid = useCallback(() => {
    const timestamp = localStorage.getItem(timestampKey);
    if (!timestamp) return false;
    return Date.now() - Number(timestamp) < cacheExpiryMs;
  }, [timestampKey, cacheExpiryMs]);

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (isCacheValid()) {
        const cached = safeParseJSON(cacheKey, null);
        if (cached && Array.isArray(cached)) {
          const installedIds = getInstalledPackIds();
          const filtered = cached.filter((item) => !installedIds.has(item.id));

          // Only show if we have at least minToShow suggestions
          if (filtered.length >= minToShow) {
            setSuggestions(filtered.slice(0, limit));
          } else {
            setSuggestions(null);
          }
          setLoading(false);
          return;
        }
      }

      // Fetch from API - request more than we need to account for filtering
      const response = await fetch(`${API_URL}/marketplace/trending?limit=${limit + 4}&category=${category}`);

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      const trendingItems = data.data || [];

      // Cache the raw trending results
      try {
        localStorage.setItem(cacheKey, JSON.stringify(trendingItems));
        localStorage.setItem(timestampKey, Date.now().toString());
      } catch (cacheError) {
        console.warn('Failed to cache suggestions:', cacheError);
      }

      // Filter out installed packs
      const installedIds = getInstalledPackIds();
      const filtered = trendingItems.filter((item) => !installedIds.has(item.id));

      // Only show if we have at least minToShow suggestions
      if (filtered.length >= minToShow) {
        setSuggestions(filtered.slice(0, limit));
      } else {
        setSuggestions(null);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch suggested packs:', err);
      setError(err);
      setSuggestions(null);
      setLoading(false);
    }
  }, [category, limit, minToShow, cacheKey, timestampKey, isCacheValid, getInstalledPackIds]);

  const refresh = useCallback(() => {
    // Clear cache and refetch
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(timestampKey);
    fetchSuggestions();
  }, [cacheKey, timestampKey, fetchSuggestions]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return {
    suggestions,
    loading,
    error,
    refresh,
  };
}
