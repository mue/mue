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

  toast(variables.getMessage('toasts.imported'));
  // don't show achievements on welcome
  if (!initial) {
    variables.stats.postEvent('tab', 'Settings imported');
  }
}
