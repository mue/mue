import { MdOutlineArrowForward, MdOutlineOpenInNew } from 'react-icons/md';
import { Button } from 'components/Elements';
import variables from 'config/variables';

const Collection = ({ collections, collectionFunction }) => {
  const randomIndex = Math.floor(Math.random() * collections.length);
  const collection = collections[randomIndex];

  const getStyle = () => {
    if (collection?.news) {
      return { backgroundColor: collection?.background_colour };
    }

    return {
      backgroundImage: `linear-gradient(to left, #000, transparent, #000), url('${collection?.img}')`,
    };
  };

  return (
    <div className="collection" style={getStyle()}>
      <div className="content">
        <span className="title">{collection?.display_name}</span>
        <span className="subtitle">{collection?.description ? collection?.description.substr(0, 75) : ''}</span>
      </div>
      {collection?.news === true ? (
        <a
          className="btn-collection"
          href={collection?.news_link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {variables.getMessage('marketplace:learn_more')} <MdOutlineOpenInNew />
        </a>
      ) : (
        <Button
          type="collection"
          onClick={() => collectionFunction(collection?.name)}
          icon={<MdOutlineArrowForward />}
          label={variables.getMessage('marketplace:explore_collection')}
          iconPlacement={'right'}
        />
      )}
    </div>
  );
};

export { Collection as default, Collection };
