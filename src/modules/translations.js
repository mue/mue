import I18n from '@eartharoid/i18n';

import * as de_DE from '../translations/de_DE.json';
import * as en_GB from '../translations/en_GB.json';
import * as en_US from '../translations/en_US.json';
import * as es from '../translations/es.json';
import * as es_419 from '../translations/es_419.json';
import * as fr from '../translations/fr.json';
import * as nl from '../translations/nl.json';
import * as no from '../translations/no.json';
import * as ru from '../translations/ru.json';
import * as zh_CN from '../translations/zh_CN.json';
import * as id_ID from '../translations/id_ID.json';
import * as tr_TR from '../translations/tr_TR.json';
import * as pt_BR from '../translations/pt_BR.json';
import * as bn from '../translations/bn.json';

/**
 * Initialise the i18n object.
 * The i18n object is then returned.
 * @param locale - The locale to use.
 * @returns The i18n object.
 */
export function initTranslations(locale) {
  const i18n = new I18n(locale, {
    de_DE,
    en_GB,
    en_US,
    es,
    es_419,
    fr,
    nl,
    no,
    ru,
    zh_CN,
    id_ID,
    tr_TR,
    pt_BR,
    bn,
  });

  return i18n;
}

export const translations = {
  de_DE,
  en_GB,
  en_US,
  es,
  es_419,
  fr,
  nl,
  no,
  ru,
  zh_CN,
  id_ID,
  tr_TR,
  pt_BR,
  bn,
};
