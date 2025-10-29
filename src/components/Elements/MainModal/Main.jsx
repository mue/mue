import { Suspense, lazy, useState, memo, useEffect } from 'react';

import './scss/index.scss';
import ModalLoader from './components/ModalLoader';
import ModalTopBar from './components/ModalTopBar';
import { TAB_TYPES } from './constants/tabConfig';
import { updateHash, onHashChange } from 'utils/deepLinking';

const Settings = lazy(() => import('../../../features/misc/views/Settings'));
const Library = lazy(() => import('../../../features/misc/views/Library'));
const Discover = lazy(() => import('../../../features/misc/views/Discover'));

// Map tab types to their corresponding components
const TAB_COMPONENTS = {
  [TAB_TYPES.SETTINGS]: Settings,
  [TAB_TYPES.LIBRARY]: Library,
  [TAB_TYPES.DISCOVER]: Discover,
};

function MainModal({ modalClose, deepLinkData }) {
  // Initialize with deep link tab if provided, otherwise default to settings
  const initialTab = deepLinkData?.tab || TAB_TYPES.SETTINGS;
  const [currentTab, setCurrentTab] = useState(initialTab);

  useEffect(() => {
    // Listen for hash changes while modal is open
    const cleanup = onHashChange((linkData) => {
      if (linkData && linkData.tab !== currentTab) {
        setCurrentTab(linkData.tab);
      }
    });

    return cleanup;
  }, [currentTab]);

  const handleChangeTab = (newTab) => {
    setCurrentTab(newTab);
    // Update URL hash when tab changes
    updateHash(`#${newTab}`);
  };

  const TabComponent = TAB_COMPONENTS[currentTab] || Settings;

  return (
    <div className="frame">
      <ModalTopBar currentTab={currentTab} onTabChange={handleChangeTab} onClose={modalClose} />
      <Suspense fallback={<ModalLoader />}>
        <TabComponent
          changeTab={handleChangeTab}
          deepLinkData={deepLinkData}
          currentTab={currentTab}
        />
      </Suspense>
    </div>
  );
}

export default memo(MainModal);
