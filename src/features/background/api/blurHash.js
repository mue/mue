import { decodeBlurHash } from 'fast-blurhash';

/**
 * Generates a blur hash placeholder image as a data URL
 * @param {string} blurHash - The blur hash string
 * @param {number} width - Canvas width (default: 32)
 * @param {number} height - Canvas height (default: 32)
 * @returns {string|null} - Data URL of the blur hash image or null if failed
 */
export function generateBlurHashDataUrl(blurHash, width = 32, height = 32) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(decodeBlurHash(blurHash, width, height));
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  } catch (error) {
    console.error('Failed to generate blur hash:', error);
    return null;
  }
}
