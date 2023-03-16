import rgbToHsv from './rgbToHsv';
import setRgba from './setRgba';

const hexRegexp = /(^#{0,1}[0-9A-F]{6}$)|(^#{0,1}[0-9A-F]{3}$)|(^#{0,1}[0-9A-F]{8}$)/i;
const regexp = /([0-9A-F])([0-9A-F])([0-9A-F])/i;

/**
 * It takes a hex color code and returns an object with the color's RGB and HSV values
 * @param value - The hex value to convert to RGB.
 * @returns An object with the properties red, green, blue, alpha, hue, saturation, and value.
 */
export default function hexToRgb(value) {
  const valid = hexRegexp.test(value);

  if (valid) {
    if (value[0] === '#') {
      value = value.slice(1, value.length);
    }

    if (value.length === 3) {
      value = value.replace(regexp, '$1$1$2$2$3$3');
    }

    const red = parseInt(value.substr(0, 2), 16);
    const green = parseInt(value.substr(2, 2), 16);
    const blue = parseInt(value.substr(4, 2), 16);
    const alpha = parseInt(value.substr(6, 2), 16) / 255;

    const color = setRgba(red, green, blue, alpha);
    const hsv = rgbToHsv({ ...color });

    return {
      ...color,
      ...hsv,
    };
  }

  return false;
}
