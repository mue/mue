/**
 * Deep linking utilities for opening specific marketplace items or tabs
 * from external sources (e.g., website)
 *
 * Updated for Marketplace API v2 with item IDs
 */

import { TAB_TYPES } from '../components/Elements/MainModal/constants/tabConfig';

/**
 * Parse hash from URL
 * Examples (NEW API v2 format):
 * #marketplace/f41219846700 -> { tab: 'marketplace', itemId: 'f41219846700' }
 * #marketplace/preset_settings/f41219846700 -> { tab: 'marketplace', category: 'preset_settings', itemId: 'f41219846700' }
 * #marketplace/collection/featured -> { tab: 'marketplace', collection: 'featured' }
 * #settings/appearance -> { tab: 'settings', section: 'appearance' }
 * #addons -> { tab: 'addons' }
 *
 * Legacy format (still supported):
 * #marketplace/quote_packs/digital-stoicism -> converted to item lookup
 */
export const parseDeepLink = (hash = window.location.hash) => {
  if (!hash || hash === '#') {
    return null;
  }

  // Remove the # symbol
  const path = hash.slice(1);
  const parts = path.split('/');

  const result = {
    tab: parts[0],
    section: parts[1],
    itemId: parts[2],
  };

  // Validate tab
  const validTabs = Object.values(TAB_TYPES);
  if (!validTabs.includes(result.tab)) {
    return null;
  }

  // Handle marketplace-specific parsing
  if (result.tab === 'marketplace') {
    // Check if it's a collection
    if (result.section === 'collection') {
      result.collection = result.itemId;
      result.itemId = null;
    }
    // Check if section is a category (preset_settings, photo_packs, quote_packs)
    else if (['preset_settings', 'photo_packs', 'quote_packs', 'all'].includes(result.section)) {
      result.category = result.section;
      // Third part is the item ID (already in result.itemId)
    }
    // If only one part after marketplace, assume it's an item ID
    else if (result.section && !result.itemId) {
      result.itemId = result.section;
      result.section = null;
    }
  }

  return result;
};

/**
 * Create a deep link hash
 * @param {string} tab - The main tab (settings, marketplace, addons)
 * @param {object} options - Additional options
 * @param {string} options.itemId - Item ID for marketplace items (v2 format)
 * @param {string} options.category - Category for marketplace items (optional)
 * @param {string} options.collection - Collection name for marketplace
 * @param {string} options.section - Section within the tab
 * @returns {string} Hash string
 */
export const createDeepLink = (tab, options = {}) => {
  let hash = `#${tab}`;

  if (tab === 'marketplace') {
    // Collection link
    if (options.collection) {
      hash += `/collection/${options.collection}`;
    }
    // Item with category
    else if (options.itemId && options.category) {
      hash += `/${options.category}/${options.itemId}`;
    }
    // Item without category (direct ID)
    else if (options.itemId) {
      hash += `/${options.itemId}`;
    }
    // Category only
    else if (options.category) {
      hash += `/${options.category}`;
    }
  } else if (options.section) {
    hash += `/${options.section}`;
  }

  return hash;
};

/**
 * Update URL hash without triggering page reload
 */
export const updateHash = (hash) => {
  if (window.history.pushState) {
    window.history.pushState(null, null, hash);
  } else {
    window.location.hash = hash;
  }
};

/**
 * Listen for hash changes
 */
export const onHashChange = (callback) => {
  const handler = () => {
    const deepLink = parseDeepLink();
    if (deepLink) {
      callback(deepLink);
    }
  };

  window.addEventListener('hashchange', handler);

  // Return cleanup function
  return () => window.removeEventListener('hashchange', handler);
};

/**
 * Check if extension should open modal on load based on hash
 */
export const shouldAutoOpenModal = () => {
  const deepLink = parseDeepLink();
  return deepLink !== null;
};

/**
 * Convert item name to ID (for backward compatibility)
 * This requires fetching from API to resolve name -> ID
 * @param {string} category - Item category
 * @param {string} name - Item name
 * @returns {Promise<string|null>} Item ID or null
 */
export const resolveItemNameToId = async (category, name, apiUrl) => {
  try {
    const response = await fetch(`${apiUrl}/v2/marketplace/item/${category}/${name}`);
    const data = await response.json();
    return data?.data?.id || null;
  } catch (error) {
    console.error('Failed to resolve item name to ID:', error);
    return null;
  }
};
