/**
 * Queue Operations
 * Centralized queue clearing logic for background prefetch queues
 */

/**
 * Queue key mapping for each background type
 */
const QUEUE_KEYS = {
  api: 'imageQueue',
  photo_pack: 'photoPackQueue',
  custom: 'customQueue',
};

/**
 * Clear background prefetch queues
 * @param {string} type - Queue type to clear: 'all', 'api', 'photo_pack', or 'custom'
 *
 * @example
 * // Clear all queues
 * clearBackgroundQueues('all');
 *
 * // Clear only API queue
 * clearBackgroundQueues('api');
 */
export function clearBackgroundQueues(type = 'all') {
  try {
    if (type === 'all') {
      // Clear all queue types
      Object.values(QUEUE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } else if (QUEUE_KEYS[type]) {
      // Clear specific queue type
      localStorage.removeItem(QUEUE_KEYS[type]);
    } else {
      console.warn(`Unknown queue type: ${type}`);
    }
  } catch (error) {
    console.error('Failed to clear background queues:', error);
  }
}

/**
 * Clear queues based on setting changes
 * Maps specific setting changes to the appropriate queue clearing strategy
 *
 * @param {string} settingName - The name of the setting that changed
 *
 * @example
 * // User changed background type
 * clearQueuesOnSettingChange('backgroundType');
 *
 * // User changed API categories
 * clearQueuesOnSettingChange('apiCategories');
 *
 * // User installed a photo pack
 * clearQueuesOnSettingChange('packInstall');
 */
export function clearQueuesOnSettingChange(settingName) {
  const clearTriggers = {
    // Clear all queues
    backgroundType: 'all', // Background type changed

    // Clear API queue only
    backgroundAPI: 'api', // API provider changed (Mue <-> Unsplash)
    apiCategories: 'api', // Categories changed
    apiQuality: 'api', // Quality changed
    unsplashCollections: 'api', // Unsplash collections changed
    backgroundExclude: 'api', // Exclude list changed

    // Clear photo pack queue only
    packInstall: 'photo_pack', // Photo pack installed
    packUninstall: 'photo_pack', // Photo pack uninstalled

    // Clear custom queue only
    customModified: 'custom', // Custom background modified
    customDeleted: 'custom', // Custom background deleted
  };

  const queueType = clearTriggers[settingName];
  if (queueType) {
    clearBackgroundQueues(queueType);
  } else {
    console.warn(`No queue clearing mapped for setting: ${settingName}`);
  }
}

/**
 * Get the queue key for a specific background type
 * @param {string} type - Background type: 'api', 'photo_pack', or 'custom'
 * @returns {string} The localStorage key for that queue
 */
export function getQueueKey(type) {
  return QUEUE_KEYS[type] || null;
}

export default {
  clearBackgroundQueues,
  clearQueuesOnSettingChange,
  getQueueKey,
};
