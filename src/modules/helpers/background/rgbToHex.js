/**
 * It takes three numbers, converts them to hexadecimal, and returns a string of the three hexadecimal
 * numbers concatenated together
 * @param red - The red value of the color (0-255)
 * @param green - 0
 * @param blue - 0
 * @returns a string of the hexadecimal value of the rgb values passed in.
 */
export default function rgbToHex(red, green, blue) {
  let r16 = red.toString(16);
  let g16 = green.toString(16);
  let b16 = blue.toString(16);

  if (red < 16) {
    r16 = `0${r16}`;
  }

  if (green < 16) {
    g16 = `0${g16}`;
  }

  if (blue < 16) {
    b16 = `0${b16}`;
  }

  return r16 + g16 + b16;
}
