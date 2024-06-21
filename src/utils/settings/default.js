import { languages } from 'lib/i18n';
import variables from 'config/variables';

/**
 * It sets the default settings for the extension
 * @param reset - boolean
 */
export function setDefaultSettings(reset) {
  localStorage.clear();

  // Languages
  const locale_ids = languages;
  const browserLanguage = (navigator.languages && navigator.languages.find((lang) => locale_ids.includes(lang))) || navigator.language;

  if (locale_ids.includes(browserLanguage)) {
    localStorage.setItem('language', browserLanguage);
  } else {
    localStorage.setItem('language', 'en-GB');
  }

  localStorage.setItem('tabName', variables.getMessage('tabname'));

  if (reset) {
    localStorage.setItem('showWelcome', false);
  }

  // finally we set this to true so it doesn't run the function on every load
  localStorage.setItem('firstRun', true);
}
