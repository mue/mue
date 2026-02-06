/**
 * Attribution Helper Utility
 *
 * Provides centralized attribution logic for photo packs, handling:
 * - Attribution config retrieval with intelligent defaults
 * - Provider-specific attribution requirements
 * - UTM parameter management
 * - Backward compatibility with legacy packs
 */

/**
 * Get attribution config for a photo, with intelligent defaults
 * @param {object} photoInfo - Photo metadata from backgroundLoader
 * @returns {object} Complete attribution config with defaults applied
 */
export function getAttributionConfig(photoInfo) {
  // Priority 1: Explicit attribution_config from pack metadata
  if (photoInfo.attribution_config) {
    return applyDefaults(photoInfo.attribution_config, photoInfo);
  }

  // Priority 2: Derive from source identifier
  const sourceParts = (photoInfo.source || '').split(':');
  const provider = sourceParts[sourceParts.length - 1];

  // Priority 3: Legacy hardcoded defaults (for backward compatibility)
  return getDefaultConfigForProvider(provider, photoInfo);
}

/**
 * Apply default values to partial attribution config
 * @param {object} config - Partial attribution config
 * @param {object} photoInfo - Photo metadata
 * @returns {object} Complete attribution config
 */
function applyDefaults(config, photoInfo) {
  const sourceParts = (photoInfo.source || '').split(':');
  const provider = sourceParts[sourceParts.length - 1];

  return {
    enabled: config.enabled !== false,
    photographer_link: config.photographer_link !== false,
    photographer_url_template: config.photographer_url_template || null,
    source_link: config.source_link !== false,
    source_name: config.source_name || capitalize(provider),
    source_url: config.source_url || null,
    utm_enabled: config.utm_enabled === true,
    utm_source: config.utm_source || 'mue',
    utm_medium: config.utm_medium || 'referral',
    photo_page_link: config.photo_page_link !== false,
    format: config.format || 'default',
    custom_text: config.custom_text || null,
  };
}

/**
 * Get default attribution config based on provider
 * Ensures backward compatibility with existing packs
 * @param {string} provider - Provider identifier (unsplash, pexels, etc.)
 * @param {object} photoInfo - Photo metadata
 * @returns {object} Default attribution config
 */
function getDefaultConfigForProvider(provider, photoInfo) {
  const defaults = {
    unsplash: {
      enabled: true,
      photographer_link: true,
      source_link: true,
      source_name: 'Unsplash',
      source_url: 'https://unsplash.com/',
      utm_enabled: true, // CRITICAL for Unsplash API compliance
      utm_source: 'mue',
      utm_medium: 'referral',
      photo_page_link: true,
    },
    pexels: {
      enabled: true,
      photographer_link: true,
      source_link: true,
      source_name: 'Pexels',
      source_url: 'https://www.pexels.com/',
      utm_enabled: false,
      photo_page_link: true,
    },
    pixabay: {
      enabled: true,
      photographer_link: true,
      source_link: true,
      source_name: 'Pixabay',
      source_url: 'https://pixabay.com/',
      utm_enabled: false,
      photo_page_link: true,
    },
    flickr: {
      enabled: true,
      photographer_link: true,
      source_link: true,
      source_name: 'Flickr',
      source_url: 'https://www.flickr.com/',
      utm_enabled: false,
      photo_page_link: true,
    },
    mue: {
      enabled: true,
      photographer_link: true,
      source_link: false,
      utm_enabled: false,
      photo_page_link: true,
    },
    static: {
      enabled: true,
      photographer_link: false,
      source_link: false,
      utm_enabled: false,
      photo_page_link: false,
    },
  };

  // Return provider-specific defaults or fallback to generic defaults
  return defaults[provider] || {
    enabled: photoInfo.hidden !== true,
    photographer_link: !!photoInfo.photographerURL,
    source_link: false,
    utm_enabled: false,
    photo_page_link: !!photoInfo.photoURL,
    source_name: capitalize(provider),
  };
}

/**
 * Build URL with UTM parameters
 * @param {string} url - Original URL
 * @param {object} config - Attribution config
 * @returns {string} URL with UTM parameters appended (if enabled)
 */
export function addUTMParams(url, config) {
  if (!config.utm_enabled || !url) return url;

  const separator = url.includes('?') ? '&' : '?';
  const params = [];

  if (config.utm_source) {
    params.push(`utm_source=${encodeURIComponent(config.utm_source)}`);
  }
  if (config.utm_medium) {
    params.push(`utm_medium=${encodeURIComponent(config.utm_medium)}`);
  }

  return params.length > 0 ? `${url}${separator}${params.join('&')}` : url;
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
