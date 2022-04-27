import variables from 'modules/variables';
import { MdAutoFixHigh } from 'react-icons/md';

export default function Items({
  type,
  items,
  collections,
  toggleFunction,
  collectionFunction,
  onCollection,
}) {
  return (
    <>
      {type === 'all' && !onCollection ? (
        <>
          {collections.map((collection) => (
            <div className="collection">
              <div className="content">
                <span className="title">{collection.display_name}</span>
                <span className="subtitle">{collection.description}</span>
                <button onClick={() => collectionFunction(collection.name)}>
                  Explore Collection
                </button>
              </div>
            </div>
          ))}
        </>
      ) : null}
      <div className="items">
        {items.map((item) => (
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
      {type === 'all' && !onCollection ? (
        <div className="createYourOwn">
          <MdAutoFixHigh />
          <span className="title">Can't find what you're looking for?</span>
          <span className="subtitle">
          Visit the <a className='link'>knowledgebase</a> to create your own.
          </span>
        </div>
      ) : null}
    </>
  );
}
