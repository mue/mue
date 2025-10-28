import variables from 'config/variables';

const ModalLoader = () => (
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

export default ModalLoader;
