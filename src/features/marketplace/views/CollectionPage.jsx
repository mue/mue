import variables from 'config/variables';
import { MdLibraryAdd } from 'react-icons/md';

import { Button } from 'components/Elements';
import Items from '../components/Items/Items';

const CollectionPage = ({
  collectionName,
  collectionTitle,
  collectionDescription,
  collectionImg,
  items,
  busy,
  onInstallCollection,
  onItemClick,
  onSortChange,
}) => {
  return (
    <>
      <div
        className="collectionPage"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent, black), url('${collectionImg}')`,
        }}
      >
        <div className="nice-tag">{variables.getMessage('modals.main.marketplace.collection')}</div>
        <div className="content">
          <span className="mainTitle">{collectionTitle}</span>
          <span className="subtitle">{collectionDescription}</span>
        </div>

        <Button
          type="collection"
          onClick={onInstallCollection}
          disabled={busy}
          icon={<MdLibraryAdd />}
          label={
            busy
              ? variables.getMessage('modals.main.marketplace.installing')
              : variables.getMessage('modals.main.marketplace.add_all')
          }
        />
      </div>

      <Items
        filterOptions={true}
        items={items}
        collection={null}
        onCollection={true}
        toggleFunction={onItemClick}
        collectionFunction={() => {}}
        filter={''}
        onSortChange={onSortChange}
        showCreateYourOwn={false}
      />
    </>
  );
};

export { CollectionPage as default, CollectionPage };
