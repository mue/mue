import { safeParseJSON } from './jsonStorage';

/**
 * Manages a prefetch queue for content items
 *
 * @class QueueManager
 * @example
 * const queueManager = new QueueManager('imageQueue', 3);
 * const queue = queueManager.getQueue();
 * if (queue.length > 0) {
 *   const nextImage = queueManager.shift();
 * }
 */
export class QueueManager {
  /**
   * Creates a new queue manager
   * @param {string} storageKey - localStorage key for this queue
   * @param {number} targetSize - Target number of items to keep in queue (default: 3)
   */
  constructor(storageKey, targetSize = 3) {
    this.storageKey = storageKey;
    this.targetSize = targetSize;
  }

  /**
   * Get the current queue from localStorage
   * @returns {Array} The queue array
   */
  getQueue() {
    try {
      return safeParseJSON(this.storageKey, []);
    } catch (error) {
      console.warn(`Failed to get queue from ${this.storageKey}:`, error);
      return [];
    }
  }

  /**
   * Set the queue in localStorage
   * @param {Array} queue - The queue array to save
   */
  setQueue(queue) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(queue));
    } catch (error) {
      console.error(`Failed to save queue to ${this.storageKey}:`, error);
      if (error.name === 'QuotaExceededError') {
        try {
          localStorage.removeItem(this.storageKey);
        } catch (e) {
          console.error('Failed to clear queue after quota error:', e);
        }
      }
    }
  }

  /**
   * Remove and return the first item from the queue
   * @returns {*} The first item in the queue, or undefined if empty
   */
  shift() {
    try {
      const queue = this.getQueue();
      if (queue.length === 0) {
        return undefined;
      }
      const item = queue.shift();
      this.setQueue(queue);
      return item;
    } catch (error) {
      console.error(`Failed to shift queue ${this.storageKey}:`, error);
      return undefined;
    }
  }

  /**
   * Add items to the end of the queue
   * @param {Array} items - Items to add to the queue
   */
  push(items) {
    try {
      const queue = this.getQueue();
      const itemsArray = Array.isArray(items) ? items : [items];
      queue.push(...itemsArray);
      this.setQueue(queue);
    } catch (error) {
      console.error(`Failed to push to queue ${this.storageKey}:`, error);
    }
  }

  /**
   * Clear the queue from localStorage
   */
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error(`Failed to clear queue ${this.storageKey}:`, error);
    }
  }

  /**
   * Check if the queue needs prefetching (below target size)
   * @returns {boolean} True if queue size is below target
   */
  needsPrefetch() {
    const queue = this.getQueue();
    return queue.length < this.targetSize;
  }

  /**
   * Get the number of items needed to reach target size
   * @returns {number} Number of items to prefetch
   */
  getSpaceNeeded() {
    const queue = this.getQueue();
    return Math.max(0, this.targetSize - queue.length);
  }

  /**
   * Get the current queue size
   * @returns {number} Number of items in queue
   */
  size() {
    return this.getQueue().length;
  }
}

export const BackgroundQueueManager = QueueManager;

export default QueueManager;
