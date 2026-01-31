/**
 * Frequency Manager
 * Manages time-based update frequencies for backgrounds and quotes
 */

export const FREQUENCY_INTERVALS = {
  refresh: 0, // Every tab refresh (immediate)
  minute: 60 * 1000, // 1 minute
  thirty: 30 * 60 * 1000, // 30 minutes
  hour: 60 * 60 * 1000, // 1 hour
  day: 24 * 60 * 60 * 1000, // 24 hours
};

export const FREQUENCY_OPTIONS = [
  { value: 'refresh', text: 'modals.main.settings.sections.background.frequency.refresh' },
  { value: 'minute', text: 'modals.main.settings.sections.background.frequency.minute' },
  { value: 'thirty', text: 'modals.main.settings.sections.background.frequency.thirty' },
  { value: 'hour', text: 'modals.main.settings.sections.background.frequency.hour' },
  { value: 'day', text: 'modals.main.settings.sections.background.frequency.day' },
];

/**
 * Check if enough time has elapsed to update
 * @param {string} type - 'background' or 'quote'
 * @returns {boolean} - true if update needed
 */
export function shouldUpdateByFrequency(type) {
  const frequency = localStorage.getItem(`${type}Frequency`) || 'refresh';

  // Always update on 'refresh' mode
  if (frequency === 'refresh') {
    return true;
  }

  const startTimeKey = `${type}StartTime`;
  const startTime = localStorage.getItem(startTimeKey);

  // If no start time, update and set it
  if (!startTime) {
    localStorage.setItem(startTimeKey, Date.now());
    return true;
  }

  const elapsed = Date.now() - parseInt(startTime, 10);

  // Handle clock changes - if time went backwards, reset
  if (elapsed < 0) {
    localStorage.setItem(startTimeKey, Date.now());
    return true;
  }

  // Handle clock changes - if elapsed is unreasonably large (>7 days), reset
  const MAX_ELAPSED = 7 * 24 * 60 * 60 * 1000; // 7 days
  if (elapsed > MAX_ELAPSED) {
    localStorage.setItem(startTimeKey, Date.now());
    return true;
  }

  const interval = FREQUENCY_INTERVALS[frequency];
  return elapsed >= interval;
}

/**
 * Reset the start time for a type
 * @param {string} type - 'background' or 'quote'
 */
export function resetStartTime(type) {
  localStorage.setItem(`${type}StartTime`, Date.now());
}

/**
 * Get time remaining until next update
 * @param {string} type - 'background' or 'quote'
 * @returns {number} - milliseconds remaining, or 0 if should update
 */
export function getTimeUntilUpdate(type) {
  const frequency = localStorage.getItem(`${type}Frequency`) || 'refresh';

  if (frequency === 'refresh') return 0;

  const startTime = parseInt(localStorage.getItem(`${type}StartTime`), 10);
  if (!startTime) return 0;

  const elapsed = Date.now() - startTime;
  const interval = FREQUENCY_INTERVALS[frequency];
  const remaining = interval - elapsed;

  return Math.max(0, remaining);
}
