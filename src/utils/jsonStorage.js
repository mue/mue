/**
 * Safely parse JSON from localStorage with fallback
 * @param {string} key - The localStorage key to retrieve
 * @param {*} fallback - The fallback value if parsing fails or key doesn't exist
 * @param {boolean} reinitialize - Whether to reinitialize corrupt data with fallback
 * @returns {*} The parsed value or fallback
 */
export function safeParseJSON(key, fallback = null, reinitialize = false) {
  const item = localStorage.getItem(key);
  if (item === null || item === 'null') {
    return fallback;
  }
  try {
    const parsed = JSON.parse(item);
    return parsed !== null ? parsed : fallback;
  } catch (error) {
    if (reinitialize && fallback !== null) {
      localStorage.setItem(key, JSON.stringify(fallback));
    }
    return fallback;
  }
}
