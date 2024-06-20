import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import variables from 'config/variables';
import { sortItems } from '../../marketplace/api';

const MarketDataContext = createContext();

export const useMarketData = () => useContext(MarketDataContext);

export const MarketplaceDataProvider = ({ children }) => {
  const [done, setDone] = useState(false);
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [installedItems, setInstalledItems] = useState(() => JSON.parse(localStorage.getItem('installed')) || []);

  const controller = new AbortController();

  const fetchData = async (url, setter) => {
    setDone(false);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const { data } = await response.json();
      if (controller.signal.aborted) {
        return;
      }
      setter(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    } finally {
      setDone(true);
    }
  };

  const getItems = (type = 'all') => {
    const dataURL = `${variables.constants.API_URL}/marketplace/${type === 'collections' ? 'collections' : 'items/' + type}`;
    fetchData(dataURL, (data) => {
      const shuffledData = data.sort(() => Math.random() - 0.5);
      setItems(shuffledData);
    });
  };

  const getCollections = () => {
    const dataURL = `${variables.constants.API_URL}/marketplace/collections`;
    fetchData(dataURL, setCollections);
  };

  const getItemData = async (itemType, itemName) => {
    try {
      const response = await fetch(`${variables.constants.API_URL}/marketplace/item/${itemType}/${itemName}`, {
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const item = await response.json();
      setSelectedItem(item.data);
      return item.data;
    } catch (error) {
      console.error('Fetch item data error:', error);
      return null;
    }
  };

  const getCollectionData = async (collectionName) => {
    try {
      const response = await fetch(`${variables.constants.API_URL}/marketplace/collection/${collectionName}`, {
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const item = await response.json();
      setSelectedCollection(item.data);
      return item.data;
    } catch (error) {
      console.error('Fetch collection data error:', error);
      return null;
    }
  };

  const updateLocalStorage = useCallback((key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  useEffect(() => {
    updateLocalStorage('installed', installedItems);
  }, [installedItems, updateLocalStorage]);

  const installItem = () => {
    if (!installedItems.some((item) => item.name === selectedItem.name)) {
      const updatedItems = [...installedItems, selectedItem];
      setInstalledItems(updatedItems);

      if (selectedItem.type === 'quotes') {
        const quotePacks = JSON.parse(localStorage.getItem('quote_packs')) || {};
        quotePacks[selectedItem.name] = selectedItem.quotes;
        updateLocalStorage('quote_packs', quotePacks);

        if (localStorage.getItem('quoteType') !== 'quote_pack') {
          localStorage.setItem('quoteType', 'quote_pack');
        }
      }

      if (selectedItem.type === 'photos') {
        const photoPacks = JSON.parse(localStorage.getItem('photo_packs')) || {};
        photoPacks[selectedItem.name] = selectedItem.photos;
        updateLocalStorage('photo_packs', photoPacks);
      }
    }
  };

  const uninstallItem = () => {
    const updatedItems = installedItems.filter((item) => item.name !== selectedItem.name);
    setInstalledItems(updatedItems);

    if (selectedItem.type === 'quotes') {
      const quotePacks = JSON.parse(localStorage.getItem('quote_packs')) || {};
      delete quotePacks[selectedItem.name];
      updateLocalStorage('quote_packs', quotePacks);

      if (Object.keys(quotePacks).length === 0) {
        localStorage.setItem('quoteType', 'api');
      }
    }

    if (selectedItem.type === 'photos') {
      const photoPacks = JSON.parse(localStorage.getItem('photo_packs')) || {};
      delete photoPacks[selectedItem.name];
      updateLocalStorage('photo_packs', photoPacks);
    }
  };

  return (
    <MarketDataContext.Provider
      value={{
        done,
        items,
        selectedItem,
        selectedCollection,
        getItems,
        getCollections,
        getItemData,
        getCollectionData,
        setSelectedItem,
        setSelectedCollection,
        collections,
        installedItems,
        setInstalledItems,
        installItem,
        uninstallItem,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
};
