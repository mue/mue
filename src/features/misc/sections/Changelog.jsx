import variables from 'config/variables';
import { useState, useRef } from 'react';
import { MdOutlineWifiOff } from 'react-icons/md';

const Changelog = () => {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);

  const offlineMode = localStorage.getItem('offlineMode') === 'true';
  const isOffline = navigator.onLine === false || offlineMode;

  const getResolvedTheme = () => {
    const theme = localStorage.getItem('theme') || 'auto';
    if (theme === 'auto') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return theme;
  };

  const handleLoad = () => {
    setLoading(false);

    if (iframeRef.current?.contentWindow) {
      const theme = getResolvedTheme();
      const blogOrigin = new URL(variables.constants.CHANGELOG_URL).origin;
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'mue:theme',
          payload: { theme },
        },
        blogOrigin,
      );
    }
  };

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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading && (
        <div
          className="loaderHolder"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <div id="loader"></div>
          <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={(() => {
          const theme = getResolvedTheme();
          return `${variables.constants.CHANGELOG_URL}?embed=true&theme=${theme}`;
        })()}
        onLoad={handleLoad}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out',
        }}
        title={variables.getMessage('modals.main.settings.sections.changelog.iframe_title')}
      />
    </div>
  );
};

export { Changelog as default, Changelog };
