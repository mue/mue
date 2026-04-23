/* global URLSearchParams */

import { safeParseJSON } from '../jsonStorage';

const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_CACHE_ENTRIES = 50;

/**
 * Get all Wikidata cache keys from localStorage
 * @returns {Array<{key: string, timestamp: number}>} Array of cache entries with timestamps
 */
function getWikidataCacheEntries() {
  const keys = Object.keys(localStorage);
  return keys
    .filter((key) => key.startsWith('wikidataAuthor_'))
    .map((key) => {
      const cached = safeParseJSON(key);
      return {
        key,
        timestamp: cached?.timestamp || 0,
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Remove oldest cache entries if cache size exceeds limit
 */
function pruneCache() {
  const entries = getWikidataCacheEntries();

  if (entries.length > MAX_CACHE_ENTRIES) {
    const toRemove = entries.length - MAX_CACHE_ENTRIES;
    entries.slice(0, toRemove).forEach((entry) => {
      localStorage.removeItem(entry.key);
    });
  }
}

/**
 * Get cached author data from localStorage
 * @param {string} authorName - Author name
 * @param {string} language - Language code (e.g., 'en', 'fr')
 * @returns {object|null} Cached author data or null
 */
function getCachedAuthorData(authorName, language) {
  const cacheKey = `wikidataAuthor_${authorName.toLowerCase()}_${language}`;
  const cached = safeParseJSON(cacheKey);

  if (!cached) {
    return null;
  }

  const now = Date.now();
  if (cached.timestamp && now - cached.timestamp > CACHE_EXPIRY) {
    localStorage.removeItem(cacheKey);
    return null;
  }

  return cached.data;
}

/**
 * Cache author data in localStorage
 * Prunes old entries if cache exceeds maximum size
 * @param {string} authorName - Author name
 * @param {string} language - Language code
 * @param {object} data - Author data to cache
 */
function cacheAuthorData(authorName, language, data) {
  const cacheKey = `wikidataAuthor_${authorName.toLowerCase()}_${language}`;
  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    }),
  );

  pruneCache();
}

/**
 * Search for an author entity in Wikidata by name
 * @param {string} authorName - Author name to search
 * @param {string} language - Language code for search (default: 'en')
 * @returns {Promise<string|null>} Wikidata entity ID (e.g., 'Q937') or null
 */
async function searchAuthorEntity(authorName, language = 'en') {
  try {
    const params = new URLSearchParams({
      action: 'wbsearchentities',
      search: authorName,
      language: language,
      limit: '1',
      format: 'json',
      origin: '*',
      type: 'item',
    });

    const response = await fetch(`${WIKIDATA_API}?${params}`);
    const data = await response.json();

    if (data.search && data.search.length > 0) {
      return data.search[0].id;
    }

    return null;
  } catch (error) {
    console.error('Error searching Wikidata author:', error);
    return null;
  }
}

/**
 * Extract occupation labels from Wikidata claims
 * Returns the highest-ranked occupation based on Wikidata rank
 * @param {object} claims - Wikidata claims object
 * @param {string} language - Preferred language
 * @returns {Promise<string|null>} Most notable occupation string or null
 */
async function extractOccupations(claims, language) {
  if (!claims || !claims.P106) {
    return null;
  }

  try {
    const occupations = claims.P106.filter((claim) => claim.mainsnak?.datavalue?.value?.id).map(
      (claim) => ({
        id: claim.mainsnak.datavalue.value.id,
        rank: claim.rank || 'normal', // 'preferred', 'normal', 'deprecated'
      }),
    );

    if (occupations.length === 0) {
      return null;
    }

    const rankOrder = { preferred: 0, normal: 1, deprecated: 2 };
    occupations.sort((a, b) => rankOrder[a.rank] - rankOrder[b.rank]);

    const topOccupation = occupations[0];

    const params = new URLSearchParams({
      action: 'wbgetentities',
      ids: topOccupation.id,
      props: 'labels',
      languages: `${language}|en`,
      format: 'json',
      origin: '*',
    });

    const response = await fetch(`${WIKIDATA_API}?${params}`);
    const data = await response.json();

    const entity = data.entities?.[topOccupation.id];
    if (!entity?.labels) return null;

    const label = entity.labels[language]?.value || entity.labels['en']?.value;
    return label || null;
  } catch (error) {
    console.error('Error extracting occupations:', error);
    return null;
  }
}

/**
 * Get image URL using Wikimedia Commons API (more reliable than MD5 hashing)
 * @param {string} filename - Image filename from Wikidata
 * @returns {Promise<string|null>} Image URL or null
 */
async function getCommonsImageUrl(filename) {
  try {
    const params = new URLSearchParams({
      action: 'query',
      titles: `File:${filename}`,
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: '300',
      format: 'json',
      origin: '*',
    });

    const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
    const data = await response.json();

    const pages = data.query?.pages;
    if (!pages) return null;

    const pageId = Object.keys(pages)[0];
    const imageUrl = pages[pageId]?.imageinfo?.[0]?.thumburl || pages[pageId]?.imageinfo?.[0]?.url;

    return imageUrl || null;
  } catch (error) {
    console.error('Error fetching Commons image URL:', error);
    return null;
  }
}

/**
 * Extract Wikipedia link from Wikidata sitelinks
 * @param {object} sitelinks - Wikidata sitelinks object
 * @param {string} language - Preferred language
 * @returns {string|null} Wikipedia URL or null
 */
function extractWikipediaLink(sitelinks, language) {
  if (!sitelinks) {
    return null;
  }

  const preferredSite = `${language}wiki`;
  if (sitelinks[preferredSite]) {
    return sitelinks[preferredSite].url;
  }

  if (sitelinks.enwiki) {
    return sitelinks.enwiki.url;
  }

  return null;
}

/**
 * Fetch author information from Wikidata
 * @param {string} authorName - Author name
 * @param {string} language - Language code (default: 'en')
 * @returns {Promise<object|null>} Author data object or null
 */
export async function fetchAuthorFromWikidata(authorName, language = 'en') {
  if (!authorName || authorName === 'Unknown') {
    return null;
  }

  const cached = getCachedAuthorData(authorName, language);
  if (cached) {
    return cached;
  }

  try {
    const entityId = await searchAuthorEntity(authorName, language);
    if (!entityId) {
      cacheAuthorData(authorName, language, null);
      return null;
    }

    const params = new URLSearchParams({
      action: 'wbgetentities',
      ids: entityId,
      props: 'claims|sitelinks|descriptions',
      languages: `${language}|en`,
      format: 'json',
      origin: '*',
    });

    const response = await fetch(`${WIKIDATA_API}?${params}`);
    const data = await response.json();
    const entity = data.entities?.[entityId];

    if (!entity) {
      cacheAuthorData(authorName, language, null);
      return null;
    }

    const claims = entity.claims;
    const sitelinks = entity.sitelinks;

    const occupation = await extractOccupations(claims, language);

    let imageUrl = null;
    if (claims.P18 && claims.P18.length > 0) {
      const filename = claims.P18[0].mainsnak?.datavalue?.value;
      if (filename) {
        imageUrl = await getCommonsImageUrl(filename);
      }
    }

    const wikipediaLink = extractWikipediaLink(sitelinks, language);

    const description =
      entity.descriptions?.[language]?.value || entity.descriptions?.['en']?.value;

    const authorData = {
      entityId,
      occupation,
      imageUrl,
      wikipediaLink,
      description,
      imageLicense: imageUrl ? 'Wikimedia Commons' : null,
    };

    cacheAuthorData(authorName, language, authorData);

    return authorData;
  } catch (error) {
    console.error('Error fetching author from Wikidata:', error);
    return null;
  }
}

/**
 * Clear all Wikidata cache
 */
export function clearWikidataCache() {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith('wikidataAuthor_')) {
      localStorage.removeItem(key);
    }
  });
}
