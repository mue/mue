import variables from 'config/variables';
import { MARKETPLACE_URL } from 'config/constants';
import { memo, useEffect, useRef, useState } from 'react';
import { MdOutlineWifiOff } from 'react-icons/md';
import Tabs from 'components/Elements/MainModal/backend/Tabs';
import { useMarketplaceInstall } from 'features/marketplace/components/hooks/useMarketplaceInstall';

function DiscoverContent({ category, onBreadcrumbsChange }) {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const { installItem, uninstallItem } = useMarketplaceInstall();

  // Check for offline mode
  const offlineMode = localStorage.getItem('offlineMode') === 'true';
  const isOffline = navigator.onLine === false || offlineMode;

  useEffect(() => {
    // Show loader when category changes
    setIsLoading(true);
    // Clear breadcrumbs when navigating to a new category
    if (onBreadcrumbsChange) {
      onBreadcrumbsChange([]);
    }

    // Update iframe src with category
    if (iframeRef.current) {
      // Collections use path-based routing, others use query params
      if (category === 'collections') {
        iframeRef.current.src = `${MARKETPLACE_URL}/collections?embed=true`;
      } else {
        iframeRef.current.src = `${MARKETPLACE_URL}?embed=true&type=${category}`;
      }
    }
  }, [category, onBreadcrumbsChange]);

  useEffect(() => {
    // Check for item parameter in URL and update iframe
    const checkAndLoadItem = () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(hash.split('?')[1]);
      const itemId = urlParams.get('item');

      if (itemId && iframeRef.current) {
        setIsLoading(true);

        // Get item from localStorage to determine type
        const installed = JSON.parse(localStorage.getItem('installed')) || [];
        const item = installed.find((i) => i.name === itemId);

        if (item) {
          // Map item type to URL path
          const pathMap = {
            photo_packs: 'packs',
            quote_packs: 'packs',
            preset_settings: 'presets',
          };

          const pathSegment = pathMap[item.type] || 'packs';
          const itemIdToUse = item.id || itemId;

          // Navigate to /packs/{id} or /presets/{id}
          iframeRef.current.src = `${MARKETPLACE_URL}/${pathSegment}/${itemIdToUse}?embed=true`;
        } else {
          // Fallback if item not found in localStorage
          iframeRef.current.src = `${MARKETPLACE_URL}/packs/${itemId}?embed=true`;
        }
      }
    };

    // Check on mount and when category changes
    checkAndLoadItem();

    // Listen for hash changes and popstate (from history.pushState)
    window.addEventListener('hashchange', checkAndLoadItem);
    window.addEventListener('popstate', checkAndLoadItem);

    return () => {
      window.removeEventListener('hashchange', checkAndLoadItem);
      window.removeEventListener('popstate', checkAndLoadItem);
    };
  }, [category]);

  useEffect(() => {
    // Listen for postMessage events from the iframe
    const handleMessage = (event) => {
      // Verify the origin if needed
      if (event.origin !== MARKETPLACE_URL) {
        return;
      }

      const { type, payload } = event.data;

      switch (type) {
        case 'marketplace:item:install':
          if (payload?.item) {
            installItem(payload.item.type, payload.item);
            // Send confirmation back to iframe
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                {
                  type: 'marketplace:item:installed',
                  payload: { id: payload.item.id || payload.item.name, installed: true },
                },
                MARKETPLACE_URL
              );
            }
          }
          break;

        case 'marketplace:item:uninstall':
          if (payload?.item) {
            uninstallItem(payload.item.type, payload.item.display_name || payload.item.name);
            // Send confirmation back to iframe
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                {
                  type: 'marketplace:item:installed',
                  payload: { id: payload.item.id || payload.item.name, installed: false },
                },
                MARKETPLACE_URL
              );
            }
          }
          break;

        case 'marketplace:item:check-installed':
          if (payload?.id) {
            // Check if item is installed
            const installed = JSON.parse(localStorage.getItem('installed')) || [];
            const isInstalled = installed.some((item) => item.id === payload.id);

            // Send status back to iframe
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                {
                  type: 'marketplace:item:installed',
                  payload: { id: payload.id, installed: isInstalled },
                },
                MARKETPLACE_URL
              );
            }
          }
          break;

        case 'marketplace:breadcrumbs':
          if (payload?.breadcrumbs && onBreadcrumbsChange) {
            onBreadcrumbsChange(payload.breadcrumbs);
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [installItem, uninstallItem, onBreadcrumbsChange]);

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
        ref={iframeRef}
        src={category === 'collections' ? `${MARKETPLACE_URL}/collections?embed=true` : `${MARKETPLACE_URL}?embed=true&type=${category}`}
        onLoad={handleLoad}
        scrolling="no"
        style={{
          width: '100%',
          height: '2000px',
          minHeight: '100vh',
          border: 'none',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out',
          overflow: 'hidden',
        }}
        title="Marketplace"
      />
    </div>
  );
}

const sections = [
  { label: 'modals.main.marketplace.all', name: 'all' },
  { label: 'modals.main.marketplace.photo_packs', name: 'photo_packs' },
  { label: 'modals.main.marketplace.quote_packs', name: 'quote_packs' },
  { label: 'modals.main.marketplace.preset_settings', name: 'preset_settings' },
  { label: 'modals.main.marketplace.collections', name: 'collections' },
];

function Discover(props) {
  return (
    <Tabs
      changeTab={(type) => props.changeTab(type)}
      current="discover"
      currentTab={props.currentTab}
      onSectionChange={props.onSectionChange}
    >
      {sections.map(({ label, name }) => (
        <div key={name} label={variables.getMessage(label)} name={name}>
          <DiscoverContent category={name} onBreadcrumbsChange={props.onBreadcrumbsChange} />
        </div>
      ))}
    </Tabs>
  );
}

export default memo(Discover);
