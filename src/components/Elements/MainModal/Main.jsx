import variables from 'config/variables';
import { Suspense, lazy, useState, memo, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

import './scss/index.scss';
import { Tooltip } from 'components/Elements';
import ModalLoader from './components/ModalLoader';
import { TAB_TYPES } from './constants/tabConfig';
import { updateHash, onHashChange } from 'utils/deepLinking';

const Settings = lazy(() => import('../../../features/misc/views/Settings'));
const Addons = lazy(() => import('../../../features/misc/views/Addons'));
const Marketplace = lazy(() => import('../../../features/misc/views/Marketplace'));

// Map tab types to their corresponding components
const TAB_COMPONENTS = {
  [TAB_TYPES.SETTINGS]: Settings,
  [TAB_TYPES.ADDONS]: Addons,
  [TAB_TYPES.MARKETPLACE]: Marketplace,
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
      <Tooltip
        style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        title={variables.getMessage('modals.welcome.buttons.close')}
        key="closeTooltip"
      >
        <span className="closeModal" onClick={modalClose}>
          <MdClose />
        </span>
      </Tooltip>
      <Suspense fallback={<ModalLoader />}>
        <TabComponent changeTab={handleChangeTab} deepLinkData={deepLinkData} />
      </Suspense>
    </div>
  );
}

export default memo(MainModal);
