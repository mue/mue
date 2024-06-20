import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [installedItems, setInstalledItems] = useState(
    JSON.parse(localStorage.getItem('installed')) || [],
  );

  let numOfRequests = 0;
  const controller = new AbortController();

  const getItems = async (type = 'all') => {
    setDone(false);
    const dataURL =
      variables.constants.API_URL +
      (type === 'collections' ? '/marketplace/collections' : '/marketplace/items/' + type);

    const { data } = await (
      await fetch(dataURL, {
        signal: controller.signal,
      })
    ).json();

    if (controller.signal.aborted === true) {
      return;
    }

    //console.log(data);
    numOfRequests++;
    console.log('Request number: ', numOfRequests);

    //setItems(sortItems(data, 'z-a'));
    const shuffledData = data.sort(() => Math.random() - 0.5);

    setItems(shuffledData);

    setDone(true);
  };

  const getCollections = async () => {
    setDone(false);
    const { data } = await (
      await fetch(`${variables.constants.API_URL}/marketplace/collections`, {
        signal: controller.signal,
      })
    ).json();

    if (controller.signal.aborted === true) {
      return;
    }

    console.log(data);

    setCollections(data);
    setDone(true);
  };

  const getItemData = async (itemType, itemName) => {
    const response = await fetch(
      `${variables.constants.API_URL}/marketplace/item/${itemType}/${itemName}`,
      {
        signal: controller.signal,
      },
    );
    const item = await response.json();
    setSelectedItem(item.data);
    return new Promise((resolve) => {
      resolve(item.data);
    });
  };

  const getCollectionData = async (collectionName) => {
    const response = await fetch(
      `${variables.constants.API_URL}/marketplace/collection/${collectionName}`,
      {
        signal: controller.signal,
      },
    );
    const item = await response.json();
    setSelectedCollection(item.data);
    return new Promise((resolve) => {
      resolve(item.data);
    });
  };

  const installItem = () => {
    if (!installedItems.some((item) => item.name === selectedItem.name)) {
      setInstalledItems([...installedItems, selectedItem]);
      localStorage.setItem('installed', JSON.stringify(installedItems));
    }
    console.log('type', selectedItem.type, 'name', selectedItem.name, 'installed', installedItems);
    if (selectedItem.type === 'quotes') {
      let quotePacks = JSON.parse(localStorage.getItem('quote_packs')) || {};
      quotePacks[selectedItem.name] = selectedItem.quotes;
      localStorage.setItem('quote_packs', JSON.stringify(quotePacks));
    }
  };

  const uninstallItem = () => {
    setInstalledItems(installedItems.filter((item) => item.name !== selectedItem.name));
    localStorage.setItem('installed', JSON.stringify(installedItems));
    if (selectedItem.type === 'quotes') {
      let quotePacks = JSON.parse(localStorage.getItem('quote_packs')) || {};
      delete quotePacks[selectedItem.name];
      localStorage.setItem('quote_packs', JSON.stringify(quotePacks));
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
