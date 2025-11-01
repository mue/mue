import variables from 'config/variables';
import React, { memo, useState, useMemo } from 'react';
import { MdAutoFixHigh, MdOutlineArrowForward, MdOutlineOpenInNew, MdCheckCircle } from 'react-icons/md';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';

import { Button } from 'components/Elements';
import Dropdown from '../../../../components/Form/Settings/Dropdown/Dropdown';

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

function ItemCard({ item, toggleFunction, type, onCollection, isCurator, isInstalled }) {
  item._onCollection = onCollection;

  // Convert hex color to RGB for gradient with opacity
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const getGradientStyle = () => {
    if (!item.colour) return {};

    const rgb = hexToRgb(item.colour);
    if (!rgb) return {};

    const baseColor = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

    return {
      '--item-gradient0': `rgba(${baseColor}, 0.38)`,
      '--item-gradient10': `rgba(${baseColor}, 0.35)`,
      '--item-gradient75': `rgba(${baseColor}, 0.14)`,
      '--item-gradient100': `rgba(${baseColor}, 0.06)`,
      backgroundImage: `radial-gradient(circle at center 25%, var(--item-gradient0) 0%, var(--item-gradient10) 10%, var(--item-gradient75) 75%, var(--item-gradient100) 100%)`,
    };
  };

  const getBadgeStyle = () => {
    if (!item.colour) return {};

    const rgb = hexToRgb(item.colour);
    if (!rgb) return {};

    const baseColor = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

    return {
      backgroundColor: `rgba(${baseColor}, 0.9)`,
    };
  };

  return (
    <div
      className="item"
      onClick={() => toggleFunction(item)}
      key={item.name}
      style={getGradientStyle()}
    >
      {isInstalled && item.colour && (
        <div className="item-installed-badge" style={getBadgeStyle()}>
          <MdCheckCircle />
        </div>
      )}
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
            {variables.getMessage('modals.main.marketplace.by', { author: item.author })}
          </span>
        ) : (
          ''
        )}

        <div className="card-chips">
          {type === 'all' && !onCollection ? (
            <span className="card-type">
              {variables.getMessage('modals.main.marketplace.' + item.type)}
            </span>
          ) : null}

          {/* {item.in_collections && item.in_collections.length > 0 && !onCollection ? (
            <span className="card-collection">
              {item.in_collections[0]}
            </span>
          ) : null} */}
        </div>
      </div>
    </div>
  );
}

function Items({
  isCurator,
  type,
  items,
  collection,
  toggleFunction,
  collectionFunction,
  onCollection,
  filter,
  moreByCreator,
  showCreateYourOwn,
  filterOptions = false,
  onSortChange,
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

  const shouldShowCollection =
    ((collection && !onCollection && (filter === null || filter === '')) ||
      (type === 'collections' && !onCollection && (filter === null || filter === ''))) &&
    type !== 'preset_settings';

  return (
    <>
      {shouldShowCollection && (
        <div
          className="collection"
          style={
            collection?.news
              ? { backgroundColor: collection?.background_colour }
              : {
                  backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7), transparent, rgba(0, 0, 0, 0.7), rgba(0 ,0, 0, 0.9)), url('${collection?.img}')`,
                }
          }
        >
          <div className="content">
            <span className="title">{collection?.display_name}</span>
            <span className="subtitle">{collection?.description}</span>
          </div>
          {collection?.news === true ? (
            <a
              className="btn-collection"
              href={collection?.news_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {variables.getMessage('modals.main.marketplace.learn_more')} <MdOutlineOpenInNew />
            </a>
          ) : (
            <Button
              type="collection"
              onClick={() => collectionFunction(collection?.name)}
              icon={<MdOutlineArrowForward />}
              label={variables.getMessage('modals.main.marketplace.explore_collection')}
              iconPlacement={'right'}
            />
          )}
        </div>
      )}
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
      <div className={`items ${moreByCreator ? 'creatorItems' : ''}`}>
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
              key={index}
            />
          ))}
      </div>
      <div className="loader"></div>
      {!onCollection && showCreateYourOwn ? (
        <div className="createYourOwn">
          <MdAutoFixHigh />
          <span className="title">{variables.getMessage('modals.main.marketplace.cant_find')}</span>
          <span className="subtitle">
            {variables.getMessage('modals.main.marketplace.knowledgebase_one') + ' '}
            <a
              className="link"
              target="_blank"
              href={variables.constants.KNOWLEDGEBASE}
              rel="noreferrer"
            >
              {variables.getMessage('modals.main.marketplace.knowledgebase_two')}
            </a>
            {' ' + variables.getMessage('modals.main.marketplace.knowledgebase_three')}
          </span>
        </div>
      ) : null}
    </>
  );
}

const MemoizedItems = memo(Items);
export { MemoizedItems as default, MemoizedItems as Items };
