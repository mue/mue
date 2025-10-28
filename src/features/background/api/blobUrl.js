/**
 * Creates a blob URL from a remote URL
 * @param {string} url - The remote URL to fetch
 * @returns {Promise<string|null>} The blob URL or null if failed
 */
export async function createBlobUrl(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to create blob URL:', error);
    return null;
  }
}
