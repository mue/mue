import { memo, useCallback, useEffect, useState, useMemo } from 'react';
import variables from 'config/variables';
import { useMarketData } from 'features/marketplace/api/MarketplaceDataContext';
import MarketplaceTab from '../../marketplace/views/Browse';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';

import { ItemPage } from '../../marketplace/views/ItemPage';
import { NewItems as Items } from '../../marketplace/components/Items/Items';

import { AnimatePresence, motion } from 'framer-motion';
import Collection from '../../marketplace/components/Collection/Collection';
import clsx from 'clsx';

import { PiGridFourFill } from 'react-icons/pi';
import { MdFormatListBulleted } from 'react-icons/md';

const filterTypes = [
  { key: 'all', label: 'marketplace:photo_packs' },
  { key: 'photo_packs', label: 'marketplace:photo_packs' },
  { key: 'quote_packs', label: 'marketplace:quote_packs' },
  { key: 'preset_settings', label: 'marketplace:preset_settings' },
];

const filterItems = (items, filter) => {
  if (filter === 'all') return items;
  return items.filter((item) => item.type === filter);
};

function Marketplace(props) {
  const {
    done,
    items = [],
    collections = [],
    getItems,
    getCollections,
    selectedItem,
  } = useMarketData();
  const { subTab } = useTab();
  const [itemsView, setItemsView] = useState('grid');
  const [itemsFilter, setItemsFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);

  const fetchMarketData = async () => {
    try {
      await getItems();
      await getCollections();
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const FilterOptions = useCallback(() => {
    return (
      <div className="flex flex-row gap-2 my-3">
        {filterTypes.map(({ key, label }) => (
          <div
            key={key}
            onClick={() => setItemsFilter(key)}
            className={clsx(
              'cursor-pointer transition-all duration-200 rounded-full px-6 py-2 text-base',
              {
                'bg-white text-black': itemsFilter === key,
                'bg-[#333] hover:bg-[#222222] text-white': itemsFilter !== key,
              },
            )}
          >
            {key !== 'all' ? <>{variables.getMessage(`${label}`) || 'marketplace'}</> : <>All</>}
          </div>
        ))}
      </div>
    );
  }, [itemsFilter]);

  const viewOptions = useMemo(() => [
    { id: 'grid', icon: <PiGridFourFill /> },
    { id: 'list', icon: <MdFormatListBulleted /> },
  ], []);
  
  const ItemView = useCallback(() => {
    return (
      <div className="flex space-x-1">
        {viewOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setItemsView(option.id)}
            className={`${
              itemsView === option.id ? '' : 'hover:text-white/70'
            } transition-all duration-800	ease-in-out flex flex-row gap-2 items-center relative rounded-sm px-2 py-2 text-xl text-white outline-sky-400 focus-visible:outline-2`}
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {itemsView === option.id && (
              <motion.span
                layoutId="viewSelectorBubble"
                className="absolute inset-0 z-10 bg-[#333] mix-blend-lighten rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            {option.icon}
          </button>
        ))}
      </div>
    );
  }, [itemsView, setItemsView, viewOptions]);

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
        {subTab === '' ? (
          <>
            <Collection collections={collections} />
            <motion.div key="items">
              <div className="w-full flex flex-row justify-between items-center">
                <FilterOptions />
                <div className="flex flex-row gap-2">
                  <ItemView />
                </div>
              </div>
              <Items items={filteredItems} view={itemsView} />
            </motion.div>
          </>
        ) : (
          <motion.div key="itempage">
            <ItemPage />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(Marketplace);
