import variables from 'config/variables';
import { useState } from 'react';
import { MdOutlineWifiOff } from 'react-icons/md';

const Changelog = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const offlineMode = localStorage.getItem('offlineMode') === 'true';
  const isOffline = navigator.onLine === false || offlineMode;

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Show offline error message if offline
  if (isOffline) {
    return (
      <div className="emptyItems">
        <div className="emptyMessage">
          <MdOutlineWifiOff />
          <h1>{variables.getMessage('modals.main.marketplace.offline.title')}</h1>
          <p className="description">
            {variables.getMessage('modals.main.marketplace.offline.description')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {isLoading && (
        <div className="loaderHolder" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10
        }}>
          <div id="loader"></div>
          <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
        </div>
      )}
      <iframe
        src="http://localhost:3000/blog/changelog?embed=true"
        onLoad={handleLoad}
        scrolling="no"
        style={{
          width: '100%',
          height: '2000px',
          minHeight: '100vh',
          border: 'none',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out',
        }}
        title="Changelog"
      />
    </div>
  );
};

export { Changelog as default, Changelog };
