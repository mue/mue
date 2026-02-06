import variables from 'config/variables';

import achievements from 'utils/data/achievements.json';

import { checkAchievements, newAchievements } from './condition';

const achievementLocaleLoaders = import.meta.glob('../../../i18n/locales/achievements/*.json');
const loadedAchievementTranslations = {};

async function loadAchievementTranslation(locale) {
  if (loadedAchievementTranslations[locale]) {
    return loadedAchievementTranslations[locale];
  }

  const path = `../../../i18n/locales/achievements/${locale}.json`;
  const loader = achievementLocaleLoaders[path];

  if (!loader) {
    if (locale === 'en_GB') {
      console.error('Achievement translation en_GB not found, returning empty object');
      loadedAchievementTranslations[locale] = {};
      return {};
    }
    console.warn(`Achievement translation not found for: ${locale}, falling back to en_GB`);
    return loadAchievementTranslation('en_GB');
  }

  const module = await loader();
  const data = module.default;
  loadedAchievementTranslations[locale] = data;

  return data;
}

async function getLocalisedAchievementData(id) {
  const locale = variables.languagecode;

  let translations = loadedAchievementTranslations[locale];
  if (!translations) {
    translations = await loadAchievementTranslation(locale);
  }

  let localised = translations[id];

  if (!localised && locale !== 'en_GB') {
    const fallbackTranslations = loadedAchievementTranslations.en_GB || await loadAchievementTranslation('en_GB');
    localised = fallbackTranslations[id];
  }

  if (!localised) {
    return { name: id, description: '' };
  }

  return { name: localised.name, description: localised.description };
}

export { achievements, checkAchievements, newAchievements, getLocalisedAchievementData };
