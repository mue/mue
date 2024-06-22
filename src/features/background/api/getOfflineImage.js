import offlineImages from '../offline_images.json';
let lastImage = null;

/**
 * It gets a random photographer from the offlineImages.json file, then gets a random image from that
 * photographer, and returns an object with the image's URL, type, and photoInfo.
 * </code>
 * @param type - 'background' or 'thumbnail'
 * @returns An object with the following properties:
 * url: A string that is the path to the image.
 * type: A string that is the type of image.
 * photoInfo: An object with the following properties:
 * offline: A boolean that is true.
 * credit: A string that is the name of the photographer.
 */
export function getOfflineImage(type) {
  const photographers = Object.keys(offlineImages);
  let photographer;
  let randomImage;

  do {
    photographer = photographers[Math.floor(Math.random() * photographers.length)];
    randomImage =
      offlineImages[photographer].photo[
        Math.floor(Math.random() * offlineImages[photographer].photo.length)
      ];
  } while (lastImage === randomImage);

  lastImage = randomImage;

  const object = {
    url: `offline-images/${randomImage}.webp`,
    type,
    photoInfo: {
      offline: true,
      credit: photographer,
    },
  };

  localStorage.setItem('currentBackground', JSON.stringify(object));
  return object;
}
