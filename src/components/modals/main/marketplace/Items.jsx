import variables from 'modules/variables';
import React, { useState } from "react";
import { MdAutoFixHigh, MdOutlineArrowForward, MdExpandMore } from 'react-icons/md';

export default function Items({
  type,
  items,
  collections,
  toggleFunction,
  collectionFunction,
  onCollection,
}) {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);
  const [count, setCount] = useState(8);
  const incrementCount = () => {
    if (count !== items.length && count <= items.length) {
      if ((count + 8)  > items.length) {
        setCount(count + (items.length - count));
      }
      else {
        setCount(count + 8);
      }
    }
  };

  return (
    <>
      {(type === 'all' && !onCollection) || (type ==='collections') ? (
        <>
          {collections.map((collection, index) => (
            <div
              className="collection"
              key={index}
              style={{
                backgroundImage: `linear-gradient(to left, #000, transparent, #000), url('${collection.img}')`,
              }}
            >
              <div className="content">
                <span className="title">{collection.display_name}</span>
                <span className="subtitle">{collection.description}</span>
              </div>
              <button className="nice-button" onClick={() => collectionFunction(collection.name)}>
                <MdOutlineArrowForward /> {getMessage('modals.main.marketplace.explore_collection')}
              </button>
            </div>
          ))}
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
      <div className='showMoreItems'>
        <span className='link' onClick={incrementCount}><MdExpandMore /> Show More</span>
        <span className='subtitle'>Showing {count} / {items.length}</span>
      </div>
      <div className="loader"></div>
      {type === 'all' && !onCollection ? (
        <div className="createYourOwn">
          <MdAutoFixHigh />
          <span className="title">{getMessage('modals.main.marketplace.cant_find')}</span>
          <span className="subtitle">
            {getMessage('modals.main.marketplace.knowledgebase_one')}{' '}
            <a
              className="link"
              target="_blank"
              href={variables.constants.KNOWLEDGEBASE}
              rel="noreferrer"
            >
              {getMessage('modals.main.marketplace.knowledgebase_two')}
            </a>{' '}
            {getMessage('modals.main.marketplace.knowledgebase_three')}
          </span>
        </div>
      ) : null}
    </>
  );
}
