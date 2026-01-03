import { Suspense, lazy, useState, memo, useEffect } from 'react';
import variables from 'config/variables';

import './scss/index.scss';
import ModalLoader from './components/ModalLoader';
import ModalTopBar from './components/ModalTopBar';
import { TAB_TYPES } from './constants/tabConfig';
import { updateHash, parseDeepLink } from 'utils/deepLinking';

const Settings = lazy(() => import('../../../features/misc/views/Settings'));
const Library = lazy(() => import('../../../features/misc/views/Library'));
const Discover = lazy(() => import('../../../features/misc/views/Discover'));

// Map tab types to their corresponding components
const TAB_COMPONENTS = {
  [TAB_TYPES.SETTINGS]: Settings,
  [TAB_TYPES.LIBRARY]: Library,
  [TAB_TYPES.DISCOVER]: Discover,
};

function MainModal({ modalClose, deepLinkData }) {
  // Initialize with deep link tab if provided, otherwise default to settings
  const initialTab = deepLinkData?.tab || TAB_TYPES.SETTINGS;
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [currentSection, setCurrentSection] = useState('');
  const [productView, setProductView] = useState(null);
  const [resetDiscoverToAll, setResetDiscoverToAll] = useState(false);
  const [navigationTrigger, setNavigationTrigger] = useState(null);
  const [iframeBreadcrumbs, setIframeBreadcrumbs] = useState([]);

  // Clear product view when changing tabs
  useEffect(() => {
    setProductView(null);
  }, [currentTab]);

  // Clear hash when modal closes
  useEffect(() => {
    return () => {
      // When modal unmounts, clear the hash
      if (window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname);
      }
    };
  }, []);

  useEffect(() => {
    // Listen for browser back/forward navigation via popstate
    const handlePopState = () => {
      const linkData = window.location.hash ? parseDeepLink(window.location.hash) : null;

      if (linkData) {
        // Update tab if different
        if (linkData.tab && linkData.tab !== currentTab) {
          setCurrentTab(linkData.tab);
        }

        // Handle product and collection navigation
        if (linkData.itemId && linkData.collection && linkData.fromCollection) {
          // Product viewed from within a collection
          // First set collection state, then navigate to product
          setNavigationTrigger({
            type: 'collection',
            data: linkData.collection,
            timestamp: Date.now(),
          });
          // Small delay to ensure collection state is set before navigating to product
          setTimeout(() => {
            setNavigationTrigger({
              type: 'product',
              data: {
                id: linkData.itemId,
                type: linkData.category,
              },
              timestamp: Date.now(),
            });
          }, 100);
        } else if (linkData.itemId) {
          // Product navigation (standalone)
          setNavigationTrigger({
            type: 'product',
            data: {
              id: linkData.itemId,
              type: linkData.category,
            },
            timestamp: Date.now(),
          });
        } else if (linkData.collection) {
          // Collection page navigation
          setNavigationTrigger({
            type: 'collection',
            data: linkData.collection,
            timestamp: Date.now(),
          });
        } else {
          // Back to main view (clear collection state)
          setProductView(null);
          setNavigationTrigger({
            type: 'main',
            data: { clearCollection: true },
            timestamp: Date.now(),
          });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentTab]);

  const handleChangeTab = (newTab) => {
    setCurrentTab(newTab);
    // Update URL hash when tab changes
    if (newTab === TAB_TYPES.DISCOVER) {
      updateHash(`#${newTab}/all`);
    } else if (newTab === TAB_TYPES.LIBRARY) {
      updateHash(`#${newTab}/added`);
    } else {
      updateHash(`#${newTab}`);
    }
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    // Update URL hash when section changes
    if (currentTab === TAB_TYPES.DISCOVER) {
      // For Discover tab, update with the section type
      const sectionMap = {
        [variables.getMessage('modals.main.marketplace.all')]: 'all',
        [variables.getMessage('modals.main.marketplace.photo_packs')]: 'photo_packs',
        [variables.getMessage('modals.main.marketplace.quote_packs')]: 'quote_packs',
        [variables.getMessage('modals.main.marketplace.preset_settings')]: 'preset_settings',
        [variables.getMessage('modals.main.marketplace.collections')]: 'collections',
      };
      const sectionKey = sectionMap[section];
      if (sectionKey) {
        updateHash(`#${currentTab}/${sectionKey}`);
      }
    }

    // Don't add section changes to history - they're automatic
    // Only track user-initiated navigation (tab switches and product views)
  };

  const handleProductView = (product) => {
    setProductView(product);
    // URL hash is already updated by child components (Browse.jsx)
    // Browser history automatically tracks hash changes
  };

  const handleResetDiscoverToAll = () => {
    setResetDiscoverToAll(true);
    setTimeout(() => setResetDiscoverToAll(false), 100);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleForward = () => {
    window.history.forward();
  };

  // Browser manages history state, so we always show buttons enabled
  // Browser will handle whether there's actually history to go back/forward
  const canGoBack = true;
  const canGoForward = true;

  const TabComponent = TAB_COMPONENTS[currentTab] || Settings;

  return (
    <div className="frame">
      <ModalTopBar
        currentTab={currentTab}
        currentSection={currentSection}
        productView={productView}
        iframeBreadcrumbs={iframeBreadcrumbs}
        onTabChange={handleChangeTab}
        onClose={modalClose}
        onBack={handleBack}
        onForward={handleForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />
      <Suspense fallback={<ModalLoader />}>
        <TabComponent
          key={currentTab}
          changeTab={handleChangeTab}
          deepLinkData={deepLinkData}
          currentTab={currentTab}
          onSectionChange={handleSectionChange}
          onProductView={handleProductView}
          onBreadcrumbsChange={setIframeBreadcrumbs}
          resetToAll={resetDiscoverToAll}
          onResetToAll={handleResetDiscoverToAll}
          navigationTrigger={navigationTrigger}
        />
      </Suspense>
    </div>
  );
}

export default memo(MainModal);
