/**
 * IndexedDB utility for storing custom background images
 * Uses IndexedDB to overcome localStorage quota limitations
 */

const DB_NAME = 'MueCustomBackgrounds';
const DB_VERSION = 1;
const STORE_NAME = 'backgrounds';

/**
 * Open or create the IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        objectStore.createIndex('url', 'url', { unique: false });
      }
    };
  });
}

/**
 * Get all custom backgrounds as objects
 * @returns {Promise<Array<Object>>} Array of background objects with metadata
 */
export async function getAllBackgroundsWithMetadata() {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const results = request.result;
        // Return array of background objects in order
        // For backward compatibility, convert old string URLs to objects
        resolve(
          results.map((item) => {
            if (typeof item.url === 'string' && !item.name) {
              // Old format - migrate to new format
              return {
                id: item.id,
                url: item.url,
                name: `Image ${item.id}`,
                uploadDate: item.createdAt || Date.now(),
                dimensions: null,
                fileSize: null,
                folder: '',
                blurHash: null,
              };
            }
            return item;
          }),
        );
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting backgrounds from IndexedDB:', error);
    return [];
  }
}

/**
 * Get all custom backgrounds (URLs only for backward compatibility)
 * @returns {Promise<Array<string>>} Array of background URLs
 */
export async function getAllBackgrounds() {
  const backgrounds = await getAllBackgroundsWithMetadata();
  return backgrounds.map((bg) => bg.url || bg);
}

/**
 * Add a new background with metadata
 * @param {Object} backgroundData - The background data object
 * @param {string} backgroundData.url - The background URL (data URL or remote URL)
 * @param {string} backgroundData.name - The filename
 * @param {number} backgroundData.uploadDate - Upload timestamp
 * @param {Object} backgroundData.dimensions - {width, height}
 * @param {number} backgroundData.fileSize - File size in bytes
 * @param {string} backgroundData.folder - Folder name (optional)
 * @param {string} backgroundData.blurHash - BlurHash string (optional)
 * @returns {Promise<number>} The ID of the added background
 */
export async function addBackground(backgroundData) {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  // Support old string format for backward compatibility
  const data =
    typeof backgroundData === 'string'
      ? { url: backgroundData, name: 'Image', uploadDate: Date.now(), folder: '' }
      : { ...backgroundData, uploadDate: backgroundData.uploadDate || Date.now() };

  const request = store.add(data);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Update a background at a specific index
 * @param {number} index - The index to update (0-based)
 * @param {Object|string} backgroundData - The new background data
 * @returns {Promise<void>}
 */
export async function updateBackground(index, backgroundData) {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  // Get all items to find the one at the specified index
  const getAllRequest = store.getAll();

  return new Promise((resolve, reject) => {
    getAllRequest.onsuccess = () => {
      const items = getAllRequest.result;
      if (items[index]) {
        const item = items[index];

        // Support old string format
        if (typeof backgroundData === 'string') {
          item.url = backgroundData;
        } else {
          Object.assign(item, backgroundData);
        }
        item.updatedAt = Date.now();

        const updateRequest = store.put(item);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        // If index doesn't exist, add it
        addBackground(backgroundData).then(resolve).catch(reject);
      }
    };
    getAllRequest.onerror = () => reject(getAllRequest.error);
  });
}

/**
 * Delete a background at a specific index
 * @param {number} index - The index to delete (0-based)
 * @returns {Promise<void>}
 */
export async function deleteBackground(index) {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  // Get all items to find the one at the specified index
  const getAllRequest = store.getAll();

  return new Promise((resolve, reject) => {
    getAllRequest.onsuccess = () => {
      const items = getAllRequest.result;
      if (items[index]) {
        const deleteRequest = store.delete(items[index].id);
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      } else {
        resolve(); // Index doesn't exist, nothing to delete
      }
    };
    getAllRequest.onerror = () => reject(getAllRequest.error);
  });
}

/**
 * Delete multiple backgrounds by indices
 * @param {Array<number>} indices - Array of indices to delete (0-based)
 * @returns {Promise<void>}
 */
export async function deleteMultipleBackgrounds(indices) {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  // Get all items first
  const getAllRequest = store.getAll();

  return new Promise((resolve, reject) => {
    getAllRequest.onsuccess = () => {
      const items = getAllRequest.result;
      const idsToDelete = indices.filter((index) => items[index]).map((index) => items[index].id);

      // Delete all selected items
      let completed = 0;
      const total = idsToDelete.length;

      if (total === 0) {
        resolve();
        return;
      }

      idsToDelete.forEach((id) => {
        const deleteRequest = store.delete(id);
        deleteRequest.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        };
        deleteRequest.onerror = () => reject(deleteRequest.error);
      });
    };
    getAllRequest.onerror = () => reject(getAllRequest.error);
  });
}

/**
 * Clear all custom backgrounds
 * @returns {Promise<void>}
 */
export async function clearAllBackgrounds() {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.clear();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get count of stored backgrounds
 * @returns {Promise<number>}
 */
export async function getBackgroundCount() {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.count();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Update a background's metadata by ID
 * @param {number} id - The background ID
 * @param {Object} metadata - Metadata to update
 * @returns {Promise<void>}
 */
export async function updateBackgroundMetadata(id, metadata) {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const item = request.result;
      if (item) {
        Object.assign(item, metadata);
        item.updatedAt = Date.now();
        const updateRequest = store.put(item);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error('Background not found'));
      }
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Migrate backgrounds from localStorage to IndexedDB
 * @returns {Promise<boolean>} True if migration occurred
 */
export async function migrateFromLocalStorage() {
  try {
    const stored = localStorage.getItem('customBackground');
    if (!stored || stored === 'null' || stored === '[]') {
      return false;
    }

    let backgrounds = [];
    try {
      backgrounds = JSON.parse(stored);
      if (!Array.isArray(backgrounds)) {
        backgrounds = [stored];
      }
    } catch (e) {
      backgrounds = [stored];
    }

    // Filter out null/empty values
    backgrounds = backgrounds.filter((bg) => bg && bg.trim() !== '');

    if (backgrounds.length === 0) {
      return false;
    }

    // Check if we already have data in IndexedDB
    const count = await getBackgroundCount();
    if (count > 0) {
      return false; // Already migrated
    }

    // Migrate each background
    for (const bg of backgrounds) {
      await addBackground(bg);
    }

    console.log(`Migrated ${backgrounds.length} backgrounds from localStorage to IndexedDB`);

    // Keep localStorage as backup for now, but mark as migrated
    localStorage.setItem('customBackgroundMigrated', 'true');

    return true;
  } catch (error) {
    console.error('Error migrating backgrounds:', error);
    return false;
  }
}
