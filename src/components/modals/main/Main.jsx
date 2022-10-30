import variables from 'modules/variables';
import { Suspense, lazy, useState } from 'react';

import { memo } from 'react';
import { MdClose } from 'react-icons/md';

import Tabs from './tabs/backend/Tabs';

import './scss/index.scss';
import Tooltip from '../../helpers/tooltip/Tooltip';

// Lazy load all the tabs instead of the modal itself
const Settings = lazy(() => import('./tabs/Settings'));
const Addons = lazy(() => import('./tabs/Addons'));
const Marketplace = lazy(() => import('./tabs/Marketplace'));

const renderLoader = (current) => (
  <Tabs current={current}>
    <div label={variables.getMessage('modals.main.loading')}>
      <div className="emptyItems">
        <div className="emptyMessage">
          <div className="loaderHolder">
            <div id="loader"></div>
            <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
          </div>
        </div>
      </div>
    </div>
    <div label="" style={{ display: 'none' }}></div>
  </Tabs>
);

function MainModal({ modalClose }) {
  const [currentTab, setCurrentTab] = useState(0);

  const changeTab = (type) => {
    switch (type) {
      case 'settings':
        setCurrentTab(<Settings changeTab={changeTab} />);
        break;
      case 'addons':
        setCurrentTab(<Addons changeTab={changeTab} />);
        break;
      case 'marketplace':
        setCurrentTab(<Marketplace changeTab={changeTab} />);
        break;
      default:
        break;
    }
  };

  if (currentTab === 0) {
    setCurrentTab(<Settings changeTab={changeTab} />);
  }

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
      <Suspense fallback={renderLoader(currentTab)}>{currentTab}</Suspense>
    </div>
  );
}

export default memo(MainModal);