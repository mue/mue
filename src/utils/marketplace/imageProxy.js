/**
 * Applies DuckDuckGo image proxy to a URL if the setting is enabled
 * @param {string} url - The original image URL
 * @returns {string} - The proxied URL or original URL
 */
export function getProxiedImageUrl(url) {
  const useDDGProxy = localStorage.getItem('marketplaceDDGProxy') === 'true';

  if (!useDDGProxy || !url) {
    return url;
  }

  try {
    const encodedUrl = encodeURIComponent(url);
    return `https://proxy.duckduckgo.com/iu/?u=${encodedUrl}`;
  } catch (error) {
    console.warn('Failed to encode image URL for DDG proxy:', error);
    return url;
  }
}
