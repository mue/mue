import variables from 'config/variables';
import { memo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './scss/index.scss';
import Navbar from './backend/TabNavbar';
import { TabProvider, useTab } from './backend/TabContext';
import { MarketplaceDataProvider } from 'features/marketplace/api/MarketplaceDataContext';

const Settings = lazy(() => import('../../../features/misc/views/Settings'));
const Addons = lazy(() => import('../../../features/misc/views/Addons'));
const Marketplace = lazy(() => import('../../../features/misc/views/Marketplace'));

const renderLoader = () => (
  <div className="flex flex-col w-full h-[65vh] justify-center items-center">
    <div className="loaderHolder">
      <div id="loader"></div>
      <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
    </div>
  </div>
);

const MainModalContent = ({ modalClose }) => {
  const { activeTab, direction } = useTab();

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      top: '80px',
      position: 'absolute',
      width: '100%',
    }),
    center: {
      x: 0,
      opacity: 1,
      top: '80px',
      position: 'absolute',
      width: '100%',
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      top: '80px',
      position: 'absolute',
      width: '100%',
    }),
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'addons':
        return <Addons />;
      case 'marketplace':
        return <Marketplace />;
      default:
        return <Settings />;
    }
  };

  return (
    <div className="flex flex-col w-full min-w-full ">
      <Navbar modalClose={modalClose} />
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={activeTab}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', duration: 0.8 }}
          className="flex w-full min-w-full overflow-y-auto"
        >
          <Suspense fallback={renderLoader()}>{renderTab()}</Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const MainModal = ({ modalClose }) => (
  <TabProvider>
    <MarketplaceDataProvider>
      <MainModalContent modalClose={modalClose} />
    </MarketplaceDataProvider>
  </TabProvider>
);

const MemoizedMainModal = memo(MainModal);
export { MemoizedMainModal as default, MemoizedMainModal as MainModal };
