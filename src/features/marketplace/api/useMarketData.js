import { useState, useEffect } from 'react';
import variables from 'config/variables';

const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
};

export const useItemsData = (type = 'all') => {
  const url = `${variables.constants.API_URL}/marketplace/${type === 'collections' ? 'collections' : `items/${type}`}`;
  return useFetchData(url);
};

export const useCollectionsData = () => {
  const url = `${variables.constants.API_URL}/marketplace/collections`;
  return useFetchData(url);
};

export const useItemData = (itemType, itemName) => {
  const url = `${variables.constants.API_URL}/marketplace/item/${itemType}/${itemName}`;
  return useFetchData(url);
};

export const useCollectionData = (collectionName) => {
  const url = `${variables.constants.API_URL}/marketplace/collection/${collectionName}`;
  return useFetchData(url);
};
