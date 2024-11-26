import variables from 'config/variables';

/**
 * It takes a URL, fetches the resource, and returns a URL to the resource.
 * @param {string} url The URL to fetch.
 * @returns A promise that resolves to a blob URL.
 */
export const toDataURL = async (url) => {
  const res = await fetch(url);
  return URL.createObjectURL(await res.blob());
};

/**
 * It takes a string, makes it lowercase, removes commas, and replaces spaces with dashes.
 * @param {string} text The string to format.
 * @returns A function that takes a string and returns a string.
 */
export const formatText = (text) => {
  return text.toLowerCase().replaceAll(',', '').replaceAll(' ', '-');
};

/**
 * It downloads an image from a URL and saves it to the user's computer.
 * @param {object} info The photo information.
 */
export const downloadImage = async (info) => {
  const link = document.createElement('a');
  link.href = await toDataURL(info.url);
  link.download = `mue-${formatText(info.credit)}-${formatText(info.location)}.jpg`; // image is more likely to be webp or avif btw
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  variables.stats.postEvent('feature', 'background', 'download');
};
