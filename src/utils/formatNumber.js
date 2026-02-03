/**
 * Convert language code from Mue format (en_US) to locale format (en-US)
 * and add numbering system extensions for languages that use non-Latin numerals
 */
export function getLocaleCode() {
  const language = localStorage.getItem('language')?.replace(/_/g, '-') || 'en-GB';

  // Map language codes to their native numbering systems
  const numberingSystems = {
    ar: 'arab', // Arabic - Eastern Arabic numerals (٠-٩)
    fa: 'arabext', // Persian - Extended Arabic-Indic numerals (۰-۹)
    bn: 'beng', // Bengali - Bengali numerals (০-৯)
    hi: 'deva', // Hindi - Devanagari numerals (०-९)
    mr: 'deva', // Marathi - Devanagari numerals
    ne: 'deva', // Nepali - Devanagari numerals
    ta: 'tamldec', // Tamil - Tamil numerals (௦-௯)
  };

  // Get the base language code (e.g., 'ar' from 'ar-EG')
  const baseLang = language.split('-')[0];

  // If this language has a native numbering system, append it
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
