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

const TAB_COMPONENTS = {
  [TAB_TYPES.SETTINGS]: Settings,
  [TAB_TYPES.LIBRARY]: Library,
  [TAB_TYPES.DISCOVER]: Discover,
};

function MainModal({ modalClose, deepLinkData }) {
  const initialTab = deepLinkData?.tab || TAB_TYPES.SETTINGS;
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [currentSection, setCurrentSection] = useState('');
  const [currentSectionName, setCurrentSectionName] = useState('');
  const [currentSubSection, setCurrentSubSection] = useState(deepLinkData?.subSection || null);
  const [productView, setProductView] = useState(null);
  const [resetDiscoverToAll, setResetDiscoverToAll] = useState(false);
  const [navigationTrigger, setNavigationTrigger] = useState(null);
  const [iframeBreadcrumbs, setIframeBreadcrumbs] = useState([]);

  useEffect(() => {
    setProductView(null);
  }, [currentTab]);

  useEffect(() => {
    if (deepLinkData) {
      if (deepLinkData.tab && deepLinkData.tab !== currentTab) {
        setCurrentTab(deepLinkData.tab);
      }

      if (deepLinkData.tab === TAB_TYPES.SETTINGS && deepLinkData.section) {
        setNavigationTrigger({
          type: 'settings-section',
          data: deepLinkData.section,
          timestamp: Date.now(),
        });
        if (deepLinkData.subSection) {
          setCurrentSubSection(deepLinkData.subSection);
        }
      }
    }
  }, [deepLinkData]);

  useEffect(() => {
    return () => {
      if (window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname);
      }
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const linkData = window.location.hash ? parseDeepLink(window.location.hash) : null;

      if (linkData) {
        if (linkData.tab && linkData.tab !== currentTab) {
          setCurrentTab(linkData.tab);
        }

        if (linkData.tab === TAB_TYPES.SETTINGS && linkData.section) {
          setNavigationTrigger({
            type: 'settings-section',
            data: linkData.section,
            timestamp: Date.now(),
          });
          setCurrentSubSection(linkData.subSection || null);
          return;
        }

        if (linkData.itemId && linkData.collection && linkData.fromCollection) {
          setNavigationTrigger({
            type: 'collection',
            data: linkData.collection,
            timestamp: Date.now(),
          });
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
          setNavigationTrigger({
            type: 'product',
            data: {
              id: linkData.itemId,
              type: linkData.category,
            },
            timestamp: Date.now(),
          });
        } else if (linkData.collection) {
          setNavigationTrigger({
            type: 'collection',
            data: linkData.collection,
            timestamp: Date.now(),
          });
        } else {
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
    if (newTab === TAB_TYPES.DISCOVER) {
      updateHash(`#${newTab}/all`);
    } else if (newTab === TAB_TYPES.LIBRARY) {
      updateHash(`#${newTab}/added`);
    } else {
      updateHash(`#${newTab}`);
    }
  };

  const handleSectionChange = (section, sectionName) => {
    setCurrentSection(section);
    setCurrentSectionName(sectionName);
    setCurrentSubSection(null);
    if (currentTab === TAB_TYPES.DISCOVER) {
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
    } else if (currentTab === TAB_TYPES.SETTINGS && sectionName) {
      updateHash(`#${currentTab}/${sectionName}`, false);
    }
  };

  const handleSubSectionChange = (subSection, sectionName) => {
    setCurrentSubSection(subSection);
    if (currentTab === TAB_TYPES.SETTINGS && sectionName) {
      if (subSection) {
        updateHash(`#${currentTab}/${sectionName}/${subSection}`);
      } else {
        updateHash(`#${currentTab}/${sectionName}`);
      }
    }
  };

  const handleProductView = (product) => {
    setProductView(product);
  };

  const handleResetDiscoverToAll = () => {
    setResetDiscoverToAll(true);
    setTimeout(() => setResetDiscoverToAll(false), 100);
  };

  const handleBack = () => {
    setIframeBreadcrumbs([]);
    window.history.back();
  };

  const handleForward = () => {
    window.history.forward();
  };

  const canGoBack = true;
  const canGoForward = true;

  const TabComponent = TAB_COMPONENTS[currentTab] || Settings;

  return (
    <div className="frame">
      <ModalTopBar
        currentTab={currentTab}
        currentSection={currentSection}
        currentSectionName={currentSectionName}
        currentSubSection={currentSubSection}
        productView={productView}
        iframeBreadcrumbs={iframeBreadcrumbs}
        onTabChange={handleChangeTab}
        onSubSectionChange={handleSubSectionChange}
        onClose={modalClose}
        onBack={handleBack}
        onForward={handleForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <Suspense fallback={<ModalLoader currentTab={currentTab} />}>
          <TabComponent
            key={currentTab}
            changeTab={handleChangeTab}
            deepLinkData={deepLinkData}
            currentTab={currentTab}
            onSectionChange={handleSectionChange}
            onSubSectionChange={handleSubSectionChange}
            currentSubSection={currentSubSection}
            onProductView={handleProductView}
            onBreadcrumbsChange={setIframeBreadcrumbs}
            resetToAll={resetDiscoverToAll}
            onResetToAll={handleResetDiscoverToAll}
            navigationTrigger={navigationTrigger}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default memo(MainModal);
