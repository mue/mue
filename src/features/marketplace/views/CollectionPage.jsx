import { useMarketData } from 'features/marketplace/api/MarketplaceDataContext';
import variables from 'config/variables';
import { MdLibraryAdd } from 'react-icons/md';
import { Button } from 'components/Elements';
import { NewItems as Items } from '../components/Items/Items';

function CollectionPage() {
  const { selectedCollection } = useMarketData();

  console.log(selectedCollection);

  /*async function installCollection() {
    setBusy(true);
    try {
      const installed = JSON.parse(localStorage.getItem('installed'));
      for (const item of items) {
        if (installed.some((i) => i.name === item.display_name)) continue; // don't install if already installed
        let { data } = await (
          await fetch(`${variables.constants.API_URL}/marketplace/item/${item.type}/${item.name}`, {
            signal: controller.signal,
          })
        ).json();
        install(data.type, data, false, true);
        variables.stats.postEvent('marketplace-item', `${item.display_name} installed}`);
        variables.stats.postEvent('marketplace', 'Install');
      }
      toast(variables.getMessage('toasts.installed'));
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast(variables.getMessage('toasts.error'));
    } finally {
      setBusy(false);
    }
  }

  function returnToMain() {
    setCollection(false);
  }*/

  return (
    <>
      {/*<Header
        title={variables.getMessage('modals.main.navbar.marketplace')}
        secondaryTitle={collectionTitle}
        report={false}
        goBack={() => returnToMain()}
      />*/}
      <div
        className="collectionPage"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent, black), url('${selectedCollection.img}')`,
        }}
      >
        <div className="nice-tag">{variables.getMessage('marketplace:collection')}</div>
        <div className="content">
          <span className="mainTitle">{selectedCollection.display_name}</span>
        </div>

        <Button
          type="collection"
          //onClick={() => installCollection()}
          //disabled={busy}
          icon={<MdLibraryAdd />}
          label={variables.getMessage('marketplace:add_all')}
          /*label={
            busy
              ? variables.getMessage('marketplace:installing')
              : variables.getMessage('marketplace:add_all')
          }*/
        />
      </div>
      <Items items={selectedCollection?.items} />
    </>
  );
}

export { CollectionPage as default, CollectionPage };
