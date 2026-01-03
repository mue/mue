import I18n from '@eartharoid/i18n';

import * as ar from 'translations/ar.json';
import * as arz from 'translations/arz.json';
import * as az from 'translations/az.json';
import * as azb from 'translations/azb.json';
import * as bn from 'translations/bn.json';
import * as de_DE from 'translations/de_DE.json';
import * as el from 'translations/el.json';
import * as en_GB from 'translations/en_GB.json';
import * as en_US from 'translations/en_US.json';
import * as es from 'translations/es.json';
import * as es_419 from 'translations/es_419.json';
import * as et from 'translations/et.json';
import * as fa from 'translations/fa.json';
import * as fr from 'translations/fr.json';
import * as hu from 'translations/hu.json';
import * as id_ID from 'translations/id_ID.json';
import * as ja from 'translations/ja.json';
import * as lt from 'translations/lt.json';
import * as lv from 'translations/lv.json';
import * as nl from 'translations/nl.json';
import * as no from 'translations/no.json';
import * as peo from 'translations/peo.json';
import * as pt from 'translations/pt.json';
import * as pt_BR from 'translations/pt_BR.json';
import * as ru from 'translations/ru.json';
import * as sl from 'translations/sl.json';
import * as sv from 'translations/sv.json';
import * as ta from 'translations/ta.json';
import * as tr_TR from 'translations/tr_TR.json';
import * as uk from 'translations/uk.json';
import * as vi from 'translations/vi.json';
import * as zh_CN from 'translations/zh_CN.json';
import * as zh_Hant from 'translations/zh_Hant.json';

/**
 * Initialise the i18n object.
 * The i18n object is then returned.
 * @param locale _ The locale to use.
 * @returns The i18n object.
 */
export function initTranslations(locale) {
  const i18n = new I18n(locale, {
    ar,
    arz,
    az,
    azb,
    bn,
    de_DE,
    el,
    en_GB,
    en_US,
    es,
    es_419,
    et,
    fa,
    fr,
    hu,
    id_ID,
    ja,
    lt,
    lv,
    nl,
    no,
    peo,
    pt,
    pt_BR,
    ru,
    sl,
    sv,
    ta,
    tr_TR,
    uk,
    vi,
    zh_CN,
    zh_Hant
  });

  return i18n;
}

export const translations = {
  ar,
  arz,
  az,
  azb,
  bn,
  de_DE,
  el,
  en_GB,
  en_US,
  es,
  es_419,
  et,
  fa,
  fr,
  hu,
  id_ID,
  ja,
  lt,
  lv,
  nl,
  no,
  peo,
  pt,
  pt_BR,
  ru,
  sl,
  sv,
  ta,
  tr_TR,
  uk,
  vi,
  zh_CN,
  zh_Hant
};
