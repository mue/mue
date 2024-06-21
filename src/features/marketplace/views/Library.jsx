// src/library/Library.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useMarketData } from 'features/marketplace/api/MarketplaceDataContext';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';
import { NewItems as Items } from '../components/Items/Items';
import ItemPage from '../views/ItemPage';
import { MdOutlineExtensionOff } from 'react-icons/md';
import { ItemUtilities } from '../components/Elements';
import variables from 'config/variables';

const filterItems = (items, filter) => {
  if (filter === 'all') return items;
  return items.filter((item) => item.type === filter);
};

const Library = () => {
  let installed = JSON.parse(localStorage.getItem('installed'));
  const { selectedItem } = useMarketData();
  const { subTab, changeTab } = useTab();

  const [itemsView, setItemsView] = useState('list');
  const [itemsFilter, setItemsFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);

  // Ensure installed is an array
  if (!Array.isArray(installed)) {
    installed = [];
  }

  if (installed.length === 0) {
    return (
      <>
        {/*<Header title={variables.getMessage('modals.main.navbar.addons')} report={false}>
              <CustomActions>{this.getSideloadButton()}</CustomActions>
            </Header>
            {sideLoadBackendElements()}*/}
        <div className="emptyItems">
          <div className="emptyNewMessage">
            <MdOutlineExtensionOff />
            <span className="title">{variables.getMessage('addons:empty.title')}</span>
            <span className="subtitle">{variables.getMessage('addons:empty.description')}</span>
            <button onClick={() => changeTab('marketplace')}>Go to marketplace</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {subTab === '' && selectedItem === null && (
        <>
          <ItemUtilities
            //itemsFilter={itemsFilter}
            //setItemsFilter={setItemsFilter}
            itemsView={itemsView}
            setItemsView={setItemsView}
          />
          <Items items={installed} view={itemsView} />
        </>
      )}
      {subTab !== '' && selectedItem !== null && <ItemPage />}
    </>
  );
};

export default Library;
