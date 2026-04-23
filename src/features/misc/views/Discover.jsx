import { useT } from 'contexts';
import variables from 'config/variables';
import { MARKETPLACE_URL } from 'config/constants';
import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { MdOutlineWifiOff } from 'react-icons/md';
import Modal from 'react-modal';
import Tabs from 'components/Elements/MainModal/backend/Tabs';
import { useMarketplaceInstall } from 'features/marketplace/components/hooks/useMarketplaceInstall';
import Lightbox from 'features/marketplace/components/Elements/Lightbox/Lightbox';

function DiscoverContent({ category, onBreadcrumbsChange, deepLinkData }) {
  const t = useT();
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const { installItem, uninstallItem } = useMarketplaceInstall();

  const offlineMode = localStorage.getItem('offlineMode') === 'true';
  const isPreviewMode = localStorage.getItem('showWelcome') === 'true';
  const previewParam = isPreviewMode ? '&preview=true' : '';
  const isOffline = navigator.onLine === false || offlineMode;

  useEffect(() => {
    return () => {
      if (onBreadcrumbsChange) {
        onBreadcrumbsChange([]);
      }
    };
  }, [onBreadcrumbsChange]);

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
    if (deepLinkData?.itemId || deepLinkData?.collection) {
      return;
    }

    setLoading(true);
    if (onBreadcrumbsChange) {
      onBreadcrumbsChange([]);
    }

    const theme = getResolvedTheme();
    const themeParam = `&theme=${theme}`;

    if (iframeRef.current) {
      if (category === 'collections') {
        iframeRef.current.src = `${MARKETPLACE_URL}/collections?embed=true${previewParam}${themeParam}`;
      } else {
        iframeRef.current.src = `${MARKETPLACE_URL}?embed=true&type=${category}${previewParam}${themeParam}`;
      }
    }
  }, [category, onBreadcrumbsChange, previewParam, deepLinkData]);

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }

    const theme = getResolvedTheme();
    const themeParam = `&theme=${theme}`;

    // Handle collection deep link
    if (deepLinkData?.collection && !deepLinkData?.itemId) {
      setLoading(true);
      const url = `${MARKETPLACE_URL}/collection/${encodeURIComponent(deepLinkData.collection)}?embed=true${previewParam}${themeParam}`;
      console.log('[Discover] Loading collection iframe:', {
        collection: deepLinkData.collection,
        url,
      });
      iframeRef.current.src = url;
      return;
    }

    // Handle item deep link (with or without collection context)
    if (deepLinkData?.itemId) {
      setLoading(true);

      const pathMap = {
        photo_packs: 'packs',
        quote_packs: 'packs',
        preset_settings: 'presets',
      };

      let pathSegment = 'packs'; // default

      // If category is known and not 'all', use it
      if (deepLinkData.category && deepLinkData.category !== 'all') {
        pathSegment = pathMap[deepLinkData.category] || 'packs';
      } else {
        // Look up the item to determine its type
        const installed = JSON.parse(localStorage.getItem('installed')) || [];
        const item = installed.find(
          (i) => i.name === deepLinkData.itemId || i.id === deepLinkData.itemId,
        );

        if (item) {
          const typeMap = {
            photos: 'packs',
            quotes: 'packs',
            settings: 'presets',
          };
          pathSegment = typeMap[item.type] || 'packs';
        }
      }

      iframeRef.current.src = `${MARKETPLACE_URL}/${pathSegment}/${deepLinkData.itemId}?embed=true${previewParam}${themeParam}`;
    }
  }, [deepLinkData, previewParam]);

  useEffect(() => {
    const handleMessage = (event) => {
      const marketplaceOrigin = new URL(MARKETPLACE_URL).origin;
      if (event.origin !== marketplaceOrigin) {
        return;
      }

      const { type, payload } = event.data;

      switch (type) {
        case 'marketplace:item:install':
          if (payload?.item) {
            const itemId = payload.item.id || payload.item.name;
            const itemType = payload.item.type;

            fetch(`${variables.constants.API_URL}/marketplace/item/${itemId}`)
              .then((res) => res.json())
              .then(({ data }) => {
                installItem(data.type, data);
              })
              .catch((error) => {
                console.error('Failed to fetch item from API, using iframe data:', error);
                installItem(itemType, payload.item);
              })
              .finally(() => {
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
            const installed = JSON.parse(localStorage.getItem('installed')) || [];
            const isInstalled = installed.some((item) => item.id === payload.id);

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

        case 'marketplace:navigate':
          if (payload?.itemId) {
            // Use the simpler item route
            navigate(`/discover/item/${payload.itemId}`);
          } else if (payload?.category) {
            navigate(`/discover/${payload.category}`);
          }
          break;

        case 'marketplace:navigation':
          // Handle navigation from the iframe (website sends this when URL changes)
          if (payload?.path) {
            // Parse the path: /marketplace/packs/abc123 or /marketplace/presets/xyz789 or /marketplace/collection/collection-name
            const pathParts = payload.path.split('/').filter(Boolean);

            if (pathParts.length >= 3 && pathParts[0] === 'marketplace') {
              const secondSegment = pathParts[1];
              const thirdSegment = pathParts[2];

              if (secondSegment === 'collection') {
                // Collection path: /marketplace/collection/collection-name
                const collectionId = thirdSegment;
                console.log('[Discover] Collection navigation:', {
                  collectionId,
                  fullPath: payload.path,
                });
                if (pathParts.length >= 4) {
                  // Collection item path: /marketplace/collection/collection-name/item-id
                  const itemId = pathParts[3];
                  navigate(`/discover/collection/${collectionId}/${itemId}`);
                } else {
                  // Just collection
                  navigate(`/discover/collection/${collectionId}`);
                }
              } else {
                // Item path: /marketplace/packs/abc123 or /marketplace/presets/xyz789
                const itemId = thirdSegment;
                navigate(`/discover/item/${itemId}`);
              }
            } else if (pathParts.length === 2 && pathParts[0] === 'marketplace') {
              // Category page like /marketplace?type=photo_packs
              // Already on the category, no need to navigate
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
  }, [installItem, uninstallItem, onBreadcrumbsChange, navigate]);

  const handleLoad = () => {
    setLoading(false);

    if (onBreadcrumbsChange) {
      onBreadcrumbsChange([]);
    }

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

  if (isOffline) {
    return (
      <div className="emptyItems">
        <div className="emptyMessage">
          <MdOutlineWifiOff />
          <h1>{t('modals.main.marketplace.offline.title')}</h1>
          <p className="description">{t('modals.main.marketplace.offline.description')}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <Modal
        closeTimeoutMS={300}
        onRequestClose={() => setShowLightbox(false)}
        open={showLightbox}
        className="Modal lightBoxModal"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        <Lightbox modalClose={() => setShowLightbox(false)} img={lightboxImg} />
      </Modal>
      {loading && (
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
          <span className="subtitle">{t('modals.main.loading')}</span>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={(() => {
          const theme = getResolvedTheme();
          const themeParam = `&theme=${theme}`;

          // Handle collection deep link
          if (deepLinkData?.collection && !deepLinkData?.itemId) {
            return `${MARKETPLACE_URL}/collection/${encodeURIComponent(deepLinkData.collection)}?embed=true${previewParam}${themeParam}`;
          }

          // Handle item deep link
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

          // Handle category view
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
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out',
        }}
        title={t('modals.main.marketplace.title')}
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
      sections={sections}
      deepLinkData={props.deepLinkData}
    >
      {sections.map(({ label, name }) => (
        <div key={name} label={t(label)} name={name}>
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
