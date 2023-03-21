import variables from 'modules/variables';
import { Suspense, lazy, useState, memo } from 'react';
import PropTypes from 'prop-types';

import { MdClose } from 'react-icons/md';

import './scss/index.scss';
import Tooltip from 'components/helpers/tooltip/Tooltip';

// Lazy load all the tabs instead of the modal itself
const Settings = lazy(() => import('./tabs/Settings'));
const Addons = lazy(() => import('./tabs/Addons'));
const Marketplace = lazy(() => import('./tabs/Marketplace'));

const renderLoader = () => (
  <div style={{ display: 'flex', width: '100%', minHeight: '100%' }}>
    <ul className="sidebar">
      <span className="mainTitle">Mue</span>
    </ul>
    <div className="tab-content" style={{ width: '100%' }}>
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
      <Suspense fallback={renderLoader()}>{currentTab}</Suspense>
    </div>
  );
}

MainModal.propTypes = {
  modalClose: PropTypes.func.isRequired,
};

export default memo(MainModal);
