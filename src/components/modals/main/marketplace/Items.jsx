import variables from 'modules/variables';
import React, { useState } from 'react';
import {
  MdAutoFixHigh,
  MdOutlineArrowForward,
  MdExpandMore,
  MdOutlineOpenInNew,
} from 'react-icons/md';

export default function Items({
  type,
  items,
  collections = [],
  toggleFunction,
  collectionFunction,
  onCollection,
}) {
  const [count, setCount] = useState(8);
  const incrementCount = () => {
    if (count !== items.length && count <= items.length) {
      if (count + 8 > items.length) {
        setCount(count + (items.length - count));
      } else {
        setCount(count + 8);
      }
    }
  };

  const collection = collections[Math.floor(Math.random() * collections.length)];

  return (
    <>
      {(type === 'all' && !onCollection) || (type === 'collections' && !onCollection) ? (
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
              <a className="collectionButton" href={collection.news_link}>
                {variables.getMessage('modals.main.marketplace.learn_more')} <MdOutlineOpenInNew />
              </a>
            ) : (
              <button className="collectionButton" onClick={() => collectionFunction(collection.name)}>
                <MdOutlineArrowForward />{' '}
                {variables.getMessage('modals.main.marketplace.explore_collection')}
              </button>
            )}
          </div>
        </>
      ) : null}
      <div className="items">
        {items.slice(0, count).map((item) => (
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
      <div className="showMoreItems">
        {count !== items.length && items.length >= 8 ? (
          <span className="link" onClick={incrementCount}>
            <MdExpandMore /> {variables.getMessage('modals.main.marketplace.product.show_more')}
          </span>
        ) : null}
        {items.length <= 8 ? (
          <span className="subtitle">
            {variables.getMessage('modals.main.marketplace.product.showing')} {items.length} / {items.length}
          </span>
        ) : (
          <span className="subtitle">
            {variables.getMessage('modals.main.marketplace.product.showing')} {count} / {items.length}
          </span>
        )}
      </div>
      <div className="loader"></div>
      {type === 'all' && !onCollection ? (
        <div className="createYourOwn">
          <MdAutoFixHigh />
          <span className="title">{variables.getMessage('modals.main.marketplace.cant_find')}</span>
          <span className="subtitle">
            {variables.getMessage('modals.main.marketplace.knowledgebase_one')}{' '}
            <a
              className="link"
              target="_blank"
              href={variables.constants.KNOWLEDGEBASE}
              rel="noreferrer"
            >
              {variables.getMessage('modals.main.marketplace.knowledgebase_two')}
            </a>{' '}
            {variables.getMessage('modals.main.marketplace.knowledgebase_three')}
          </span>
        </div>
      ) : null}
    </>
  );
}
