/**
 * It takes a gradient object and returns a style object
 * @returns An object with two properties: type and style.
 */
export function gradientStyleBuilder({ type, angle, gradient }) {
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
