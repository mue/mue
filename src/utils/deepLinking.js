import { TAB_TYPES } from '../components/Elements/MainModal/constants/tabConfig';

/**
 * Parse hash from URL
 * Examples (NEW API v2 format):
 * #discover/f41219846700 -> { tab: 'discover', itemId: 'f41219846700' }
 * #discover/preset_settings/f41219846700 -> { tab: 'discover', category: 'preset_settings', itemId: 'f41219846700' }
 * #discover/collection/featured -> { tab: 'discover', collection: 'featured' }
 * #discover/collection/featured/f41219846700 -> { tab: 'discover', collection: 'featured', itemId: 'f41219846700' }
 * #marketplace/74ef53ceed0b -> { tab: 'discover', itemId: '74ef53ceed0b' } (marketplace is aliased to discover)
 * #settings/appearance -> { tab: 'settings', section: 'appearance' }
 * #settings/background/source -> { tab: 'settings', section: 'background', subSection: 'source' }
 * #addons -> { tab: 'addons' }
 *
 * Legacy format (still supported):
 * #discover/quote_packs/digital-stoicism -> converted to item lookup
 */
export const parseDeepLink = (hash = window.location.hash) => {
  if (!hash || hash === '#') {
    return null;
  }

  const path = hash.slice(1);
  const parts = path.split('/');

  const result = {
    tab: parts[0],
    section: parts[1],
    subSection: parts[2],
    itemId: parts[3],
  };

  if (result.tab === 'marketplace') {
    result.tab = 'discover';
  }

  const validTabs = Object.values(TAB_TYPES);
  if (!validTabs.includes(result.tab)) {
    return null;
  }

  if (result.tab === 'settings') {
    if (result.subSection && !result.itemId) {
      result.itemId = null;
    } else if (!result.subSection) {
      result.subSection = null;
    }
  }

  if (result.tab === 'discover') {
    if (result.section === 'collection') {
      result.collection = result.subSection;
      if (result.itemId) {
        result.fromCollection = true;
      } else {
        result.itemId = null;
      }
    } else if (['preset_settings', 'photo_packs', 'quote_packs', 'all'].includes(result.section)) {
      result.category = result.section;
      if (result.subSection) {
        result.itemId = result.subSection;
        result.subSection = null;
      }
    } else if (result.section && !result.subSection) {
      result.itemId = result.section;
      result.section = null;
    }
  }

  return result;
};

/**
 * Create a deep link hash
 * @param {string} tab - The main tab (settings, discover, addons)
 * @param {object} options - Additional options
 * @param {string} options.itemId - Item ID for discover/marketplace items (v2 format)
 * @param {string} options.category - Category for discover/marketplace items (optional)
 * @param {string} options.collection - Collection name for discover/marketplace
 * @param {boolean} options.fromCollection - If item is being viewed from within a collection
 * @param {string} options.section - Section within the tab
 * @param {string} options.subSection - Sub-section within a settings section
 * @returns {string} Hash string
 */
export const createDeepLink = (tab, options = {}) => {
  let hash = `#${tab}`;

  if (tab === 'discover') {
    if (options.collection && options.itemId && options.fromCollection) {
      hash += `/collection/${options.collection}/${options.itemId}`;
    } else if (options.collection) {
      hash += `/collection/${options.collection}`;
    } else if (options.itemId && options.category) {
      hash += `/${options.category}/${options.itemId}`;
    } else if (options.itemId) {
      hash += `/${options.itemId}`;
    } else if (options.category) {
      hash += `/${options.category}`;
    }
  } else if (options.section) {
    hash += `/${options.section}`;
    if (options.subSection) {
      hash += `/${options.subSection}`;
    }
  }

  return hash;
};

/**
 * Update URL hash without triggering page reload
 * @param {string} hash - The hash to set
 * @param {boolean} pushToHistory - If true, adds to browser history (default: true)
 *
 * NOTE: During React Router migration, we don't dispatch popstate events
 * because React Router's HashRouter already handles hash changes automatically.
 * Dispatching extra events causes infinite navigation loops.
 */
export const updateHash = (hash, pushToHistory = true) => {
  if (window.history.pushState) {
    if (pushToHistory) {
      window.history.pushState(null, null, hash);
    } else {
      window.history.replaceState(null, null, hash);
    }
    // Commented out to prevent infinite loops with React Router
    // React Router's HashRouter automatically detects hash changes
    // window.dispatchEvent(new PopStateEvent('popstate'));
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
