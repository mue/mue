/**
 * Creates a blob URL from a remote URL
 * @param {string} url - The remote URL to fetch
 * @returns {Promise<string|null>} The blob URL or null if failed
 */
export async function createBlobUrl(url) {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch {
    // Silently fail - we'll use direct URL as fallback
    return null;
  }
}
