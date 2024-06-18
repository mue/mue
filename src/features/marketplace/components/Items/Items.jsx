import variables from 'config/variables';
import { motion } from 'framer-motion';
import { useState } from 'react';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';
import { useMarketData } from 'features/marketplace/api/MarketplaceDataContext';
import { MdOpenInNew } from "react-icons/md";

function ItemCard({ item, type, onCollection, isCurator, cardStyle }) {
  const { getItemData, selectedItem, setSelectedItem } = useMarketData();
  const { setSubTab } = useTab();

  item._onCollection = onCollection;

  const SelectItem = () => {
    console.log('Item selected: ', item.display_name);
    console.log('Item type: ', item.type);
    getItemData(item.type, item.name).then((data) => {
      console.log('Selected item: ', data);
      //setSelectedItem(data);
      setSubTab(data.display_name);
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
        <tr key={item.name} className="py-5 hover:bg-white/5 rounded-lg cursor-pointer" onClick={SelectItem}>
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
          <td><MdOpenInNew /></td>
        </tr>
      );
    default:
      return (
        <motion.div
          whileHover={{ y: -10 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.5 }}
          className="item"
          onClick={SelectItem}
          key={item.name}
        >
          <img
            className="item-back"
            alt=""
            draggable={false}
            src={item.icon_url}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderIcon;
            }}
            aria-hidden="true"
          />
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
              <span className="card-type">{variables.getMessage('marketplace:' + item.type)}</span>
            ) : null}
          </div>
        </motion.div>
      );
  }
}

const NewItems = ({ items, view }) => {
  const { setSubTab } = useTab();

  switch (view) {
    case 'list':
      return (
        <table className="w-full">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>{variables.getMessage('settings:sections.quote.author')}</th>
              <th></th>
            </tr>
            {items.map((item, index) => (
              <ItemCard
                onClick={() => setSubTab(item.name)}
                item={item}
                type={true}
                key={index}
                cardStyle="list"
              />
            ))}
          </tbody>
        </table>
      );
    default:
      return (
        <div className="items">
          {items.map((item, index) => (
            <ItemCard
              onClick={() => setSubTab(item.name)}
              item={item}
              type={true}
              key={index}
              cardStyle="card"
            />
          ))}
        </div>
      );
  }
};

export { NewItems };
