import variables from 'modules/variables';
import React, { memo } from 'react';
import {
  MdAutoFixHigh,
  MdOutlineArrowForward,
  MdOutlineOpenInNew,
} from 'react-icons/md';

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
      {(type === 'all' && !onCollection && (filter === null || filter === '')) || (type === 'collections' && !onCollection &&  (filter === null || filter === '')) ? (
        <>
          <div
            className="collection"
            style={
              collection.news
                ? { backgroundColor: collection.background_colour }
                : {
                    backgroundImage: `linear-gradient(to left, #000, transparent, #000), url('${collection.img}')`,
                  }
            }
          >
            <div className="content">
              <span className="title">{collection.display_name}</span>
              <span className="subtitle">{collection.description}</span>
            </div>
            {collection.news === true ? (
              <a
                className="collectionButton"
                href={collection.news_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {variables.getMessage('modals.main.marketplace.learn_more')} <MdOutlineOpenInNew />
              </a>
            ) : (
              <button
                className="collectionButton"
                onClick={() => collectionFunction(collection.name)}
              >
                <MdOutlineArrowForward />
                {variables.getMessage('modals.main.marketplace.explore_collection')}
              </button>
            )}
          </div>
        </>
      ) : null}
      <div className="items">
        {items?.filter(
            (item) =>
              item.name.toLowerCase().includes(filter.toLowerCase()) ||
              filter === '' ||
              item.author.toLowerCase().includes(filter.toLowerCase()) ||
              item.type.toLowerCase().includes(filter.toLowerCase()),
          )
          .map((item) => (
            <div className="item" onClick={() => toggleFunction(item)} key={item.name}>
              <img
                alt="icon"
                draggable="false"
                src={variables.constants.DDG_IMAGE_PROXY + item.icon_url}
              />
              <div className="card-details">
                <span className="card-title">{item.display_name || item.name}</span>
                <span className="card-subtitle">{item.author}</span>
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
            {variables.getMessage('modals.main.marketplace.knowledgebase_one')}
            <a
              className="link"
              target="_blank"
              href={variables.constants.KNOWLEDGEBASE}
              rel="noreferrer"
            >
              {variables.getMessage('modals.main.marketplace.knowledgebase_two')}
            </a>
            {variables.getMessage('modals.main.marketplace.knowledgebase_three')}
          </span>
        </div>
      ) : null}
    </>
  );
}

export default memo(Items);