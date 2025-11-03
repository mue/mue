import { useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import variables from 'config/variables';
import { urlParser } from 'utils/marketplace';
import { updateHash } from 'utils/deepLinking';

const API_V2_BASE = `${variables.constants.API_URL}/marketplace`;

export const useMarketplaceNavigation = (onProductView, onResetToAll) => {
  const [currentView, setCurrentView] = useState('browse'); // 'browse', 'collection', 'item'
  const [currentItem, setCurrentItem] = useState(null);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const controllerRef = useRef(new AbortController());

  const navigateToItem = useCallback(
    async (data, type) => {
      try {
        let itemType = type;
        if (type === 'all' || type === 'collections') {
          itemType = data.type;
        }

        // Fetch item details
        const itemEndpoint = data.id
          ? `${API_V2_BASE}/item/${data.id}`
          : `${API_V2_BASE}/item/${itemType}/${data.name}`;

        const response = await fetch(itemEndpoint, {
          signal: controllerRef.current.signal,
        });
        const info = await response.json();

        if (!info || !info.data) {
          throw new Error('Invalid item data received');
        }

        // Fetch related items
        let related = [];
        if (info.data?.id) {
          try {
            const relatedResponse = await fetch(`${API_V2_BASE}/item/${info.data.id}/related`, {
              signal: controllerRef.current.signal,
            });
            const relatedData = await relatedResponse.json();
            related = relatedData.data?.related || [];
          } catch (error) {
            console.warn('Failed to fetch related items:', error);
          }

          // Track view
          fetch(`${API_V2_BASE}/item/${info.data.id}/view`, {
            method: 'POST',
            signal: controllerRef.current.signal,
          }).catch(() => {});
        }

        // Check if installed
        const installed = JSON.parse(localStorage.getItem('installed')) || [];
        const isInstalled = installed.some((item) => item.name === info.data.name);
        const installedVersion = installed.find((item) => item.name === info.data.name)?.version;

        const itemData = {
          id: info.data.id,
          onCollection: data._onCollection,
          type: info.data.type,
          display_name: info.data.name || info.data.display_name,
          author: info.data.author,
          description: urlParser(info.data.description.replace(/\n/g, '<br>')),
          version: info.data.version,
          icon: info.data.screenshot_url,
          data: info.data,
          addonInstalled: isInstalled,
          addonInstalledVersion: installedVersion,
          api_name: data.name,
        };

        setCurrentItem(itemData);
        setRelatedItems(related);
        setCurrentView('item');

        // Update hash
        if (info.data?.id) {
          if (currentCollection?.name) {
            updateHash(`#discover/collection/${currentCollection.name}/${info.data.id}`);
          } else {
            updateHash(`#discover/${info.data.type}/${info.data.id}`);
          }
        }

        // Notify parent
        if (onProductView) {
          onProductView({
            id: info.data.id,
            type: info.data.type,
            name: info.data.display_name || info.data.name,
            fromCollection: !!currentCollection,
            collectionName: currentCollection?.name,
            collectionTitle: currentCollection?.title,
            collectionDescription: currentCollection?.description,
            collectionImg: currentCollection?.img,
            onBack: () => navigateBack(),
            onBackToAll: () => navigateToMain(true),
          });
        }

        document.querySelector('#modal')?.scrollTo(0, 0);
        variables.stats.postEvent('marketplace-item', `${itemData.display_name} viewed`);
      } catch (error) {
        if (!controllerRef.current.signal.aborted) {
          console.error('Failed to fetch item:', error);
          toast(variables.getMessage('toasts.error'));
        }
      }
    },
    [currentCollection, onProductView],
  );

  const navigateToCollection = useCallback(
    async (collectionName) => {
      try {
        const response = await fetch(`${API_V2_BASE}/collection/${collectionName}`, {
          signal: controllerRef.current.signal,
        });
        const collection = await response.json();

        if (controllerRef.current.signal.aborted) return;

        const collectionData = {
          name: collectionName,
          title: collection.data.display_name,
          description: collection.data.description,
          img: collection.data.img,
          items: collection.data.items,
        };

        setCurrentCollection(collectionData);
        setCurrentView('collection');
        setCurrentItem(null);
        setRelatedItems([]);

        // Update hash
        updateHash(`#discover/collection/${collectionName}`);

        // Notify parent
        if (onProductView) {
          onProductView({
            id: collectionName,
            type: 'collection',
            name: collection.data.display_name,
            isCollection: true,
            fromCollection: false,
            collectionName: collectionName,
            collectionTitle: collection.data.display_name,
            onBack: () => navigateToMain(false),
            onBackToAll: () => navigateToMain(true),
          });
        }
      } catch (error) {
        if (!controllerRef.current.signal.aborted) {
          console.error('Failed to fetch collection:', error);
          toast(variables.getMessage('toasts.error'));
        }
      }
    },
    [onProductView],
  );

  const navigateBack = useCallback(() => {
    if (currentView === 'item' && currentCollection) {
      // Go back to collection
      setCurrentView('collection');
      setCurrentItem(null);
      setRelatedItems([]);
      updateHash(`#discover/collection/${currentCollection.name}`);
    } else {
      // Go back to browse
      navigateToMain(false);
    }

    if (onProductView) {
      onProductView(null);
    }
  }, [currentView, currentCollection, onProductView]);

  const navigateToMain = useCallback(
    (clearCollection) => {
      if (clearCollection) {
        setCurrentCollection(null);
      }
      setCurrentView('browse');
      setCurrentItem(null);
      setRelatedItems([]);

      // Update hash based on collection state
      if (!clearCollection && currentCollection) {
        updateHash(`#discover/collection/${currentCollection.name}`);
      } else {
        updateHash('#discover/all');
      }

      if (onProductView) {
        onProductView(null);
      }

      if (clearCollection && onResetToAll) {
        onResetToAll();
      }
    },
    [currentCollection, onProductView, onResetToAll],
  );

  return {
    currentView,
    currentItem,
    currentCollection,
    relatedItems,
    navigateToItem,
    navigateToCollection,
    navigateBack,
    navigateToMain,
  };
};
