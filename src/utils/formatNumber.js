/**
 * Convert language code from Mue format (en_US) to locale format (en-US)
 * and add numbering system extensions for languages that use non-Latin numerals
 */
export function getLocaleCode() {
  const language = localStorage.getItem('language')?.replace(/_/g, '-') || 'en-GB';

  const numberingSystems = {
    ar: 'arab',
    fa: 'arabext',
    bn: 'beng',
    hi: 'deva',
    mr: 'deva',
    ne: 'deva',
    ta: 'tamldec',
  };

  const baseLang = language.split('-')[0];

  if (numberingSystems[baseLang]) {
    return `${language}-u-nu-${numberingSystems[baseLang]}`;
  }

  return language;
}

/**
 * Format number with locale awareness (if enabled)
 * @param {number} value - The number to format
 * @param {Intl.NumberFormatOptions} options - Optional Intl.NumberFormat options
 * @returns {string} Formatted number string
 */
export function formatNumber(value, options = {}) {
  const localeFormatting = localStorage.getItem('localeFormatting');
  if (localeFormatting === 'false' || localeFormatting === null) {
    return String(value);
  }
  try {
    return new Intl.NumberFormat(getLocaleCode(), options).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Format percentage with locale awareness (if enabled)
 * @param {number} value - The decimal value (e.g., 0.45 for 45%)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value) {
  const localeFormatting = localStorage.getItem('localeFormatting');
  if (localeFormatting === 'false') {
    return Math.round(value * 100) + '%';
  }
  try {
    return new Intl.NumberFormat(getLocaleCode(), {
      style: 'percent',
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return Math.round(value * 100) + '%';
  }
}

/**
 * Format digits with locale-specific numerals (e.g., Eastern Arabic numerals for Arabic)
 * @param {string|number} value - The value to format (e.g., '10', 23)
 * @returns {string} Formatted string with locale-specific numerals
 */
export function formatDigits(value) {
  const localeFormatting = localStorage.getItem('localeFormatting');
  if (localeFormatting === 'false') {
    return String(value);
  }
  try {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(numValue)) {
      return String(value);
    }
    return new Intl.NumberFormat(getLocaleCode(), {
      useGrouping: false,
    }).format(numValue);
  } catch {
    return String(value);
  }
}
