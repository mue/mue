import { memo } from 'react';
import variables from 'config/variables';
import { MdOutlineArrowForward, MdOutlineOpenInNew } from 'react-icons/md';
import { Button } from 'components/Elements';

import { useMarketData } from 'features/marketplace/api/MarketplaceDataContext';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';

const Collection = ({ collection }) => {
  const { setSubTab } = useTab();
  const { setSelectedCollection, getCollectionData } = useMarketData();

  const getStyle = () => {
    if (collection?.news) {
      return { backgroundColor: collection?.background_colour };
    }

    return {
      backgroundImage: `linear-gradient(to left, #000, transparent, #000), url('${collection?.img}')`,
    };
  };

  const SelectCollection = () => {
    getCollectionData(collection.name).then((data) => {
      setSubTab(data.display_name);
    });
  }

  return (
    <div className="collection h-[125px]" style={getStyle()}>
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
          onClick={SelectCollection}
          icon={<MdOutlineArrowForward />}
          label={variables.getMessage('marketplace:explore_collection')}
          iconPlacement={'right'}
        />
      )}
    </div>
  );
};

const MemoizedCollection = memo(Collection);
export { MemoizedCollection as default, MemoizedCollection as Collection };
