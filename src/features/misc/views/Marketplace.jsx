import { memo, useEffect, useState } from 'react';
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
import {
  MdFormatListBulleted,
  MdFilterListAlt,
  MdOutlineArrowForward,
  MdOutlineOpenInNew,
} from 'react-icons/md';

function Marketplace(props) {
  const { done, items, collections, getItems, getCollections, selectedItem } = useMarketData();
  const { subTab } = useTab();
  const [itemsView, setItemsView] = useState('grid');
  const [itemsFilter, setItemsFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortItems, setSortItems] = useState('a-z');

  const FilterOptions = () => {
    return (
      <div className="flex flex-row gap-2 my-3">
        <div
          onClick={() => {
            setItemsFilter('all');
          }}
          className={clsx(
            'cursor-pointer transition-all duration-200 rounded-full px-6 py-2 text-base ',
            {
              'bg-white text-black': itemsFilter === 'all',
              'bg-[#333] hover:bg-[#222222] text-white cursor:pointer': itemsFilter !== 'all',
            },
          )}
        >
          All
        </div>
        <div
          onClick={() => {
            setItemsFilter('photo_packs');
          }}
          className={clsx(
            'cursor-pointer transition-all duration-200 rounded-full px-6 py-2 text-base ',
            {
              'bg-white text-black': itemsFilter === 'photo_packs',
              'bg-[#333] hover:bg-[#222222] text-white cursor:pointer':
                itemsFilter !== 'photo_packs',
            },
          )}
        >
          {variables.getMessage('marketplace:photo_packs') || 'marketplace'}
        </div>
        <div
          onClick={() => {
            setItemsFilter('quote_packs');
          }}
          className={clsx(
            'cursor-pointer transition-all duration-200 rounded-full px-6 py-2 text-base ',
            {
              'bg-white text-black': itemsFilter === 'quote_packs',
              'bg-[#333] hover:bg-[#222222] text-white': itemsFilter !== 'quote_packs',
            },
          )}
        >
          {variables.getMessage('marketplace:quote_packs') || 'marketplace'}
        </div>
        <div
          onClick={() => {
            setItemsFilter('preset_settings');
          }}
          className={clsx(
            'cursor-pointer transition-all duration-200 rounded-full px-6 py-2 text-base ',
            {
              'bg-white text-black': itemsFilter === 'preset_settings',
              'bg-[#333] hover:bg-[#222222] text-white': itemsFilter !== 'preset_settings',
            },
          )}
        >
          {variables.getMessage('marketplace:preset_settings') || 'marketplace'}
        </div>
      </div>
    );
  };

  const ItemView = () => {
    return (
      <div className="flex flex-row gap-2">
        <button
          onClick={() => setItemsView('grid')}
          className={clsx('cursor:pointer h-[40px] w-[40px] grid place-items-center rounded-lg', {
            'bg-[#333]': itemsView === 'grid',
          })}
        >
          <PiGridFourFill />
        </button>
        <button
          onClick={() => setItemsView('list')}
          className={clsx('cursor:pointer h-[40px] w-[40px] grid place-items-center rounded-lg', {
            'bg-[#333]': itemsView === 'list',
          })}
        >
          <MdFormatListBulleted />
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return;
    }
    getItems();
    getCollections();
  }, []); // Only runs once when the component mounts

  useEffect(() => {
    switch (itemsFilter) {
      case 'all':
        setFilteredItems(items);
        break;
      case 'photo_packs':
        setFilteredItems(items.filter((item) => item.type === 'photo_packs'));
        break;
      case 'quote_packs':
        setFilteredItems(items.filter((item) => item.type === 'quote_packs'));
        break;
      case 'preset_settings':
        setFilteredItems(items.filter((item) => item.type === 'preset_settings'));
        break;
      default:
        setFilteredItems(items);
    }
  }, [itemsFilter, items]); // Only depends on itemsFilter and items

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
                {FilterOptions()}
                <div className="flex flex-row gap-2">{ItemView()}</div>
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
