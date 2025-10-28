import offlineImages from '../offline_images.json';

/**
 * Gets a random offline image from the bundled collection
 * @param {string} type - The background type (for storage)
 * @returns {object} Background data object with offline image
 */
export function getOfflineImage(type) {
  const photographers = Object.keys(offlineImages);
  const photographer = photographers[Math.floor(Math.random() * photographers.length)];

  const randomImage =
    offlineImages[photographer].photo[
      Math.floor(Math.random() * offlineImages[photographer].photo.length)
    ];

  const object = {
    url: `src/assets/offline-images/${randomImage}.webp`,
    type,
    photoInfo: {
      offline: true,
      credit: photographer,
    },
  };

  localStorage.setItem('currentBackground', JSON.stringify(object));
  return object;
}
