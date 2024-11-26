/**
 * Converts HSL values to Hex color code
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} Hex color code
 */
const hslToHex = (h, s, l) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

/**
 * Generates a random number within a range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Aesthetic color palettes
 */
const PALETTES = {
  nature: [
    { h: [85, 150], s: [40, 70], l: [35, 60] }, // Forest greens
    { h: [200, 240], s: [40, 70], l: [40, 65] }, // Ocean blues
    { h: [35, 45], s: [40, 80], l: [35, 60] }, // Earth tones
    { h: [270, 310], s: [30, 60], l: [40, 65] }, // Lavender
  ],
  sunset: [
    { h: [0, 40], s: [60, 90], l: [45, 65] }, // Warm oranges
    { h: [280, 320], s: [30, 60], l: [40, 65] }, // Soft purples
    { h: [20, 40], s: [70, 90], l: [50, 70] }, // Golden hour
  ],
};

/**
 * Generates an aesthetically pleasing random color
 * @returns {string} Hex color code
 */
const generateRandomColor = () => {
  const palette = PALETTES.nature.concat(PALETTES.sunset);
  const colors = palette[Math.floor(Math.random() * palette.length)];

  const h = randomRange(colors.h[0], colors.h[1]);
  const s = randomRange(colors.s[0], colors.s[1]);
  const l = randomRange(colors.l[0], colors.l[1]);

  return hslToHex(h, s, l);
};

/**
 * Generates a complementary color based on the input color
 * @param {string} baseColor - Base color in hex
 * @returns {string} Complementary color in hex
 */
const getComplementaryColor = (baseColor) => {
  // Convert hex to HSL, shift hue by 180 degrees
  const h = (parseInt(baseColor.slice(1), 16) + 180) % 360;
  const s = randomRange(40, 70);
  const l = randomRange(40, 65);
  return hslToHex(h, s, l);
};

/**
 * Generates random background style based on type
 * @param {string} type - Either 'random_colour' or 'random_gradient'
 * @returns {string} CSS background style string
 */
export function randomColourStyleBuilder(type) {
  if (type === 'random_gradient') {
    const directions = ['to right', 'to bottom right', 'to bottom', 'to bottom left', 'to left'];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const color1 = generateRandomColor();
    const color2 = getComplementaryColor(color1);
    return `linear-gradient(${direction}, ${color1}, ${color2})`;
  }

  return generateRandomColor();
}
