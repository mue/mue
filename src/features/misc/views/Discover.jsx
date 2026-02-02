import variables from 'config/variables';
import { MARKETPLACE_URL } from 'config/constants';
import { memo, useEffect, useRef, useState } from 'react';
import { updateHash } from 'utils/deepLinking';
import { MdOutlineWifiOff } from 'react-icons/md';
import Modal from 'react-modal';
import Tabs from 'components/Elements/MainModal/backend/Tabs';
import { useMarketplaceInstall } from 'features/marketplace/components/hooks/useMarketplaceInstall';
import Lightbox from 'features/marketplace/components/Elements/Lightbox/Lightbox';

function DiscoverContent({ category, onBreadcrumbsChange, deepLinkData }) {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const { installItem, uninstallItem } = useMarketplaceInstall();

  // Check for offline mode
  const offlineMode = localStorage.getItem('offlineMode') === 'true';
  // Check for preview mode
  const isPreviewMode = localStorage.getItem('showWelcome') === 'true';
  const previewParam = isPreviewMode ? '&preview=true' : '';
  const isOffline = navigator.onLine === false || offlineMode;

  // Clear breadcrumbs when component unmounts (navigating away from discover)
  useEffect(() => {
    return () => {
      if (onBreadcrumbsChange) {
        onBreadcrumbsChange([]);
      }
    };
  }, [onBreadcrumbsChange]);

  // Helper function to resolve auto theme
  const getResolvedTheme = () => {
    const theme = localStorage.getItem('theme') || 'auto';
    if (theme === 'auto') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return theme;
  };

  useEffect(() => {
    // Skip category navigation if we have a deep link item to navigate to
    if (deepLinkData?.itemId) {
      return;
    }

    // Show loader when category changes
    setIsLoading(true);
    // Clear breadcrumbs when navigating to a new category
    if (onBreadcrumbsChange) {
      onBreadcrumbsChange([]);
    }

    // Get current theme
    const theme = getResolvedTheme();
    const themeParam = `&theme=${theme}`;

    // Update iframe src with category
    if (iframeRef.current) {
      // Collections use path-based routing, others use query params
      if (category === 'collections') {
        iframeRef.current.src = `${MARKETPLACE_URL}/collections?embed=true${previewParam}${themeParam}`;
      } else {
        iframeRef.current.src = `${MARKETPLACE_URL}?embed=true&type=${category}${previewParam}${themeParam}`;
      }
    }
  }, [category, onBreadcrumbsChange, previewParam, deepLinkData]);

  useEffect(() => {
    // Check for item parameter in URL and update iframe
    const checkAndLoadItem = () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(hash.split('?')[1]);
      const itemId = urlParams.get('item');

      if (itemId && iframeRef.current) {
        setIsLoading(true);

        // Get current theme
        const theme = getResolvedTheme();
        const themeParam = `&theme=${theme}`;

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
          iframeRef.current.src = `${MARKETPLACE_URL}/${pathSegment}/${itemIdToUse}?embed=true${previewParam}${themeParam}`;
        } else {
          // Fallback if item not found in localStorage
          iframeRef.current.src = `${MARKETPLACE_URL}/packs/${itemId}?embed=true${previewParam}${themeParam}`;
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
  }, [category, previewParam]);

  // Handle deep link item navigation on mount
  useEffect(() => {
    if (deepLinkData?.itemId && iframeRef.current) {
      setIsLoading(true);
      const theme = getResolvedTheme();
      const themeParam = `&theme=${theme}`;

      // Map category to URL path segment
      const pathMap = {
        photo_packs: 'packs',
        quote_packs: 'packs',
        preset_settings: 'presets',
      };

      const pathSegment = deepLinkData.category
        ? pathMap[deepLinkData.category] || 'packs'
        : 'packs';
      iframeRef.current.src = `${MARKETPLACE_URL}/${pathSegment}/${deepLinkData.itemId}?embed=true${previewParam}${themeParam}`;
    }
  }, [deepLinkData, previewParam]);

  // Send navigation commands to iframe when hash changes externally (e.g., browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      if (!iframeRef.current?.contentWindow) return;
      
      const hash = window.location.hash;
      if (!hash || !hash.startsWith('#discover')) return;
      
      // Parse hash to determine target path
      // e.g., #discover/photo_packs/123 -> /marketplace/packs/123
      // e.g., #discover/preset_settings/456 -> /marketplace/presets/456
      // e.g., #discover/collections -> /marketplace/collections
      // e.g., #discover/collection/featured -> /marketplace/collection/featured
      
      const parts = hash.slice(1).split('/');
      if (parts.length < 2) return;
      
      let targetPath = '/marketplace';
      
      if (parts[1] === 'collections') {
        targetPath = '/marketplace/collections';
      } else if (parts[1] === 'collection' && parts[2]) {
        targetPath = `/marketplace/collection/${parts[2]}`;
      } else if (parts[2]) {
        // Item view - map category to path
        const pathMap = {
          photo_packs: 'packs',
          quote_packs: 'packs',
          preset_settings: 'presets',
        };
        const pathSegment = pathMap[parts[1]] || 'packs';
        targetPath = `/marketplace/${pathSegment}/${parts[2]}`;
      } else if (parts[1] !== 'all') {
        // Category filter
        targetPath = `/marketplace?type=${parts[1]}`;
      }
      
      // Send navigation command to iframe
      const theme = getResolvedTheme();
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'marketplace:navigate',
          payload: { path: targetPath }
        },
        MARKETPLACE_URL
      );
    };
    
    // Listen for hash changes from browser navigation
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Listen for postMessage events from the iframe
    const handleMessage = (event) => {
      // Verify the origin if needed
      const marketplaceOrigin = new URL(MARKETPLACE_URL).origin;
      if (event.origin !== marketplaceOrigin) {
        return;
      }

      const { type, payload } = event.data;

      switch (type) {
        case 'marketplace:item:install':
          if (payload?.item) {
            // Fetch fresh data from API to ensure we get latest version with blur_hash
            const itemId = payload.item.id || payload.item.name;
            const itemType = payload.item.type;

            fetch(`${variables.constants.API_URL}/marketplace/item/${itemId}`)
              .then((res) => res.json())
              .then(({ data }) => {
                // Install with fresh data from API
                installItem(data.type, data);
              })
              .catch((error) => {
                console.error('Failed to fetch item from API, using iframe data:', error);
                // Fallback to iframe data if API fetch fails
                installItem(itemType, payload.item);
              })
              .finally(() => {
                // Send confirmation back to iframe
                if (iframeRef.current?.contentWindow) {
                  iframeRef.current.contentWindow.postMessage(
                    {
                      type: 'marketplace:item:installed',
                      payload: { id: itemId, installed: true },
                    },
                    MARKETPLACE_URL,
                  );
                }
              });
          }
          break;

        case 'marketplace:item:uninstall':
          if (payload?.item) {
            uninstallItem(payload.item.type, payload.item.name || payload.item.display_name);
            // Send confirmation back to iframe
            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                {
                  type: 'marketplace:item:installed',
                  payload: { id: payload.item.id || payload.item.name, installed: false },
                },
                MARKETPLACE_URL,
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
                MARKETPLACE_URL,
              );
            }
          }
          break;

        case 'marketplace:breadcrumbs':
          if (payload?.breadcrumbs && onBreadcrumbsChange) {
            onBreadcrumbsChange(payload.breadcrumbs);
            // Scroll modal content to top when navigating to an item
            if (payload.breadcrumbs.length > 0) {
              const modalContent = document.querySelector('.modalTabContent');
              if (modalContent) {
                modalContent.scrollTop = 0;
              }
            }
          }
          break;

        case 'marketplace:lightbox':
          if (payload?.photo) {
            setLightboxImg(payload.photo.url);
            setShowLightbox(true);
          }
          break;

        case 'marketplace:navigation':
          // Update parent URL when iframe navigates
          if (payload?.path) {
            // Parse the path to extract relevant info
            // e.g., /marketplace/packs/123 -> #discover/photo_packs/123
            // e.g., /marketplace/presets/456 -> #discover/preset_settings/456
            // e.g., /marketplace/collections -> #discover/collections
            // e.g., /marketplace/collection/featured -> #discover/collection/featured
            
            const path = payload.path;
            
            if (path.includes('/packs/')) {
              const itemId = path.split('/packs/')[1]?.split('?')[0];
              if (itemId) {
                // Determine type from installed items or default to photo_packs
                const installed = JSON.parse(localStorage.getItem('installed')) || [];
                const item = installed.find(i => i.id === itemId);
                const category = item?.type || 'photo_packs';
                updateHash(`#discover/${category}/${itemId}`);
              }
            } else if (path.includes('/presets/')) {
              const itemId = path.split('/presets/')[1]?.split('?')[0];
              if (itemId) {
                updateHash(`#discover/preset_settings/${itemId}`);
              }
            } else if (path.includes('/collection/')) {
              const collectionId = path.split('/collection/')[1]?.split('?')[0];
              if (collectionId) {
                updateHash(`#discover/collection/${collectionId}`);
              }
            } else if (path.includes('/collections')) {
              updateHash('#discover/collections');
            } else if (path === '/marketplace' || path === '/marketplace/') {
              // Extract type from search params if present
              const searchParams = new URLSearchParams(payload.search || '');
              const type = searchParams.get('type') || 'all';
              updateHash(`#discover/${type}`);
            }
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

    // Clear breadcrumbs when iframe loads - if on an item page, iframe will send new breadcrumbs
    if (onBreadcrumbsChange) {
      onBreadcrumbsChange([]);
    }

    // Send theme to iframe after it loads
    if (iframeRef.current?.contentWindow) {
      const theme = getResolvedTheme();
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'marketplace:theme',
          payload: { theme },
        },
        MARKETPLACE_URL,
      );
    }
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
      <Modal
        closeTimeoutMS={300}
        onRequestClose={() => setShowLightbox(false)}
        isOpen={showLightbox}
        className="Modal lightBoxModal"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        <Lightbox modalClose={() => setShowLightbox(false)} img={lightboxImg} />
      </Modal>
      {isLoading && (
        <div
          className="loaderHolder"
          style={{
            position: 'absolute',
            top: '20%',
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
          const themeParam = `&theme=${theme}`;
          // If we have a deep link item ID, navigate directly to the item
          if (deepLinkData?.itemId) {
            const pathMap = {
              photo_packs: 'packs',
              quote_packs: 'packs',
              preset_settings: 'presets',
            };
            const pathSegment = deepLinkData.category
              ? pathMap[deepLinkData.category] || 'packs'
              : 'packs';
            return `${MARKETPLACE_URL}/${pathSegment}/${deepLinkData.itemId}?embed=true${previewParam}${themeParam}`;
          }
          return category === 'collections'
            ? `${MARKETPLACE_URL}/collections?embed=true${previewParam}${themeParam}`
            : `${MARKETPLACE_URL}?embed=true&type=${category}${previewParam}${themeParam}`;
        })()}
        onLoad={handleLoad}
        scrolling="no"
        style={{
          width: '100%',
          height: '1500px',
          minHeight: '100vh',
          border: 'none',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out',
        }}
        title={variables.getMessage('modals.main.marketplace.title')}
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
          <DiscoverContent
            category={name}
            onBreadcrumbsChange={props.onBreadcrumbsChange}
            deepLinkData={props.deepLinkData}
          />
        </div>
      ))}
    </Tabs>
  );
}

export default memo(Discover);
