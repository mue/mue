import { setDefaultSettings } from "./default";

/**
 * Saves all of the current settings, resets them, sets the defaults and then overrides
 * the new settings with the old saved messages where they exist.
 * @returns the result of the setDefaultSettings() function.
 */
export function moveSettings() {
  const currentSettings = Object.keys(localStorage);
  if (currentSettings.length === 0) {
    return this.setDefaultSettings();
  }

  const settings = {};
  currentSettings.forEach((key) => {
    settings[key] = localStorage.getItem(key);
  });

  localStorage.clear();
  setDefaultSettings();

  Object.keys(settings).forEach((key) => {
    localStorage.setItem(key, settings[key]);
  });
}
