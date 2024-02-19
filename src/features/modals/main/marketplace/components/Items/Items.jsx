import variables from 'config/variables';
import React, { memo } from 'react';
import { MdAutoFixHigh, MdOutlineArrowForward, MdOutlineOpenInNew } from 'react-icons/md';

import { Button } from 'components/Elements';
import MemoizedLightbox from '../Elements/Lightbox/Lightbox';

function Items({
  type,
  items,
  collection,
  toggleFunction,
  collectionFunction,
  onCollection,
  filter,
}) {
  return (
    <>
      {(type === 'all' && !onCollection && (filter === null || filter === '')) ||
      (type === 'collections' && !onCollection && (filter === null || filter === '')) ? (
        <>
          <div
            className="collection"
            style={
              collection.news
                ? { backgroundColor: collection.background_colour }
                : {
                    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7), transparent, rgba(0, 0, 0, 0.7), rgba(0 ,0, 0, 0.9)), url('${collection.img}')`,
                  }
            }
          >
            <div className="content">
              <span className="title">{collection.display_name}</span>
              <span className="subtitle">{collection.description}</span>
            </div>
            {collection.news === true ? (
              <a
                className="btn-collection"
                href={collection.news_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {variables.getMessage('modals.main.marketplace.learn_more')} <MdOutlineOpenInNew />
              </a>
            ) : (
              <Button
                type="collection"
                onClick={() => collectionFunction(collection.name)}
                icon={<MdOutlineArrowForward />}
                label={variables.getMessage('modals.main.marketplace.explore_collection')}
                iconPlacement={'right'}
              />
            )}
          </div>
        </>
      ) : null}
      <div className="items">
        {items
          ?.filter(
            (item) =>
              item.name.toLowerCase().includes(filter.toLowerCase()) ||
              filter === '' ||
              item.author.toLowerCase().includes(filter.toLowerCase()) ||
              item.type.toLowerCase().includes(filter.toLowerCase()),
          )
          .map((item) => (
            <div className="item" onClick={() => toggleFunction(item)} key={item.name}>
              <img
                className="item-back"
                alt=""
                draggable={false}
                src={variables.constants.DDG_IMAGE_PROXY + item.icon_url}
                aria-hidden="true"
              />
              <img
                className="item-icon"
                alt="icon"
                draggable={false}
                src={variables.constants.DDG_IMAGE_PROXY + item.icon_url}
              />
              <div className="card-details">
                <span className="card-title">{item.display_name || item.name}</span>
                <span className="card-subtitle">
                  {variables.getMessage('modals.main.marketplace.by', { author: item.author })}
                </span>
                {type === 'all' && !onCollection ? (
                  <span className="card-type">
                    {variables.getMessage('modals.main.marketplace.' + item.type)}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
      </div>
      <div className="loader"></div>
      {type === 'all' && !onCollection ? (
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
