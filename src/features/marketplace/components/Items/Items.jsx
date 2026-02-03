import variables from 'config/variables';
import React, { memo, useState, useMemo } from 'react';
import { MdCheckCircle, MdOutlineUploadFile, MdClose } from 'react-icons/md';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';

import { Tooltip } from 'components/Elements';
import { Button } from 'components/Elements';
import Switch from 'components/Form/Settings/Switch/Switch';
import Dropdown from '../../../../components/Form/Settings/Dropdown/Dropdown';
import EventBus from 'utils/eventbus';
import { getProxiedImageUrl } from 'utils/marketplace';

function filterItems(item, filter, categoryFilter) {
  const lowerCaseFilter = filter.toLowerCase();
  const textMatch =
    item.name?.toLowerCase().includes(lowerCaseFilter) ||
    filter === '' ||
    item.author?.toLowerCase().includes(lowerCaseFilter) ||
    item.type?.toLowerCase().includes(lowerCaseFilter);

  // Apply category filter
  if (categoryFilter === 'all') {
    return textMatch;
  }

  const categoryMap = {
    quotes: 'quote_packs',
    photos: 'photo_packs',
    presets: 'preset_settings',
  };

  return textMatch && item.type === categoryMap[categoryFilter];
}

function getInitials(name) {
  if (!name) return '??';
  const words = name.split(' ');
  if (words.length === 1) {
    return name.substring(0, 2).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function getTypeTranslationKey(type) {
  const typeMap = {
    photos: 'photo_packs',
    quotes: 'quote_packs',
    settings: 'preset_settings',
  };
  return typeMap[type] || type;
}

function ItemCard({
  item,
  toggleFunction,
  type,
  onCollection,
  isCurator,
  isInstalled,
  isAdded,
  onUninstall,
  onTogglePack,
  showChips = true,
}) {
  item._onCollection = onCollection;

  const isSideloaded = item.sideload === true;
  const packId = item.id || item.name;

  // Use React state to manage enabled status for immediate UI updates
  const [isEnabled, setIsEnabled] = useState(() => {
    const enabledPacks = JSON.parse(localStorage.getItem('enabledPacks') || '{}');
    return enabledPacks[packId] !== false; // Default to enabled if not set
  });

  const handleTogglePack = (e) => {
    e.stopPropagation();
    const newState = !isEnabled;

    // Update local state immediately for UI responsiveness
    setIsEnabled(newState);

    // Update localStorage
    const enabledPacks = JSON.parse(localStorage.getItem('enabledPacks') || '{}');
    enabledPacks[packId] = newState;
    localStorage.setItem('enabledPacks', JSON.stringify(enabledPacks));

    if (onTogglePack) {
      onTogglePack(packId, newState);
    }

    // Emit refresh event for quotes only (background will update on next interval)
    if (item.type === 'quotes') {
      EventBus.emit('refresh', 'quote');
    }
  };

  return (
    <div
      className={`item ${isSideloaded ? 'item-sideloaded' : ''} ${!isEnabled && isAdded ? 'item-disabled' : ''}`}
      onClick={isSideloaded ? undefined : () => toggleFunction(item)}
      key={item.name}
    >
      {isAdded && onTogglePack && (
        <div
          className="item-toggle-switch"
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 3 }}
        >
          <label className="switch-track" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleTogglePack}
              style={{ display: 'none' }}
            />
            <div
              className={`switch-track ${isEnabled ? 'checked' : ''}`}
              style={{
                width: '52px',
                height: '32px',
                borderRadius: '16px',
                backgroundColor: isEnabled
                  ? 'var(--linkColor, #ff5c25)'
                  : 'rgba(128, 128, 128, 0.3)',
                position: 'relative',
                transition: 'background-color 0.2s',
                cursor: 'pointer',
              }}
            >
              <div
                className="switch-thumb"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '4px',
                  left: isEnabled ? '24px' : '4px',
                  transition: 'left 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            </div>
          </label>
        </div>
      )}
      {isSideloaded && (
        <Tooltip
          title={variables.getMessage('modals.main.addons.sideload.title')}
          style={{ position: 'absolute', top: '12px', right: isAdded ? '48px' : '12px', zIndex: 2 }}
        >
          <div className="item-sideload-badge">
            <MdOutlineUploadFile />
          </div>
        </Tooltip>
      )}
      {isInstalled && item.colour && !isSideloaded && !isAdded && (
        <div className="item-installed-badge">
          <MdCheckCircle />
        </div>
      )}
      {item.icon_url ? (
        <img
          className="item-icon"
          alt="icon"
          draggable={false}
          src={getProxiedImageUrl(item.icon_url)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderIcon;
          }}
        />
      ) : (
        <div className="item-icon item-icon-text">
          {getInitials(item.display_name || item.name)}
        </div>
      )}
      <div className="card-details">
        <span className="card-title">{item.display_name || item.name}</span>
        {!isCurator ? (
          <span className="card-subtitle">
            {variables.getMessage('modals.main.marketplace.by', { author: item.author })}
          </span>
        ) : (
          ''
        )}

        {showChips && (
          <div className="card-chips">
            {item.type && (
              <span className="card-type">
                {variables.getMessage(
                  'modals.main.marketplace.' + getTypeTranslationKey(item.type),
                )}
              </span>
            )}
            {item.in_collections && item.in_collections.length > 0 && !onCollection && (
              <span className="card-collection">
                {item.in_collections[0].display_name || item.in_collections[0].name}
              </span>
            )}
          </div>
        )}

        {isAdded && onUninstall && (
          <Button
            type="settings"
            onClick={(e) => {
              e.stopPropagation();
              onUninstall(item.type, item.name);
            }}
            icon={<MdClose />}
            label={variables.getMessage('modals.main.marketplace.product.buttons.remove')}
            style={{ marginTop: '10px', width: '100%' }}
          />
        )}
      </div>
    </div>
  );
}

function Items({
  isCurator,
  type,
  items,
  toggleFunction,
  onCollection,
  filter,
  filterOptions = false,
  onSortChange,
  isAdded = false,
  onUninstall,
  onTogglePack,
  viewType = 'grid',
  showChips = true,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortType, setSortType] = useState(localStorage.getItem('sortMarketplace') || 'a-z');

  // Cache installed items lookup - only parse localStorage once
  const installedNames = useMemo(() => {
    const installed = JSON.parse(localStorage.getItem('installed')) || [];
    return new Set(installed.map((item) => item.name));
  }, []);

  const filterCategories = [
    { id: 'all', label: 'All' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'photos', label: 'Photos' },
    { id: 'presets', label: 'Presets' },
  ];

  const handleSortChange = (value) => {
    setSortType(value);
    localStorage.setItem('sortMarketplace', value);
    if (onSortChange) {
      onSortChange(value);
    }
  };

  return (
    <>
      {/* Items Filter Options */}
      {filterOptions && (
        <div className="filter-options-container">
          <div className="filter-chips">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                className={`filter-chip ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
          <Dropdown
            label={variables.getMessage('modals.main.addons.sort.title')}
            name="sortMarketplace"
            onChange={(value) => handleSortChange(value)}
            items={[
              { value: 'a-z', text: variables.getMessage('modals.main.addons.sort.a_z') },
              { value: 'z-a', text: variables.getMessage('modals.main.addons.sort.z_a') },
            ]}
          />
        </div>
      )}
      <div className={`items ${viewType === 'list' ? 'items-list' : 'items-grid'}`}>
        {items
          ?.filter((item) => filterItems(item, filter, filterOptions ? selectedCategory : 'all'))
          .map((item, index) => (
            <ItemCard
              isCurator={isCurator}
              item={item}
              toggleFunction={toggleFunction}
              type={type}
              onCollection={onCollection}
              isInstalled={installedNames.has(item.name)}
              isAdded={isAdded}
              onUninstall={onUninstall}
              onTogglePack={onTogglePack}
              showChips={showChips}
              key={index}
            />
          ))}
      </div>
      <div className="loader"></div>
    </>
  );
}

const MemoizedItems = memo(Items);
export { MemoizedItems as default, MemoizedItems as Items };
