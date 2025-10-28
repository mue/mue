import variables from 'config/variables';
import { Suspense, lazy, useState, memo } from 'react';
import { MdClose } from 'react-icons/md';

import './scss/index.scss';
import { Tooltip } from 'components/Elements';
import ModalLoader from './components/ModalLoader';
import { TAB_TYPES } from './constants/tabConfig';

const Settings = lazy(() => import('../../../features/misc/views/Settings'));
const Addons = lazy(() => import('../../../features/misc/views/Addons'));
const Marketplace = lazy(() => import('../../../features/misc/views/Marketplace'));

// Map tab types to their corresponding components
const TAB_COMPONENTS = {
  [TAB_TYPES.SETTINGS]: Settings,
  [TAB_TYPES.ADDONS]: Addons,
  [TAB_TYPES.MARKETPLACE]: Marketplace,
};

function MainModal({ modalClose }) {
  const [currentTab, setCurrentTab] = useState(TAB_TYPES.SETTINGS);

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
        <TabComponent changeTab={setCurrentTab} />
      </Suspense>
    </div>
  );
}

export default memo(MainModal);
