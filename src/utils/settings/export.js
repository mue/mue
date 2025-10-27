import { saveFile } from 'utils/saveFile';
import variables from 'config/variables';

/**
 * It takes all the settings from localStorage and saves them to a file
 */
export function exportSettings() {
  const settings = {};

  Object.keys(localStorage).forEach((key) => {
    settings[key] = localStorage.getItem(key);
  });

  const date = new Date();
  // Format the date as YYYY-MM-DD_HH-MM-SS
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
  const filename = `mue_settings_backup_${formattedDate}.json`;
  saveFile(settings, filename);
  variables.stats.postEvent('tab', 'Settings exported');
}
