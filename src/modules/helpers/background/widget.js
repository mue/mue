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

export function randomColourStyleBuilder(type) {
  // randomColour based on https://stackoverflow.com/a/5092872
  const randomColour = () => '#000000'.replace(/0/g, () => {return (~~(Math.random()*16)).toString(16)});
  let style = `background:${randomColour()};`;

  if (type === 'random_gradient') {
    const directions = ['to right', 'to left', 'to bottom', 'to top', 'to bottom right', 'to bottom left', 'to top right', 'to top left'];
    style = `background:linear-gradient(${directions[Math.floor(Math.random() * directions.length)]}, ${randomColour()}, ${randomColour()});`;
  }

  return {
    type: 'colour',
    style
  }
}

// source: https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
export function lon2tile(lon, zoom) {
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

export function lat2tile(lat, zoom) {
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}
