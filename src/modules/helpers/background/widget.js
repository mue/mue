// since there is so much code in the component, we have moved it to a separate file
import offlineImages from './offlineImages.json';

/**
 * If the URL starts with `data:video/` or ends with `.mp4`, `.webm`, or `.ogg`, then it's a video.
 * @param url - The URL of the file to be checked.
 * @returns A function that takes a url and returns a boolean.
 */
export function videoCheck(url) {
  return (
    url.startsWith('data:video/') ||
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.endsWith('.ogg')
  );
}

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
export function offlineBackground(type) {
  const photographers = Object.keys(offlineImages);
  const photographer = photographers[Math.floor(Math.random() * photographers.length)];

  const randomImage =
    offlineImages[photographer].photo[
      Math.floor(Math.random() * offlineImages[photographer].photo.length)
    ];

  const object = {
    url: `./offline-images/${randomImage}.webp`,
    type,
    photoInfo: {
      offline: true,
      credit: photographer,
    },
  };

  localStorage.setItem('currentBackground', JSON.stringify(object));
  return object;
}

/**
 * It takes a gradient object and returns a style object
 * @returns An object with two properties: type and style.
 */
function gradientStyleBuilder({ type, angle, gradient }) {
  // Note: Append the gradient for additional browser support.
  const steps = gradient?.map((v) => `${v.colour} ${v.stop}%`);
  const grad = `background: ${type}-gradient(${type === 'linear' ? `${angle}deg,` : ''}${steps})`;

  return {
    type: 'colour',
    style: `background:${gradient[0]?.colour};${grad}`,
  };
}

/**
 * It gets the gradient settings from localStorage, parses it, and returns the gradient style.
 * @returns A string.
 */
export function getGradient() {
  const customBackgroundColour = localStorage.getItem('customBackgroundColour') || {
    angle: '180',
    gradient: [{ colour: '#ffb032', stop: 0 }],
    type: 'linear',
  };

  let gradientSettings = '';
  try {
    gradientSettings = JSON.parse(customBackgroundColour);
  } catch (e) {
    const hexColorRegex = /#[0-9a-fA-F]{6}/s;
    if (hexColorRegex.exec(customBackgroundColour)) {
      // Colour used to be simply a hex colour or a NULL value before it was a JSON object. This automatically upgrades the hex colour value to the new standard. (NULL would not trigger an exception)
      gradientSettings = {
        type: 'linear',
        angle: '180',
        gradient: [{ colour: customBackgroundColour, stop: 0 }],
      };
      localStorage.setItem('customBackgroundColour', JSON.stringify(gradientSettings));
    }
  }

  if (typeof gradientSettings === 'object' && gradientSettings !== null) {
    return gradientStyleBuilder(gradientSettings);
  }
}

/**
 * It returns a random colour or random gradient as a style object
 * @param type - The type of the style. This is used to determine which style builder to use.
 * @returns An object with two properties: type and style.
 */
export function randomColourStyleBuilder(type) {
  // randomColour based on https://stackoverflow.com/a/5092872
  const randomColour = () =>
    '#000000'.replace(/0/g, () => {
      return (~~(Math.random() * 16)).toString(16);
    });
  let style = `background:${randomColour()};`;

  if (type === 'random_gradient') {
    const directions = [
      'to right',
      'to left',
      'to bottom',
      'to top',
      'to bottom right',
      'to bottom left',
      'to top right',
      'to top left',
    ];
    style = `background:linear-gradient(${
      directions[Math.floor(Math.random() * directions.length)]
    }, ${randomColour()}, ${randomColour()});`;
  }

  return {
    type: 'colour',
    style,
  };
}
