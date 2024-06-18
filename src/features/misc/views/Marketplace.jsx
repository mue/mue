import { memo, useEffect } from 'react';
import { useMarketData } from 'features/marketplace/api/MarketplaceDataContext';
import MarketplaceTab from '../../marketplace/views/Browse';
import { NewItems as Items } from '../../marketplace/components/Items/NewItems';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';
import { NewItemPage } from '../../marketplace/views/newItemPage';
import { AnimatePresence, motion } from 'framer-motion';

function Marketplace(props) {
  const { done, items, getItems } = useMarketData();
  const { subTab } = useTab();

  useEffect(() => {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return;
    }
    getItems();
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="modalTabContent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
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
  );
}

export default memo(Marketplace);
