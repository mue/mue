import variables from 'config/variables';
import React, { memo } from 'react';
import { MdAutoFixHigh, MdOutlineArrowForward, MdOutlineOpenInNew } from 'react-icons/md';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';

import { Button } from 'components/Elements';

function filterItems(item, filter) {
  const lowerCaseFilter = filter.toLowerCase();
  return (
    item.name?.toLowerCase().includes(lowerCaseFilter) ||
    filter === '' ||
    item.author?.toLowerCase().includes(lowerCaseFilter) ||
    item.type?.toLowerCase().includes(lowerCaseFilter)
  );
}

function ItemCard({ item, toggleFunction, type, onCollection, isCurator }) {
  item._onCollection = onCollection
  return (
    <div className="item" onClick={() => toggleFunction(item)} key={item.name}>
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
            {variables.getMessage('modals.main.marketplace.by', { author: item.author })}
          </span>
        ) : (
          ''
        )}

        {type === 'all' && !onCollection ? (
          <span className="card-type">
            {variables.getMessage('modals.main.marketplace.' + item.type)}
          </span>
        ) : null}
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
}) {
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
      <div className={`items ${moreByCreator ? 'creatorItems' : ''}`}>
        {items
          ?.filter((item) => filterItems(item, filter))
          .map((item, index) => (
            <ItemCard
              isCurator={isCurator}
              item={item}
              toggleFunction={toggleFunction}
              type={type}
              onCollection={onCollection}
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
