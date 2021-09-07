// since there is so much code in the component, we have moved it to a separate file
export function videoCheck(url) {
  return url.startsWith('data:video/') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
}

export function offlineBackground() {
  const offlineImages = require('./offlineImages.json');

  // Get all photographers from the keys in offlineImages.json
  const photographers = Object.keys(offlineImages);
  const photographer = photographers[Math.floor(Math.random() * photographers.length)];

  const randomImage = offlineImages[photographer].photo[
    Math.floor(Math.random() * offlineImages[photographer].photo.length)
  ];

  const object = {
    url: `./offline-images/${randomImage}.webp`,
    photoInfo: {
      offline: true,
      credit: photographer
    }
  };

  localStorage.setItem('currentBackground', JSON.stringify(object));
  return object;
}

export function gradientStyleBuilder({ type, angle, gradient }) {
  // Note: Append the gradient for additional browser support.
  const steps = gradient?.map((v) => `${v.colour} ${v.stop}%`);
  const grad = `background: ${type}-gradient(${type === 'linear' ? `${angle}deg,` : ''}${steps})`;

  return {
    type: 'colour',
    style: `background:${gradient[0]?.colour};${grad}`
  };
}

// source: https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
export function lon2tile(lon, zoom) {
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

export function lat2tile(lat, zoom) {
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}
