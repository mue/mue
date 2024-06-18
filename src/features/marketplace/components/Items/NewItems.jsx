import variables from 'config/variables';
import { motion } from 'framer-motion';
import { useState } from 'react';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';
import { useMarketData } from 'features/marketplace/api/MarketplaceDataContext';

function ItemCard({ item, onClick, type, onCollection, isCurator }) {
  const { getItemData, selectedItem, setSelectedItem } = useMarketData();
  const { setSubTab } = useTab();

  item._onCollection = onCollection;

  const SelectItem = () => {
    console.log("Item selected: ", item.display_name);
    console.log("Item type: ", item.type);
    getItemData(item.type, item.name).then((data) => {
      console.log("Selected item: ", data);
      //setSelectedItem(data);
      setSubTab(data.display_name);
    });
  }

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

        {type === 'all' && !onCollection ? (
          <span className="card-type">
            {variables.getMessage('marketplace:' + item.type)}
          </span>
        ) : null}
      </div>
    </motion.div>
  );
}

const NewItems = ({ items }) => {
  const { setSubTab } = useTab();
  return (
    <div className="items">
      {items.map((item, index) => (
        <ItemCard
          onClick={() => setSubTab(item.name)}
          //isCurator={isCurator}
          item={item}
          //toggleFunction={toggleFunction}
          //type={type}
          //onCollection={onCollection}
          key={index}
        />
      ))}
    </div>
  );
};

export { NewItems };
