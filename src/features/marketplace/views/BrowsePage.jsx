import variables from 'config/variables';
import { MdSearch, MdOutlineArrowForward } from 'react-icons/md';

import { Button } from 'components/Elements';
import Items from '../components/Items/Items';

const BrowsePage = ({
  type,
  items,
  featuredCollection,
  filter,
  onFilterChange,
  onItemClick,
  onCollectionClick,
  onSortChange,
}) => {
  return (
    <>
      <div className="headerExtras marketplaceCondition">
        {type !== 'collections' && (
          <div>
            <form className="marketplaceSearch">
              <input
                label={variables.getMessage('widgets.search')}
                placeholder={variables.getMessage('widgets.search')}
                name="filter"
                id="filter"
                value={filter}
                onChange={onFilterChange}
              />
              <MdSearch />
            </form>
          </div>
        )}
      </div>

      {type === 'collections' ? (
        items.map((item) =>
          !item.news ? (
            <div
              key={item.name}
              className="collection"
              style={
                item.news
                  ? { backgroundColor: item.background_colour }
                  : {
                      backgroundImage: `linear-gradient(to left, #000, transparent, #000), url('${item.img}')`,
                    }
              }
            >
              <div className="content">
                <span className="title">{item.display_name}</span>
                <span className="subtitle">{item.description}</span>
              </div>
              <Button
                type="collection"
                onClick={() => onCollectionClick(item.name)}
                icon={<MdOutlineArrowForward />}
                label={variables.getMessage('modals.main.marketplace.explore_collection')}
                iconPlacement="right"
              />
            </div>
          ) : null,
        )
      ) : (
        <Items
          filterOptions={true}
          type={type}
          items={items}
          collection={featuredCollection}
          onCollection={false}
          toggleFunction={onItemClick}
          collectionFunction={onCollectionClick}
          filter={filter}
          onSortChange={onSortChange}
          showCreateYourOwn={true}
        />
      )}
    </>
  );
};

export { BrowsePage as default, BrowsePage };
