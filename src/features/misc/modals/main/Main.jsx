import variables from 'config/variables';
import { Suspense, lazy, useState, memo } from 'react';
import { MdClose } from 'react-icons/md';

import './scss/index.scss';
import { Tooltip } from 'components/Elements';
const Settings = lazy(() => import('./tabs/Settings'));
const Addons = lazy(() => import('./tabs/Addons'));
const Marketplace = lazy(() => import('./tabs/Marketplace'));

const renderLoader = () => (
  <div style={{ display: 'flex', width: '100%', minHeight: '100%' }}>
    <div className="modalSidebar">
      <span className="mainTitle">Mue</span>
    </div>
    <div className="modalTabContent">
      <div className="emptyItems">
        <div className="emptyMessage">
          <div className="loaderHolder">
            <div id="loader"></div>
            <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function MainModal({ modalClose }) {
  const [currentTab, setCurrentTab] = useState('settings');

  const changeTab = (type) => {
    setCurrentTab(type);
  };

  const renderTab = () => {
    switch (currentTab) {
      case 'addons':
        return <Addons changeTab={changeTab} />;
      case 'marketplace':
        return <Marketplace changeTab={changeTab} />;
      default:
        return <Settings changeTab={changeTab} />;
    }
  };

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
      <Suspense fallback={renderLoader()}>{renderTab()}</Suspense>
    </div>
  );
}

export default memo(MainModal);
