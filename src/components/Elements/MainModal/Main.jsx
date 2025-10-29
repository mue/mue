import { Suspense, lazy, useState, memo, useEffect } from 'react';
import variables from 'config/variables';

import './scss/index.scss';
import ModalLoader from './components/ModalLoader';
import ModalTopBar from './components/ModalTopBar';
import { TAB_TYPES } from './constants/tabConfig';
import { updateHash, onHashChange } from 'utils/deepLinking';

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
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [navigationTrigger, setNavigationTrigger] = useState(null);
  const [skipNextHistoryAdd, setSkipNextHistoryAdd] = useState(0);

  // Clear product view when changing tabs
  useEffect(() => {
    setProductView(null);
  }, [currentTab]);

  useEffect(() => {
    // Listen for hash changes while modal is open
    const cleanup = onHashChange((linkData) => {
      if (linkData && linkData.tab !== currentTab) {
        setCurrentTab(linkData.tab);
      }
    });

    return cleanup;
  }, [currentTab]);

  const addToHistory = (state) => {
    // Check if this state is different from the current one
    const currentState = navigationHistory[historyIndex];
    const isDifferent = !currentState ||
      currentState.tab !== state.tab ||
      currentState.section !== state.section ||
      JSON.stringify(currentState.product) !== JSON.stringify(state.product);

    if (isDifferent) {
      const newHistory = navigationHistory.slice(0, historyIndex + 1);
      newHistory.push(state);
      setNavigationHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      console.log('Added to history:', state, 'New history:', newHistory);
    } else {
      console.log('Skipping duplicate history entry:', state);
    }
  };

  const handleChangeTab = (newTab) => {
    // Only add to history if not navigating via history
    if (skipNextHistoryAdd === 0) {
      addToHistory({
        tab: newTab,
        section: '',
        product: null,
      });
    } else {
      setSkipNextHistoryAdd(0); // Reset skip counter
    }

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

    // Add to navigation history only if not skipping
    // Store only essential product info, not full object
    if (product && skipNextHistoryAdd === 0) {
      addToHistory({
        tab: currentTab,
        section: currentSection,
        product: {
          type: product.type,
          name: product.name,
          id: product.id,
        },
      });
    } else if (skipNextHistoryAdd > 0) {
      console.log('Skipping product view history add');
      setSkipNextHistoryAdd(0); // Reset after use
    }
  };

  const handleResetDiscoverToAll = () => {
    setResetDiscoverToAll(true);
    setTimeout(() => setResetDiscoverToAll(false), 100);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = navigationHistory[newIndex];
      console.log('Going back to:', previousState);

      setHistoryIndex(newIndex);

      // Set skip flag BEFORE changing any state
      setSkipNextHistoryAdd(1);

      // Change tab if different
      if (previousState.tab !== currentTab) {
        setCurrentTab(previousState.tab);
      }

      setCurrentSection(previousState.section);
      setProductView(previousState.product);

      // Trigger navigation in child components
      if (previousState.product) {
        // Viewing a product
        setNavigationTrigger({
          type: 'product',
          data: previousState.product,
          timestamp: Date.now(),
        });
        updateHash(`#${previousState.tab}/${previousState.product.type}/${previousState.product.id}`);
      } else {
        // Viewing main view
        setNavigationTrigger({
          type: 'main',
          data: null,
          timestamp: Date.now(),
        });

        if (previousState.tab === TAB_TYPES.DISCOVER) {
          const sectionMap = {
            [variables.getMessage('modals.main.marketplace.all')]: 'all',
            [variables.getMessage('modals.main.marketplace.photo_packs')]: 'photo_packs',
            [variables.getMessage('modals.main.marketplace.quote_packs')]: 'quote_packs',
            [variables.getMessage('modals.main.marketplace.preset_settings')]: 'preset_settings',
            [variables.getMessage('modals.main.marketplace.collections')]: 'collections',
          };
          const sectionKey = sectionMap[previousState.section] || 'all';
          updateHash(`#${previousState.tab}/${sectionKey}`);
        } else if (previousState.tab === TAB_TYPES.LIBRARY) {
          updateHash(`#${previousState.tab}/added`);
        } else {
          updateHash(`#${previousState.tab}`);
        }
      }
    }
  };

  const handleForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = navigationHistory[newIndex];
      console.log('Going forward to:', nextState);

      setHistoryIndex(newIndex);

      // Set skip flag BEFORE changing any state
      setSkipNextHistoryAdd(1);

      // Change tab if different
      if (nextState.tab !== currentTab) {
        setCurrentTab(nextState.tab);
      }

      setCurrentSection(nextState.section);
      setProductView(nextState.product);

      // Trigger navigation in child components
      if (nextState.product) {
        setNavigationTrigger({
          type: 'product',
          data: nextState.product,
          timestamp: Date.now(),
        });
        updateHash(`#${nextState.tab}/${nextState.product.type}/${nextState.product.id}`);
      } else {
        setNavigationTrigger({
          type: 'main',
          data: null,
          timestamp: Date.now(),
        });

        if (nextState.tab === TAB_TYPES.DISCOVER) {
          const sectionMap = {
            [variables.getMessage('modals.main.marketplace.all')]: 'all',
            [variables.getMessage('modals.main.marketplace.photo_packs')]: 'photo_packs',
            [variables.getMessage('modals.main.marketplace.quote_packs')]: 'quote_packs',
            [variables.getMessage('modals.main.marketplace.preset_settings')]: 'preset_settings',
            [variables.getMessage('modals.main.marketplace.collections')]: 'collections',
          };
          const sectionKey = sectionMap[nextState.section] || 'all';
          updateHash(`#${nextState.tab}/${sectionKey}`);
        } else if (nextState.tab === TAB_TYPES.LIBRARY) {
          updateHash(`#${nextState.tab}/added`);
        } else {
          updateHash(`#${nextState.tab}`);
        }
      }
    }
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < navigationHistory.length - 1;

  const TabComponent = TAB_COMPONENTS[currentTab] || Settings;

  return (
    <div className="frame">
      <ModalTopBar
        currentTab={currentTab}
        currentSection={currentSection}
        productView={productView}
        onTabChange={handleChangeTab}
        onClose={modalClose}
        onBack={handleBack}
        onForward={handleForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />
      <Suspense fallback={<ModalLoader />}>
        <TabComponent
          changeTab={handleChangeTab}
          deepLinkData={deepLinkData}
          currentTab={currentTab}
          onSectionChange={handleSectionChange}
          onProductView={handleProductView}
          resetToAll={resetDiscoverToAll}
          onResetToAll={handleResetDiscoverToAll}
          navigationTrigger={navigationTrigger}
        />
      </Suspense>
    </div>
  );
}

export default memo(MainModal);
