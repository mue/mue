import variables from 'config/variables';
import { NewItems as Items } from '../components/Items/Items';
import { useMarketData } from 'features/marketplace/api/MarketplaceDataContext';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';
import { ItemPage } from '../views/ItemPage';
import { MdOutlineExtensionOff } from 'react-icons/md';

const Library = () => {
  let installed = JSON.parse(localStorage.getItem('installed'));
  const { selectedItem } = useMarketData();
  const { subTab, changeTab } = useTab();

  // Ensure installed is an array
  if (!Array.isArray(installed)) {
    installed = [];
  }

  if (installed.length === 0) {
    return (
      <>
        {/*<Header title={variables.getMessage('modals.main.navbar.addons')} report={false}>
              <CustomActions>{this.getSideloadButton()}</CustomActions>
            </Header>
            {sideLoadBackendElements()}*/}
        <div className="emptyItems">
          <div className="emptyNewMessage">
            <MdOutlineExtensionOff />
            <span className="title">{variables.getMessage('addons:empty.title')}</span>
            <span className="subtitle">{variables.getMessage('addons:empty.description')}</span>
            <button onClick={() => changeTab('marketplace')}>Go to marketplace</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {subTab === '' && selectedItem === null && <Items items={installed} view="list" />}
      {subTab !== '' && selectedItem !== null && <ItemPage />}
    </>
  );
};

export default Library;
