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
 *
 * clearBackgroundQueues('all');
 *
 *
 * clearBackgroundQueues('api');
 */
export function clearBackgroundQueues(type = 'all') {
  try {
    if (type === 'all') {
      Object.values(QUEUE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } else if (QUEUE_KEYS[type]) {
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
 *
 * clearQueuesOnSettingChange('backgroundType');
 *
 *
 * clearQueuesOnSettingChange('apiCategories');
 *
 *
 * clearQueuesOnSettingChange('packInstall');
 */
export function clearQueuesOnSettingChange(settingName) {
  const clearTriggers = {
    backgroundType: 'all',

    backgroundAPI: 'api',
    apiCategories: 'api',
    apiQuality: 'api',
    unsplashCollections: 'api',
    backgroundExclude: 'api',

    packInstall: 'photo_pack',
    packUninstall: 'photo_pack',

    customModified: 'custom',
    customDeleted: 'custom',
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
