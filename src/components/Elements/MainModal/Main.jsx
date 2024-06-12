import variables from 'config/variables';
import { Suspense, lazy, useState, memo } from 'react';
import { MdClose } from 'react-icons/md';

import './scss/index.scss';
import { Tooltip } from 'components/Elements';
const Settings = lazy(() => import('../../../features/misc/views/Settings'));
const Addons = lazy(() => import('../../../features/misc/views/Addons'));
const Marketplace = lazy(() => import('../../../features/misc/views/Marketplace'));

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
        return <Addons modalClose={modalClose} changeTab={changeTab} />;
      case 'marketplace':
        return <Marketplace modalClose={modalClose} changeTab={changeTab} />;
      default:
        return <Settings modalClose={modalClose} changeTab={changeTab} />;
    }
  };

  return (
    <div className="frame">
      <Suspense fallback={renderLoader()}>{renderTab()}</Suspense>
    </div>
  );
}

const MemoizedMainModal = memo(MainModal);
export { MemoizedMainModal as default, MemoizedMainModal as MainModal };
