import { useT } from 'contexts';
import React, { memo, useState, useMemo, useEffect } from 'react';
import { MdCheckCircle, MdOutlineUploadFile, MdClose, MdSettings, MdAdd } from 'react-icons/md';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';

import { Tooltip } from 'components/Elements';
import { Button } from 'components/Elements';
import Switch from 'components/Form/Settings/Switch/Switch';
import Dropdown from '../../../../components/Form/Settings/Dropdown/Dropdown';
import EventBus from 'utils/eventbus';
import { getProxiedImageUrl } from 'utils/marketplace';
import { refreshAPIPackCache } from 'features/background/api/photoPackAPI';
import ItemSettingsModal from '../Modals/ItemSettingsModal';

function filterItems(item, filter, categoryFilter) {
  const lowerCaseFilter = filter.toLowerCase();
  const textMatch =
    item.name?.toLowerCase().includes(lowerCaseFilter) ||
    filter === '' ||
    item.author?.toLowerCase().includes(lowerCaseFilter) ||
    item.type?.toLowerCase().includes(lowerCaseFilter);

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
  if (!name) {
    return '??';
  }
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
  onInstall,
  showChips = true,
}) {
  const t = useT();
  const isSideloaded = item.sideload === true;
  const packId = item.id || item.name;
  const isPhotoPack = item.type === 'photos' || item.type === 'photo_packs';
  const hasSettings = isPhotoPack && item.settings_schema && item.settings_schema.length > 0;

  const [enabled, setEnabled] = useState(() => {
    const enabledPacks = JSON.parse(localStorage.getItem('enabledPacks') || '{}');
    return enabledPacks[packId] !== false;
  });

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleCardClick = () => {
    if (isSideloaded || showSettingsModal) {
      return;
    }
    toggleFunction(item);
  };

  const handleInstallClick = (e) => {
    e.stopPropagation();
    if (onInstall) {
      onInstall(item);
    }
  };

  const handleTogglePack = async (e) => {
    e.stopPropagation();
    const newState = !enabled;

    setEnabled(newState);

    const enabledPacks = JSON.parse(localStorage.getItem('enabledPacks') || '{}');
    enabledPacks[packId] = newState;
    localStorage.setItem('enabledPacks', JSON.stringify(enabledPacks));

    if (onTogglePack) {
      onTogglePack(packId, newState);
    }

    if (item.type === 'quotes') {
      localStorage.removeItem('quoteQueue');
      localStorage.removeItem('currentQuote');
      EventBus.emit('refresh', 'quote');
    } else if (item.type === 'photos') {
      localStorage.removeItem('photoPackQueue');
      localStorage.removeItem('currentPhoto');

      if (newState && item.api_enabled) {
        await refreshAPIPackCache(item.id);
      }

      const backgroundImage = document.getElementById('backgroundImage');
      if (!backgroundImage || !backgroundImage.style.backgroundImage) {
        EventBus.emit('refresh', 'background');
      }
    }
  };

  return (
    <div
      className={`item ${isSideloaded ? 'item-sideloaded' : ''} ${!enabled && isAdded ? 'item-disabled' : ''}`}
      onClick={handleCardClick}
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
              checked={enabled}
              onChange={handleTogglePack}
              style={{ display: 'none' }}
            />
            <div
              className={`switch-track ${enabled ? 'checked' : ''}`}
              style={{
                width: '52px',
                height: '32px',
                borderRadius: '16px',
                backgroundColor: enabled ? 'var(--linkColor, #ff5c25)' : 'rgba(128, 128, 128, 0.3)',
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
                  left: enabled ? '24px' : '4px',
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
          title={t('modals.main.addons.sideload.title')}
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
      {!isInstalled && onInstall && !isAdded && (
        <button
          className="item-install-button"
          onClick={handleInstallClick}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 2,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            background:
              'linear-gradient(135deg, rgba(255, 92, 37, 0.95) 0%, rgba(255, 130, 67, 0.85) 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15)';
            e.currentTarget.style.background =
              'linear-gradient(135deg, rgba(255, 92, 37, 1) 0%, rgba(255, 130, 67, 0.95) 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background =
              'linear-gradient(135deg, rgba(255, 92, 37, 0.95) 0%, rgba(255, 130, 67, 0.85) 100%)';
          }}
        >
          <MdAdd size={22} />
        </button>
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
            {t('modals.main.marketplace.by', { author: item.author })}
          </span>
        ) : (
          ''
        )}

        {showChips && (
          <div className="card-chips">
            {item.type && (
              <span className="card-type">
                {t('modals.main.marketplace.' + getTypeTranslationKey(item.type))}
              </span>
            )}
            {item.in_collections && item.in_collections.length > 0 && !onCollection && !isAdded && (
              <span className="card-collection">
                {item.in_collections[0].display_name || item.in_collections[0].name}
              </span>
            )}
          </div>
        )}

        {isAdded && onUninstall && (
          <div className="item-card-actions">
            {hasSettings && (
              <Button
                type="settings"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettingsModal(true);
                }}
                icon={<MdSettings />}
                style={{ flex: 1 }}
              />
            )}
            <Button
              type="settings"
              onClick={(e) => {
                e.stopPropagation();
                onUninstall(item.type, item.name);
              }}
              icon={<MdClose />}
              style={{ flex: 1 }}
            />
          </div>
        )}
      </div>
      {isAdded && hasSettings && (
        <ItemSettingsModal
          pack={item}
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          isEnabled={enabled}
        />
      )}
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
  onInstall,
  viewType = 'grid',
  showChips = true,
  style,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortType, setSortType] = useState(localStorage.getItem('sortMarketplace') || 'a-z');
  const [installCounter, setInstallCounter] = useState(0);
  const t = useT();

  useEffect(() => {
    const handleInstalledAddonsChanged = () => {
      setInstallCounter((prev) => prev + 1);
    };

    window.addEventListener('installedAddonsChanged', handleInstalledAddonsChanged);
    return () => {
      window.removeEventListener('installedAddonsChanged', handleInstalledAddonsChanged);
    };
  }, []);

  const installedNames = useMemo(() => {
    const installed = JSON.parse(localStorage.getItem('installed')) || [];
    return new Set(installed.map((item) => item.name));
  }, [installCounter]);

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
            label={t('modals.main.addons.sort.title')}
            name="sortMarketplace"
            onChange={(value) => handleSortChange(value)}
            items={[
              { value: 'a-z', text: t('modals.main.addons.sort.a_z') },
              { value: 'z-a', text: t('modals.main.addons.sort.z_a') },
            ]}
          />
        </div>
      )}
      <div className={`items ${viewType === 'list' ? 'items-list' : 'items-grid'}`} style={style}>
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
              onInstall={onInstall}
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
