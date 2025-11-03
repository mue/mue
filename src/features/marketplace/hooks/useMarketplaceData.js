import { useState, useEffect, useRef } from 'react';
import variables from 'config/variables';

const API_V2_BASE = `${variables.constants.API_URL}/marketplace`;

export const useMarketplaceData = (type, deepLinkData) => {
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [displayedCollection, setDisplayedCollection] = useState({});
  const [sortType, setSortType] = useState('a-z');
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(new AbortController());

  const sortItems = (itemsToSort, sortValue) => {
    if (!itemsToSort) return [];

    const sorted = [...itemsToSort];
    const value = sortValue || localStorage.getItem('sortMarketplace') || 'a-z';

    switch (value) {
      case 'a-z':
        sorted.sort((a, b) => {
          if (a.display_name < b.display_name) return -1;
          if (a.display_name > b.display_name) return 1;
          return 0;
        });
        break;
      case 'z-a':
        sorted.sort((a, b) => {
          if (a.display_name < b.display_name) return -1;
          if (a.display_name > b.display_name) return 1;
          return 0;
        });
        sorted.reverse();
        break;
      default:
        break;
    }

    return sorted;
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const dataURL =
        type === 'collections' ? `${API_V2_BASE}/collections` : `${API_V2_BASE}/items/${type}`;

      const [itemsResponse, collectionsResponse] = await Promise.all([
        fetch(dataURL, { signal: controllerRef.current.signal }),
        fetch(`${API_V2_BASE}/collections`, { signal: controllerRef.current.signal }),
      ]);

      const itemsData = await itemsResponse.json();
      const collectionsData = await collectionsResponse.json();

      if (controllerRef.current.signal.aborted) return;

      const sortedItems = sortItems(itemsData.data, sortType);

      setItems(sortedItems);
      setCollections(collectionsData.data);
      setDisplayedCollection(
        collectionsData.data[Math.floor(Math.random() * collectionsData.data.length)] || {},
      );
    } catch (error) {
      if (!controllerRef.current.signal.aborted) {
        console.error('Failed to fetch marketplace data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const changeSort = (value) => {
    localStorage.setItem('sortMarketplace', value);
    const sorted = sortItems(items, value);
    setItems(sorted);
    setSortType(value);
    variables.stats.postEvent('marketplace', 'Sort');
  };

  useEffect(() => {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return;
    }

    fetchItems();

    return () => {
      controllerRef.current.abort();
    };
  }, [type]);

  return {
    items,
    collections,
    displayedCollection,
    sortType,
    loading,
    changeSort,
    refetch: fetchItems,
  };
};
