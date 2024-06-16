import variables from 'config/variables';
import { memo, useState, useEffect } from 'react';

import MarketplaceTab from '../../marketplace/views/Browse';
import { sortItems } from '../../marketplace/api';
import { NewItems as Items } from '../../marketplace/components/Items/NewItems';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';
import { NewItemPage } from '../../marketplace/views/newItemPage';
import { AnimatePresence, motion } from 'framer-motion';

function Marketplace(props) {
  const [done, setDone] = useState(false);
  const [items, setItems] = useState([]);
  const [type, setType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const { subTab } = useTab();

  const controller = new AbortController();

  async function getItems() {
    setDone(false);
    const dataURL =
      variables.constants.API_URL +
      (type === 'collections' ? '/marketplace/collections' : '/marketplace/items/' + type);

    const { data } = await (
      await fetch(dataURL, {
        signal: controller.signal,
      })
    ).json();

    if (controller.signal.aborted === true) {
      return;
    }

    setItems(sortItems(data, 'z-a'));
    setDone(true);
  }

  useEffect(() => {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return;
    }

    getItems();
  }, []);

  return (
    {
      /*<Tabs changeTab={(type) => props.changeTab(type)} current="marketplace" modalClose={props.modalClose}>
      <div label={variables.getMessage('modals.main.marketplace.all')} name="all">
        <MarketplaceTab type="all" />
      </div>
      <div label={variables.getMessage('modals.main.marketplace.photo_packs')} name="photo_packs">
        <MarketplaceTab type="photo_packs" />
      </div>
      <div label={variables.getMessage('modals.main.marketplace.quote_packs')} name="quote_packs">
        <MarketplaceTab type="quote_packs" />
      </div>
      <div
        label={variables.getMessage('modals.main.marketplace.preset_settings')}
        name="preset_settings"
      >
        <MarketplaceTab type="preset_settings" />
      </div>
      <div label={variables.getMessage('modals.main.marketplace.collections')} name="collections">
        <MarketplaceTab type="collections" />
      </div>
    </Tabs>*/
    },
    (
      <AnimatePresence mode="wait">
        <motion.div
          className="modalTabContent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 10 }}
        >
          {subTab === '' ? (
            <motion.div key="items">
              <Items items={items} />
            </motion.div>
          ) : (
            <motion.div key="itempage">
              <NewItemPage />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    )
  );
}

export default memo(Marketplace);
