import I18n from '@eartharoid/i18n';

/**
 * Initialise the i18n object.
 * The i18n object is then returned.
 * @param locale - The locale to use.
 * @returns The i18n object.
 */
export default function initTranslations(locale) {
  const i18n = new I18n(locale, {
    de_DE: import('../translations/de_DE.json'),
    en_GB: import('../translations/en_GB.json'),
    en_US: import('../translations/en_US.json'),
    es: import('../translations/es.json'),
    es_419: import('../translations/es_419.json'),
    fr: import('../translations/fr.json'),
    nl: import('../translations/nl.json'),
    no: import('../translations/no.json'),
    ru: import('../translations/ru.json'),
    zh_CN: import('../translations/zh_CN.json'),
    id_ID: import('../translations/id_ID.json'),
    tr_TR: import('../translations/tr_TR.json'),
    pt_BR: import('../translations/pt_BR.json'),
  });

  return i18n;
}
