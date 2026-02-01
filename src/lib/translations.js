import I18n from '@eartharoid/i18n';

import ar from 'translations/ar.json';
import arz from 'translations/arz.json';
import az from 'translations/az.json';
import azb from 'translations/azb.json';
import bn from 'translations/bn.json';
import de_DE from 'translations/de_DE.json';
import el from 'translations/el.json';
import en_GB from 'translations/en_GB.json';
import en_US from 'translations/en_US.json';
import es from 'translations/es.json';
import es_419 from 'translations/es_419.json';
import et from 'translations/et.json';
import fa from 'translations/fa.json';
import fr from 'translations/fr.json';
import hu from 'translations/hu.json';
import id_ID from 'translations/id_ID.json';
import ja from 'translations/ja.json';
import lt from 'translations/lt.json';
import lv from 'translations/lv.json';
import nl from 'translations/nl.json';
import no from 'translations/no.json';
import peo from 'translations/peo.json';
import pt from 'translations/pt.json';
import pt_BR from 'translations/pt_BR.json';
import ru from 'translations/ru.json';
import sl from 'translations/sl.json';
import sv from 'translations/sv.json';
import ta from 'translations/ta.json';
import tr_TR from 'translations/tr_TR.json';
import uk from 'translations/uk.json';
import vi from 'translations/vi.json';
import zh_CN from 'translations/zh_CN.json';
import zh_Hant from 'translations/zh_Hant.json';

/**
 * Initialise the i18n object.
 * The i18n object is then returned.
 * @param locale _ The locale to use.
 * @returns The i18n object.
 */
export function initTranslations(locale) {
  const i18n = new I18n('en_GB', {
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
    zh_Hant,
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
  zh_Hant,
};
