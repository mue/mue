import { toast } from 'react-toastify';
import variables from 'config/variables';

/**
 * It takes a JSON file of Mue settings, parses it, and then sets the localStorage values to the values in the
 * file.
 * @param e - The JSON settings string to import
 */
export function importSettings(e, initial = false) {
  const content = JSON.parse(e);

  Object.keys(content).forEach((key) => {
    localStorage.setItem(key, content[key]);
  });

  // Handle legacy API background type - convert to photo_pack and trigger migration
  if (localStorage.getItem('backgroundType') === 'api') {
    localStorage.setItem('backgroundType', 'photo_pack');
    localStorage.removeItem('api_migration_completed');
  }

  // Handle legacy API quote type - convert to quote_pack and trigger migration
  if (localStorage.getItem('quoteType') === 'api') {
    localStorage.setItem('quoteType', 'quote_pack');
    localStorage.removeItem('api_migration_completed');
  }

  toast(variables.getMessage('toasts.imported'));
  // don't show achievements on welcome
  if (!initial) {
    variables.stats.postEvent('tab', 'Settings imported');
  }
}
