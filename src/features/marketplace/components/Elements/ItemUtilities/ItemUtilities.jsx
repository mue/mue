// src/components/ItemUtilities/ItemUtilities.js
import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PiGridFourFill } from 'react-icons/pi';
import { MdFormatListBulleted } from 'react-icons/md';
import clsx from 'clsx';
import variables from 'config/variables';

const filterTypes = [
  { key: 'all', label: 'marketplace:photo_packs' },
  { key: 'photo_packs', label: 'marketplace:photo_packs' },
  { key: 'quote_packs', label: 'marketplace:quote_packs' },
  { key: 'preset_settings', label: 'marketplace:preset_settings' },
];

const ItemUtilities = ({ itemsFilter, setItemsFilter, itemsView, setItemsView }) => {
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

  const viewOptions = useMemo(
    () => [
      { id: 'grid', icon: <PiGridFourFill /> },
      { id: 'list', icon: <MdFormatListBulleted /> },
    ],
    [],
  );

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

  return (
    <div className="w-full flex flex-row justify-between items-center">
    {itemsFilter && <FilterOptions />}
      <div className="flex flex-row gap-2 ml-auto">
        <ItemView />
      </div>
    </div>
  );
};

export { ItemUtilities as default, ItemUtilities };
