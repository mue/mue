import I18n from '@eartharoid/i18n';

const localeLoaders = import.meta.glob('../i18n/locales/*.json');

const loadedTranslations = {};

export async function loadTranslation(locale) {
  if (loadedTranslations[locale]) {
    return loadedTranslations[locale];
  }

  const path = `../i18n/locales/${locale}.json`;
  const loader = localeLoaders[path];

  if (!loader) {
    throw new Error(`Translation file not found for locale: ${locale}`);
  }

  const module = await loader();
  const data = module.default;
  loadedTranslations[locale] = data;

  return data;
}

export async function loadTranslationWithFallback(locale) {
  const enGB = await loadTranslation('en_GB');

  if (locale === 'en_GB') {
    return { en_GB: enGB };
  }

  const targetLocale = await loadTranslation(locale);

  return {
    en_GB: enGB,
    [locale]: targetLocale,
  };
}

export function initTranslations(locale, translations) {
  const i18n = new I18n('en_GB', translations);
  return i18n;
}

export function getAvailableLocales() {
  return Object.keys(localeLoaders).map((path) => {
    const match = path.match(/locales\/(.+)\.json/);
    return match ? match[1] : null;
  }).filter(Boolean);
}

export function getLoadedTranslation(locale) {
  return loadedTranslations[locale];
}
