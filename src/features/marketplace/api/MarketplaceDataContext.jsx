import React, { createContext, useContext, useState, useEffect } from 'react';
import variables from 'config/variables';
import { sortItems } from '../../marketplace/api';

const MarketDataContext = createContext();

export const useMarketData = () => useContext(MarketDataContext);

export const MarketplaceDataProvider = ({ children }) => {
  const [done, setDone] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
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

    setItems(sortItems(data, 'z-a'));
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
  return (
    <MarketDataContext.Provider value={{ done, items, selectedItem, getItems, getItemData, setSelectedItem }}>
      {children}
    </MarketDataContext.Provider>
  );
};
