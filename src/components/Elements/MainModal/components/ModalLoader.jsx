import { useT } from 'contexts';
import SidebarSkeleton from './SidebarSkeleton';

const ModalLoader = ({ currentTab }) => (
  <div style={{ display: 'flex', width: '100%', minHeight: '100%' }}>
    <div className="modalSidebar">
      <SidebarSkeleton currentTab={currentTab} />
    </div>
    <div className="modalTabContent">
      <div className="emptyItems">
        <div className="emptyMessage">
          <div className="loaderHolder">
            <div id="loader"></div>
            <span className="subtitle">{t('modals.main.loading')}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ModalLoader;
