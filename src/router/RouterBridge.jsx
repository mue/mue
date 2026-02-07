import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { parseDeepLink } from 'utils/deepLinking';

/**
 * RouterBridge - Bridges React Router with existing navigation system
 *
 * During migration, this component helps coordinate between:
 * 1. React Router's location state
 * 2. Existing deepLinkData prop system
 * 3. Legacy hash-based navigation
 *
 * This allows gradual migration without breaking existing functionality
 */
export function useRouterBridge() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // Convert router location to deepLinkData format for backward compatibility
  const getDeepLinkData = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);

    if (pathParts.length === 0) {
      return null;
    }

    const tab = pathParts[0]; // settings, discover, or library
    const section = pathParts[1]; // section name or category
    const subSection = pathParts[2]; // subsection or item ID
    const itemId = pathParts[2]; // for discover items

    const result = {
      tab,
      section: section || null,
      subSection: subSection || null,
      itemId: itemId || null,
    };

    // Special handling for discover routes
    if (tab === 'discover') {
      result.category = section || null;

      // If we have a collection route
      if (section === 'collection') {
        result.collection = subSection;
        result.fromCollection = !!pathParts[3];
        if (pathParts[3]) {
          result.itemId = pathParts[3];
        }
      }
      // If we have an item route without category (/discover/item/:itemId)
      else if (section === 'item') {
        result.itemId = subSection;
        result.category = 'all'; // Default to 'all' category
      }
    }

    return result;
  };

  // Note: Hash syncing is handled by React Router's createHashRouter
  // No manual sync needed - would cause infinite loops

  return {
    deepLinkData: getDeepLinkData(),
    navigate,
    location,
    params,
  };
}

/**
 * Hook to navigate using the router in place of updateHash
 * Provides API compatibility with legacy navigation system
 */
export function useRouterNavigation() {
  const navigate = useNavigate();

  const navigateToPath = (hash) => {
    // Remove leading '#' if present
    const path = hash.startsWith('#') ? hash.slice(1) : hash;
    navigate(path);
  };

  return { navigate: navigateToPath };
}
