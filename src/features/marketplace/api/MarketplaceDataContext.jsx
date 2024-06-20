import React, { createContext, useContext, useState, useEffect } from 'react';
import { useItemsData, useCollectionsData, useItemData, useCollectionData } from './useMarketData';
import variables from 'config/variables';

const MarketDataContext = createContext();

export const useMarketData = () => useContext(MarketDataContext);

export const MarketplaceDataProvider = ({ children }) => {
  const [done, setDone] = useState(false);
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [installedItems, setInstalledItems] = useState(
    JSON.parse(localStorage.getItem('installed')) || [],
  );

  const { data: fetchedItems, loading: itemsLoading } = useItemsData();
  const { data: fetchedCollections, loading: collectionsLoading } = useCollectionsData();

  useEffect(() => {
    if (fetchedItems) {
      setItems(fetchedItems.sort(() => Math.random() - 0.5));
      setDone(true);
    }
  }, [fetchedItems]);

  useEffect(() => {
    if (fetchedCollections) {
      setCollections(fetchedCollections);
      setDone(true);
    }
  }, [fetchedCollections]);

  const fetchItemData = async (itemType, itemName) => {
    const url = `${variables.constants.API_URL}/marketplace/item/${itemType}/${itemName}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.data;
  };

  const fetchCollectionData = async (collectionName) => {
    const url = `${variables.constants.API_URL}/marketplace/collection/${collectionName}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.data;
  };

  const getItemData = async (itemType, itemName) => {
    const data = await fetchItemData(itemType, itemName);
    setSelectedItem(data);
    return data;
  };

  const getCollectionData = async (collectionName) => {
    const data = await fetchCollectionData(collectionName);
    setSelectedCollection(data);
    return data;
  };

  const installItem = () => {
    if (!installedItems.some((item) => item.name === selectedItem.name)) {
      const updatedInstalledItems = [...installedItems, selectedItem];
      setInstalledItems(updatedInstalledItems);
      localStorage.setItem('installed', JSON.stringify(updatedInstalledItems));

      const key = `${selectedItem.type}_packs`;
      const packs = JSON.parse(localStorage.getItem(key)) || {};
      packs[selectedItem.name] = selectedItem[selectedItem.type];
      localStorage.setItem(key, JSON.stringify(packs));
    }
  };

  const uninstallItem = () => {
    const updatedInstalledItems = installedItems.filter((item) => item.name !== selectedItem.name);
    setInstalledItems(updatedInstalledItems);
    localStorage.setItem('installed', JSON.stringify(updatedInstalledItems));

    const key = `${selectedItem.type}_packs`;
    const packs = JSON.parse(localStorage.getItem(key)) || {};
    delete packs[selectedItem.name];
    localStorage.setItem(key, JSON.stringify(packs));
  };

  return (
    <MarketDataContext.Provider
      value={{
        done,
        items,
        selectedItem,
        selectedCollection,
        getItemData,
        getCollectionData,
        setSelectedItem,
        setSelectedCollection,
        collections,
        installedItems,
        installItem,
        uninstallItem,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
};
