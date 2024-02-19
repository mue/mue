import defaultSettings from 'utils/data/default_settings.json';
import languages from 'i18n/languages.json';
import variables from 'config/variables';

/**
 * It sets the default settings for the extension
 * @param reset - boolean
 */
export function setDefaultSettings(reset) {
  localStorage.clear();
  defaultSettings.forEach((element) => localStorage.setItem(element.name, element.value));

  // Languages
  const languageCodes = languages.map(({ value }) => value);
  const browserLanguage =
    (navigator.languages &&
      navigator.languages.find((lang) => lang.replace('-', '_') && languageCodes.includes(lang))) ||
    navigator.language.replace('-', '_');

  if (languageCodes.includes(browserLanguage)) {
    localStorage.setItem('language', browserLanguage);
  } else {
    localStorage.setItem('language', 'en_GB');
  }

  localStorage.setItem('tabName', variables.getMessage('tabname'));

  if (reset) {
    localStorage.setItem('showWelcome', false);
  }

  // finally we set this to true so it doesn't run the function on every load
  localStorage.setItem('firstRun', true);
}
