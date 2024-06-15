import variables from 'config/variables';

import de_DE from 'i18n/locales/achievements/de_DE.json';
import en_GB from 'i18n/locales/achievements/en_GB.json';
import en_US from 'i18n/locales/achievements/en_US.json';
import es from 'i18n/locales/achievements/es.json';
import fr from 'i18n/locales/achievements/fr.json';
import nl from 'i18n/locales/achievements/nl.json';
import no from 'i18n/locales/achievements/no.json';
import ru from 'i18n/locales/achievements/ru.json';
import zh_CN from 'i18n/locales/achievements/zh_CN.json';
import id_ID from 'i18n/locales/achievements/id_ID.json';
import tr_TR from 'i18n/locales/achievements/tr_TR.json';
import bn from 'i18n/locales/achievements/bn.json';
import pt_BR from 'i18n/locales/achievements/pt_BR.json';

import achievements from '../../achievements.json';

import { checkAchievements, newAchievements } from './condition';

const translations = {
  de_DE,
  en_GB,
  en_US,
  es,
  fr,
  nl,
  no,
  ru,
  zh_CN,
  id_ID,
  tr_TR,
  bn,
  pt_BR,
};

// todo: clean this up and condition.js too
function getLocalisedAchievementData(id) {
  const localised = translations[variables.languagecode][id] ||
    translations.en_GB[id] || { name: id, description: '' };

  return {
    name: localised.name,
    description: localised.description,
  };
}

export { achievements, checkAchievements, newAchievements, getLocalisedAchievementData };
