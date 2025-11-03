import variables from 'config/variables';
import { useState, useEffect } from 'react';
import { MdWifiOff, MdLocalMall } from 'react-icons/md';

import ItemPage from './ItemPage';
import CollectionPage from './CollectionPage';
import BrowsePage from './BrowsePage';
import InstallButton from '../components/Elements/InstallButton';

import { useMarketplaceData } from '../hooks/useMarketplaceData';
import { useMarketplaceNavigation } from '../hooks/useMarketplaceNavigation';
import { useMarketplaceInstall } from '../hooks/useMarketplaceInstall';
import { MarketplaceContext } from '../contexts/MarketplaceContext';

const Marketplace = ({ type, onProductView, onResetToAll, deepLinkData, navigationTrigger }) => {
  const [filter, setFilter] = useState('');

  // Custom hooks for data, navigation, and installation
  const { items, displayedCollection, loading, changeSort } = useMarketplaceData(type, deepLinkData);
  const {
    currentView,
    currentItem,
    currentCollection,
    relatedItems,
    navigateToItem,
    navigateToCollection,
    navigateBack,
    navigateToMain,
  } = useMarketplaceNavigation(onProductView, onResetToAll);
  const { busy, installItem, uninstallItem, installCollection } = useMarketplaceInstall();

  const handleManage = (action) => {
    if (!currentItem) return;

    if (action === 'install') {
      installItem(currentItem.type, currentItem.data);
    } else {
      uninstallItem(currentItem.type, currentItem.display_name);
    }
  };

  // Install/uninstall buttons
  const buttons = {
    uninstall: (
      <InstallButton
        onClick={() => handleManage('uninstall')}
        isInstalled={true}
        label={variables.getMessage('modals.main.marketplace.product.buttons.remove')}
      />
    ),
    install: (
      <InstallButton
        onClick={() => handleManage('install')}
        isInstalled={false}
        label={variables.getMessage('modals.main.marketplace.product.buttons.addtomue')}
      />
    ),
  };

  // Get appropriate button based on installation status
  const getButton = () => {
    if (!currentItem) return buttons.install;
    return currentItem.addonInstalled ? buttons.uninstall : buttons.install;
  };

  // Handle deep linking on mount
  useEffect(() => {
    if (deepLinkData) {
      const { itemId, collection, category } = deepLinkData;

      setTimeout(() => {
        if (collection) {
          navigateToCollection(collection);
        } else if (itemId) {
          navigateToItem({ id: itemId, type: category }, type);
        }
      }, 500);
    }
  }, [deepLinkData, navigateToCollection, navigateToItem, type]);

  // Handle navigation trigger changes
  useEffect(() => {
    if (navigationTrigger) {
      const { type: navType, data } = navigationTrigger;

      if (navType === 'product' && data) {
        navigateToItem({ id: data.id, type: data.type }, type);
      } else if (navType === 'collection' && data) {
        navigateToCollection(data);
      } else if (navType === 'main' || navType === 'section') {
        const clearCollection = data?.clearCollection && currentCollection;
        navigateToMain(clearCollection);
      }
    }
  }, [navigationTrigger, navigateToItem, navigateToCollection, navigateToMain, currentCollection, type]);

  // Context value to share with child components
  const contextValue = {
    currentView,
    currentItem,
    currentCollection,
    items,
    navigateToItem: (data) => navigateToItem(data, type),
    navigateToCollection,
    navigateBack,
    navigateToMain,
    installItem,
    uninstallItem,
  };

  // Error message component
  const renderError = (content) => (
    <>
      <div className="flexTopMarketplace">
        <span className="mainTitle">{variables.getMessage('modals.main.navbar.marketplace')}</span>
      </div>
      <div className="emptyItems">
        <div className="emptyMessage">{content}</div>
      </div>
    </>
  );

  // Offline check
  if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
    return renderError(
      <>
        <MdWifiOff />
        <span className="title">
          {variables.getMessage('modals.main.marketplace.offline.title')}
        </span>
        <span className="subtitle">
          {variables.getMessage('modals.main.marketplace.offline.description')}
        </span>
      </>,
    );
  }

  // Loading state
  if (loading) {
    return renderError(
      <div className="loaderHolder">
        <div id="loader"></div>
        <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
      </div>,
    );
  }

  // Empty state
  if (!items || items.length === 0) {
    return renderError(
      <>
        <MdLocalMall />
        <span className="title">{variables.getMessage('modals.main.addons.empty.title')}</span>
        <span className="subtitle">
          {variables.getMessage('modals.main.marketplace.no_items')}
        </span>
      </>,
    );
  }

  // Render item view
  if (currentView === 'item' && currentItem) {
    return (
      <MarketplaceContext.Provider value={contextValue}>
        <ItemPage
          data={currentItem}
          button={getButton()}
          toggleFunction={(pageType, data) => {
            if (pageType === 'collection') {
              navigateToCollection(data);
            } else if (pageType === 'main') {
              navigateBack();
            } else {
              navigateToItem(data, type);
            }
          }}
          addonInstalled={currentItem.addonInstalled}
          addonInstalledVersion={currentItem.addonInstalledVersion}
          icon={currentItem.icon}
          relatedItems={relatedItems}
        />
      </MarketplaceContext.Provider>
    );
  }

  // Render collection view
  if (currentView === 'collection' && currentCollection) {
    return (
      <MarketplaceContext.Provider value={contextValue}>
        <CollectionPage
          collectionName={currentCollection.name}
          collectionTitle={currentCollection.title}
          collectionDescription={currentCollection.description}
          collectionImg={currentCollection.img}
          items={currentCollection.items}
          busy={busy}
          onInstallCollection={() => installCollection(currentCollection.items)}
          onItemClick={(item) => navigateToItem(item, type)}
          onSortChange={changeSort}
        />
      </MarketplaceContext.Provider>
    );
  }

  // Render browse view
  return (
    <MarketplaceContext.Provider value={contextValue}>
      <BrowsePage
        type={type}
        items={items}
        featuredCollection={displayedCollection}
        filter={filter}
        onFilterChange={(event) => setFilter(event.target.value)}
        onItemClick={(item) => navigateToItem(item, type)}
        onCollectionClick={navigateToCollection}
        onSortChange={changeSort}
      />
    </MarketplaceContext.Provider>
  );
};

export default Marketplace;
