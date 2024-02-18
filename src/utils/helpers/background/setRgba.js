/**
 * It returns true if the value is a number, not NaN, and between 0 and 255.
 * @param value - The value to check.
 * @returns A function that takes a value and returns a boolean.
 */
const isValidRGBValue = (value) => {
  return typeof value === 'number' && Number.isNaN(value) === false && value >= 0 && value <= 255;
};

/**
 * "If the red, green, and blue values are valid, return an object with the red, green, and blue
 * values, and if the alpha value is valid, add it to the object."
 *
 * The function is a bit more complicated than that, but that's the gist of it
 * @param red - The red value of the color.
 * @param green - 0-255
 * @param blue - The blue value of the color.
 * @param alpha - The alpha value of the color.
 * @returns An object with the properties red, green, blue, and alpha.
 */
export default function setRGBA(red, green, blue, alpha) {
  if (isValidRGBValue(red) && isValidRGBValue(green) && isValidRGBValue(blue)) {
    const color = {
      red: red | 0,
      green: green | 0,
      blue: blue | 0,
    };

    if (isValidRGBValue(alpha) === true) {
      color.alpha = alpha | 0;
    }

    return color;
  }
}
