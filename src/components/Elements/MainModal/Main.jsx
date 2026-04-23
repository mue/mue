import { Suspense, lazy, useState, memo, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useT } from 'contexts';

import './scss/index.scss';
import ModalLoader from './components/ModalLoader';
import ModalTopBar from './components/ModalTopBar';
import { TAB_TYPES } from './constants/tabConfig';
import { updateHash, parseDeepLink } from 'utils/deepLinking';
import { useRouterBridge } from '../../../router/RouterBridge';

const Settings = lazy(() => import('../../../features/misc/views/Settings'));
const Library = lazy(() => import('../../../features/misc/views/Library'));
const Discover = lazy(() => import('../../../features/misc/views/Discover'));

const TAB_COMPONENTS = {
  [TAB_TYPES.SETTINGS]: Settings,
  [TAB_TYPES.LIBRARY]: Library,
  [TAB_TYPES.DISCOVER]: Discover,
};

function MainModal({ modalClose, deepLinkData }) {
  const t = useT();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { deepLinkData: routerDeepLinkData } = useRouterBridge();

  // Use router-based deepLinkData if available, fallback to prop
  // Memoize to prevent infinite loops in useEffect
  const effectiveDeepLinkData = useMemo(
    () => routerDeepLinkData || deepLinkData,
    [location.pathname, deepLinkData],
  );

  // Derive currentTab from router location instead of state
  const currentTab = effectiveDeepLinkData?.tab || TAB_TYPES.SETTINGS;

  const [currentSection, setCurrentSection] = useState('');
  const [currentSectionName, setCurrentSectionName] = useState('');
  const [currentSubSection, setCurrentSubSection] = useState(
    effectiveDeepLinkData?.subSection || null,
  );
  const [productView, setProductView] = useState(null);
  const [resetDiscoverToAll, setResetDiscoverToAll] = useState(false);
  const [navigationTrigger, setNavigationTrigger] = useState(null);
  const [iframeBreadcrumbs, setIframeBreadcrumbs] = useState([]);

  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const updateNavButtons = () => {
    setCanGoBack(historyIndexRef.current > 0);
    setCanGoForward(historyIndexRef.current < historyRef.current.length - 1);
  };

  useEffect(() => {
    setProductView(null);
  }, [currentTab]);

  useEffect(() => {
    if (effectiveDeepLinkData) {
      if (effectiveDeepLinkData.tab === TAB_TYPES.SETTINGS && effectiveDeepLinkData.section) {
        setNavigationTrigger({
          type: 'settings-section',
          data: effectiveDeepLinkData.section,
          timestamp: Date.now(),
        });
        if (effectiveDeepLinkData.subSection) {
          setCurrentSubSection(effectiveDeepLinkData.subSection);
          if (historyIndexRef.current >= 0) {
            historyRef.current[historyIndexRef.current] = {
              ...historyRef.current[historyIndexRef.current],
              subSection: effectiveDeepLinkData.subSection,
            };
          }
        }
      }
    }
  }, [effectiveDeepLinkData]);

  useEffect(() => {
    return () => {
      if (window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname);
      }
    };
  }, []);

  // React to router location changes
  useEffect(() => {
    if (effectiveDeepLinkData) {
      if (effectiveDeepLinkData.tab === TAB_TYPES.SETTINGS && effectiveDeepLinkData.section) {
        setNavigationTrigger({
          type: 'settings-section',
          data: effectiveDeepLinkData.section,
          timestamp: Date.now(),
        });
        setCurrentSubSection(effectiveDeepLinkData.subSection || null);
        return;
      }

      if (
        effectiveDeepLinkData.itemId &&
        effectiveDeepLinkData.collection &&
        effectiveDeepLinkData.fromCollection
      ) {
        setNavigationTrigger({
          type: 'collection',
          data: effectiveDeepLinkData.collection,
          timestamp: Date.now(),
        });
        setTimeout(() => {
          setNavigationTrigger({
            type: 'product',
            data: {
              id: effectiveDeepLinkData.itemId,
              type: effectiveDeepLinkData.category,
            },
            timestamp: Date.now(),
          });
        }, 100);
      } else if (effectiveDeepLinkData.itemId) {
        setNavigationTrigger({
          type: 'product',
          data: {
            id: effectiveDeepLinkData.itemId,
            type: effectiveDeepLinkData.category,
          },
          timestamp: Date.now(),
        });
      } else if (effectiveDeepLinkData.collection) {
        setNavigationTrigger({
          type: 'collection',
          data: effectiveDeepLinkData.collection,
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
  }, [effectiveDeepLinkData, currentTab]);

  const handleChangeTab = (newTab) => {
    historyRef.current = [];
    historyIndexRef.current = -1;
    updateNavButtons();
    if (newTab === TAB_TYPES.DISCOVER) {
      const section = effectiveDeepLinkData?.category || effectiveDeepLinkData?.section || 'all';
      const itemId = effectiveDeepLinkData?.itemId ? `/${effectiveDeepLinkData.itemId}` : '';
      navigate(`/${newTab}/${section}${itemId}`);
    } else if (newTab === TAB_TYPES.LIBRARY) {
      navigate(`/${newTab}/added`);
    } else {
      navigate(`/${newTab}`);
    }
  };

  const handleSectionChange = (section, sectionName) => {
    setCurrentSection(section);
    setCurrentSectionName(sectionName);
    // Only reset subsection if we're actually changing to a different section
    // Don't reset on initial section set (when currentSectionName is empty)
    if (currentSectionName !== '' && currentSectionName !== sectionName) {
      setCurrentSubSection(null);
    }
    const entry = {
      section,
      sectionName,
      subSection:
        currentSectionName === '' || currentSectionName === sectionName ? currentSubSection : null,
    };
    const current = historyRef.current[historyIndexRef.current];
    if (
      !current ||
      current.sectionName !== sectionName ||
      current.subSection !== entry.subSection
    ) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1).concat(entry);
      historyIndexRef.current = historyRef.current.length - 1;
      updateNavButtons();
    }
    if (currentTab === TAB_TYPES.DISCOVER) {
      // Don't navigate away if we're viewing a specific item
      if (effectiveDeepLinkData?.itemId) {
        return;
      }
      const sectionMap = {
        [t('modals.main.marketplace.all')]: 'all',
        [t('modals.main.marketplace.photo_packs')]: 'photo_packs',
        [t('modals.main.marketplace.quote_packs')]: 'quote_packs',
        [t('modals.main.marketplace.preset_settings')]: 'preset_settings',
        [t('modals.main.marketplace.collections')]: 'collections',
      };
      const sectionKey = sectionMap[section];
      if (sectionKey) {
        navigate(`/${currentTab}/${sectionKey}`);
      }
    } else if (currentTab === TAB_TYPES.SETTINGS && sectionName) {
      // Include subsection in hash if it exists and we're not changing sections
      const path =
        currentSubSection && (currentSectionName === '' || currentSectionName === sectionName)
          ? `/${currentTab}/${sectionName}/${currentSubSection}`
          : `/${currentTab}/${sectionName}`;
      navigate(path, { replace: true });
    }
  };

  const handleSubSectionChange = (subSection, sectionName) => {
    setCurrentSubSection(subSection);
    const effectiveSectionName = sectionName || currentSectionName;
    const entry = { section: currentSection, sectionName: effectiveSectionName, subSection };
    const current = historyRef.current[historyIndexRef.current];
    if (
      !current ||
      current.sectionName !== effectiveSectionName ||
      current.subSection !== subSection
    ) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1).concat(entry);
      historyIndexRef.current = historyRef.current.length - 1;
      updateNavButtons();
    }
    if (currentTab === TAB_TYPES.SETTINGS && sectionName) {
      if (subSection) {
        navigate(`/${currentTab}/${sectionName}/${subSection}`);
      } else {
        navigate(`/${currentTab}/${sectionName}`);
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

  const restoreHistoryEntry = (entry) => {
    setCurrentSubSection(entry.subSection);
    if (entry.sectionName !== currentSectionName) {
      setCurrentSection(entry.section);
      setCurrentSectionName(entry.sectionName);
      setNavigationTrigger({
        type: 'settings-section',
        data: entry.sectionName,
        timestamp: Date.now(),
      });
    }
    if (currentTab === TAB_TYPES.SETTINGS) {
      const hash = entry.subSection
        ? `#${currentTab}/${entry.sectionName}/${entry.subSection}`
        : `#${currentTab}/${entry.sectionName}`;
      window.history.replaceState(null, null, hash);
    }
  };

  const handleBack = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    updateNavButtons();
    restoreHistoryEntry(historyRef.current[historyIndexRef.current]);
  };

  const handleForward = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    updateNavButtons();
    restoreHistoryEntry(historyRef.current[historyIndexRef.current]);
  };

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
            deepLinkData={effectiveDeepLinkData}
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
