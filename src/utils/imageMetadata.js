import { encode } from 'blurhash';

/**
 * Extract image dimensions from a data URL or File
 * @param {string|File} source - Image source (data URL or File)
 * @returns {Promise<{width: number, height: number}>}
 */
export async function getImageDimensions(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
      // Clean up object URL if created
      if (typeof source !== 'string') {
        URL.revokeObjectURL(img.src);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));

    if (typeof source === 'string') {
      img.src = source;
    } else {
      img.src = URL.createObjectURL(source);
    }
  });
}

/**
 * Generate blur hash from an image
 * @param {string|File} source - Image source (data URL or File)
 * @param {number} componentX - Number of horizontal components (default: 4)
 * @param {number} componentY - Number of vertical components (default: 3)
 * @returns {Promise<string>} BlurHash string
 */
export async function generateBlurHash(source, componentX = 4, componentY = 3) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        // Create canvas to get pixel data
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Use smaller dimensions for faster processing
        const maxSize = 64;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);

        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        const blurHash = encode(
          imageData.data,
          imageData.width,
          imageData.height,
          componentX,
          componentY,
        );

        // Clean up
        if (typeof source !== 'string') {
          URL.revokeObjectURL(img.src);
        }

        resolve(blurHash);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image for blur hash'));

    if (typeof source === 'string') {
      img.src = source;
    } else {
      img.src = URL.createObjectURL(source);
    }
  });
}

/**
 * Calculate file size from data URL
 * @param {string} dataUrl - Data URL string
 * @returns {number} File size in bytes
 */
export function getDataUrlSize(dataUrl) {
  // Remove data URL prefix to get just the base64 string
  const base64String = dataUrl.split(',')[1];
  if (!base64String) {
    return 0;
  }

  // Base64 encoding adds ~33% overhead
  // Actual size = (base64 length * 3) / 4
  const padding = (base64String.match(/=/g) || []).length;
  return Math.floor((base64String.length * 3) / 4 - padding);
}

/**
 * Extract filename from File object or generate default name
 * @param {File|null} file - File object
 * @param {number} index - Index for default naming
 * @returns {string} Filename
 */
export function getFileName(file, index) {
  if (file && file.name) {
    return file.name;
  }
  return `Image ${index + 1}`;
}

/**
 * Calculate total storage used by custom backgrounds only
 * Note: This estimates IndexedDB storage from data URLs
 * @returns {number} Storage size in bytes (estimate)
 */
export function calculateStorageSize() {
  // This is now just an estimate - actual storage is in IndexedDB
  // We'll calculate it properly from the actual background data
  return 0; // Will be calculated from actual backgrounds in the component
}

/**
 * Calculate total localStorage usage (all settings)
 * @returns {number} Total storage size in bytes
 */
export function calculateTotalStorageSize() {
  const settings = {};
  Object.keys(localStorage).forEach((key) => {
    settings[key] = localStorage.getItem(key);
  });
  return new TextEncoder().encode(JSON.stringify(settings)).length;
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted string (e.g., "2.3 MB")
 */
export function formatBytes(bytes) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  if (!bytes) {
    return 'Unknown';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + sizes[i];
}
