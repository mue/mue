import { motion } from 'framer-motion';
import variables from 'config/variables';
import { useState } from 'react';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';
import { useMarketData } from 'features/marketplace/api/MarketplaceDataContext';
import { MdOpenInNew } from 'react-icons/md';

function ItemCard({ item, type, onCollection, isCurator, cardStyle }) {
  const { getItemData, selectedItem, setSelectedItem } = useMarketData();
  const { setSubTab } = useTab();

  item._onCollection = onCollection;

  const SelectItem = () => {
    getItemData(item.type, item.name).then((data) => {
      setSubTab(data.display_name);
      console.log(data)
    });
  };

  const getName = (name) => {
    const nameMappings = {
      photos: 'photo_packs',
      quotes: 'quote_packs',
      settings: 'preset_settings',
    };
    return nameMappings[name] || name;
  };

  switch (cardStyle) {
    case 'list':
      return (
        <tr
          key={item.name}
          className="py-5 hover:bg-white/5 rounded-lg cursor-pointer"
          onClick={SelectItem}
        >
          <td className="flex flex-row items-center gap-10 py-3">
            <img
              className="w-10 h-10 rounded-lg"
              alt="icon"
              draggable={false}
              src={item.icon_url}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderIcon;
              }}
            />
            {item.display_name}
          </td>
          <td>{variables.getMessage('marketplace:' + getName(item.type)) || 'marketplace'}</td>
          <td>{item.author}</td>
          <td>
            <MdOpenInNew />
          </td>
        </tr>
      );
    default:
      return (
        <motion.div
          // whileHover={{ y: -10 }}
          // transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.5 }}
          //  ease-in-out duration-100
          className="item transition hover:-translate-y-2.5 motion-reduce:transition-none motion-reduce:hover:transform-none"
          onClick={SelectItem}
          key={item.name}
          style={{
            // alpha  66=0.4  33=0.2  00=0
            //backgroundImage: `radial-gradient(circle at center 25%, ${item.colour}66 0%, ${item.colour}33 10%, ${item.colour}00 75%)`,
            backgroundImage: `radial-gradient(circle at center 25%, ${item.colour}60, ${item.colour}0F)`,
            // backgroundImage: `radial-gradient(circle at center 25%, ${item.colour}55, ${item.colour}0A)`,
          }}
        >
          <img
            className="item-icon"
            alt="icon"
            draggable={false}
            src={item.icon_url}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderIcon;
            }}
          />
          <div className="card-details">
            <span className="card-title">{item.display_name || item.name}</span>
            {!isCurator ? (
              <span className="card-subtitle">
                {variables.getMessage('marketplace:by', { author: item.author })}
              </span>
            ) : (
              ''
            )}

            {type === true && !onCollection ? (
              <span className="card-type">
                {variables.getMessage('marketplace:' + getName(item.type))}
              </span>
            ) : null}
          </div>
        </motion.div>
      );
  }
}

export { ItemCard as default, ItemCard };
