// src/marketplace/Marketplace.js
import { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { useMarketData } from 'features/marketplace/api/MarketplaceDataContext';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Collection } from '../../marketplace/components/Collection';
import { NewItems as Items } from '../../marketplace/components/Items/Items';
import ItemPage from '../../marketplace/views/ItemPage';
import CollectionPage from '../../marketplace/views/CollectionPage';
import { ItemUtilities } from '../../marketplace/components/Elements';

const filterItems = (items, filter) => {
  if (filter === 'all') return items;
  return items.filter((item) => item.type === filter);
};

function Marketplace() {
  const {
    done,
    items = [],
    collections = [],
    getItems,
    getCollections,
    selectedCollection,
    selectedItem,
  } = useMarketData();
  const { subTab } = useTab();
  const [itemsView, setItemsView] = useState('grid');
  const [itemsFilter, setItemsFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);
  const randomIndex = Math.floor(Math.random() * collections.length);
  const collection = collections[randomIndex];

  const fetchMarketData = async () => {
    try {
      await getItems();
      await getCollections();
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  useEffect(() => {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return;
    }
    fetchMarketData();
  }, []);

  useEffect(() => {
    setFilteredItems(filterItems(items, itemsFilter));
  }, [itemsFilter, items]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="modalTabContent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {subTab === '' && selectedItem === null && selectedCollection === null && (
          <>
            <Collection collection={collection} />
            <motion.div key="items">
              <ItemUtilities
                itemsFilter={itemsFilter}
                setItemsFilter={setItemsFilter}
                itemsView={itemsView}
                setItemsView={setItemsView}
              />
              <Items items={filteredItems} view={itemsView} />
            </motion.div>
          </>
        )}
        {selectedItem !== null && (
          <motion.div key="itempage">
            <ItemPage />
          </motion.div>
        )}
        {selectedCollection !== null && (
          <CollectionPage />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(Marketplace);
