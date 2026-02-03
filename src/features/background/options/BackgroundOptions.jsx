import variables from 'config/variables';
import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { MdSource, MdOutlineAutoAwesome } from 'react-icons/md';
import { toast } from 'react-toastify';
import EventBus from 'utils/eventbus';
import { clearQueuesOnSettingChange } from 'utils/queueOperations';
import { uninstall } from 'utils/marketplace';
import { updateHash } from 'utils/deepLinking';

import { Header } from 'components/Layout/Settings';
import { Dropdown } from 'components/Form/Settings';

import ColourSettings from './Colour';
import CustomSettings from './Custom';
import APISettings from './sections/APISettings';
import DisplaySettings from './sections/DisplaySettings';
import EffectsSettings from './sections/EffectsSettings';
import SourceSection from './sections/SourceSection';
import NavigationCard from './sections/NavigationCard';

import { getBackgroundOptionItems } from './optionTypes';

const BackgroundOptions = memo(({ currentSubSection, onSubSectionChange, sectionName }) => {
  const [backgroundType, setBackgroundType] = useState(
    localStorage.getItem('backgroundType') || 'api',
  );
  const [backgroundFilter, setBackgroundFilter] = useState(
    localStorage.getItem('backgroundFilter') || 'none',
  );
  const [backgroundCategories, setBackgroundCategories] = useState(() => {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return [variables.getMessage('modals.update.offline.title')];
    }
    return [variables.getMessage('modals.main.loading')];
  });
  const [backgroundCategoriesOG, setBackgroundCategoriesOG] = useState([]);
  const [backgroundAPI, setBackgroundAPI] = useState(
    localStorage.getItem('backgroundAPI') || 'mue',
  );
  const [marketplaceEnabled] = useState(localStorage.getItem('photo_packs'));

  // Helper function to get installed photo packs
  const getInstalledPhotoPacks = () => {
    try {
      const installed = JSON.parse(localStorage.getItem('installed')) || [];
      return installed.filter((item) => item.type === 'photos');
    } catch {
      return [];
    }
  };

  const [installedPhotoPacks, setInstalledPhotoPacks] = useState(getInstalledPhotoPacks());

  // Auto-show source section for types without effects/display settings
  const shouldShowSourceByDefault = ['colour', 'random_colour', 'random_gradient'].includes(
    backgroundType,
  );

  const controllerRef = useRef(null);

  // Auto-navigate to source section when switching to colour/random types
  useEffect(() => {
    if (shouldShowSourceByDefault && currentSubSection !== 'source') {
      onSubSectionChange('source', sectionName);
    }
  }, [shouldShowSourceByDefault, currentSubSection, onSubSectionChange, sectionName]);

  const getBackgroundCategories = useCallback(async () => {
    const data = await (
      await fetch(variables.constants.API_URL + '/images/categories', {
        signal: controllerRef.current.signal,
      })
    ).json();

    if (controllerRef.current.signal.aborted === true) {
      return;
    }

    if (backgroundAPI !== 'mue') {
      // remove counts from unsplash categories
      data.forEach((category) => {
        delete category.count;
      });
    }

    setBackgroundCategories(data);
    setBackgroundCategoriesOG(data);
  }, [backgroundAPI]);

  const updateAPI = useCallback(
    (e) => {
      localStorage.setItem('nextImage', null);
      // Clear prefetch queue when API changes to prevent showing cached images from old API
      clearQueuesOnSettingChange('backgroundAPI');
      if (e === 'mue') {
        setBackgroundCategories(backgroundCategoriesOG);
        setBackgroundAPI('mue');
      } else {
        const data = [...backgroundCategories];
        data.forEach((category) => {
          delete category.count;
        });

        setBackgroundAPI('unsplash');
        setBackgroundCategories(data);
      }
    },
    [backgroundCategories, backgroundCategoriesOG],
  );

  useEffect(() => {
    controllerRef.current = new AbortController();

    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return;
    }

    getBackgroundCategories();

    return () => {
      // stop making requests
      controllerRef.current.abort();
    };
  }, [getBackgroundCategories]);

  // Listen for installed addons changes
  useEffect(() => {
    const handleInstalledAddonsChanged = () => {
      setInstalledPhotoPacks(getInstalledPhotoPacks());
      // Update backgroundType if it changed (e.g., when all packs are uninstalled)
      const currentType = localStorage.getItem('backgroundType') || 'api';
      if (currentType !== backgroundType) {
        setBackgroundType(currentType);
      }
    };

    window.addEventListener('installedAddonsChanged', handleInstalledAddonsChanged);
    return () => window.removeEventListener('installedAddonsChanged', handleInstalledAddonsChanged);
  }, [backgroundType]);

  // Handle photo pack uninstall
  const handlePhotoPackUninstall = (type, name) => {
    uninstall(type, name);
    toast(variables.getMessage('toasts.uninstalled'));
    variables.stats.postEvent('marketplace-item', `${name} uninstalled`);
    setInstalledPhotoPacks(getInstalledPhotoPacks());
    window.dispatchEvent(new window.Event('installedAddonsChanged'));
  };

  // Navigate to photo packs marketplace
  const goToPhotoPacks = () => {
    variables.updateHash('#discover/photo_packs');
    const event = new window.Event('popstate');
    window.dispatchEvent(event);
  };

  const handleToggle = (pack) => {
    // Navigate to discover tab with the item
    const itemId = pack.name;
    updateHash(`#discover/all?item=${itemId}`);

    // Trigger navigation
    const event = new window.Event('popstate');
    window.dispatchEvent(event);

    variables.stats.postEvent('marketplace', 'ItemPage viewed');
  };

  // Get total count of photos across all installed packs
  const getTotalPhotoCount = () => {
    return installedPhotoPacks.reduce((total, pack) => {
      return total + (pack.photos?.length || 0);
    }, 0);
  };

  const getBackgroundSettings = () => {
    switch (backgroundType) {
      case 'custom':
        return <CustomSettings />;
      case 'colour':
        return <ColourSettings />;
      case 'random_colour':
      case 'random_gradient':
        return null;
      default:
        break;
    }

    if (
      localStorage.getItem('photo_packs') &&
      backgroundType !== 'custom' &&
      backgroundType !== 'colour' &&
      backgroundType !== 'api'
    ) {
      return null;
    }

    return (
      <APISettings
        backgroundAPI={backgroundAPI}
        backgroundCategories={backgroundCategories}
        onUpdateAPI={updateAPI}
      />
    );
  };

  const usingImage =
    backgroundType !== 'colour' &&
    backgroundType !== 'random_colour' &&
    backgroundType !== 'random_gradient';

  const showEffects = backgroundType === 'api' || backgroundType === 'custom' || marketplaceEnabled;

  const getHeader = () => {
    if (currentSubSection === 'effects') {
      return (
        <Header
          title={variables.getMessage('modals.main.settings.sections.background.title')}
          secondaryTitle={variables.getMessage(
            'modals.main.settings.sections.background.effects.title',
          )}
          goBack={() => onSubSectionChange(null, sectionName)}
        />
      );
    }

    if (currentSubSection === 'source') {
      return (
        <Header
          title={variables.getMessage('modals.main.settings.sections.background.title')}
          secondaryTitle={variables.getMessage(
            'modals.main.settings.sections.background.source.title',
          )}
          goBack={() => onSubSectionChange(null, sectionName)}
        />
      );
    }

    return (
      <Header
        title={variables.getMessage('modals.main.settings.sections.background.title')}
        setting="background"
        category="background"
        element="#backgroundImage"
      />
    );
  };

  return (
    <>
      {getHeader()}

      {!currentSubSection && (
        <>
          <NavigationCard
            icon={MdSource}
            title={variables.getMessage('modals.main.settings.sections.background.source.title')}
            subtitle={variables.getMessage(
              'modals.main.settings.sections.background.source.subtitle',
            )}
            onClick={() => onSubSectionChange('source', sectionName)}
            action={
              <Dropdown
                label={variables.getMessage('modals.main.settings.sections.background.type.title')}
                name="backgroundType"
                onChange={(value) => {
                  // Clear prefetch queue when changing background type
                  clearQueuesOnSettingChange('backgroundType');
                  setBackgroundType(value);
                  // Automatically refresh background when switching to custom images
                  if (value === 'custom') {
                    EventBus.emit('refresh', 'background');
                  }
                }}
                category="background"
                items={getBackgroundOptionItems(marketplaceEnabled)}
              />
            }
          />

          {showEffects && (
            <NavigationCard
              icon={MdOutlineAutoAwesome}
              title={variables.getMessage('modals.main.settings.sections.background.effects.title')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.background.effects.subtitle',
              )}
              onClick={() => onSubSectionChange('effects', sectionName)}
            />
          )}
        </>
      )}

      {!currentSubSection && showEffects && <DisplaySettings usingImage={usingImage} />}

      {currentSubSection === 'source' && (
        <>
          <SourceSection
            backgroundType={backgroundType}
            marketplaceEnabled={marketplaceEnabled}
            installedPhotoPacks={installedPhotoPacks}
            totalPhotoCount={getTotalPhotoCount()}
            onTypeChange={(value) => {
              // Clear prefetch queue when changing background type
              clearQueuesOnSettingChange('backgroundType');
              setBackgroundType(value);
            }}
            onPhotoPackUninstall={handlePhotoPackUninstall}
            onGoToPhotoPacks={goToPhotoPacks}
            onToggle={handleToggle}
          />
          {getBackgroundSettings()}
        </>
      )}

      {showEffects && currentSubSection === 'effects' && (
        <EffectsSettings
          backgroundFilter={backgroundFilter}
          onFilterChange={(value) => setBackgroundFilter(value)}
        />
      )}
    </>
  );
});

BackgroundOptions.displayName = 'BackgroundOptions';

export { BackgroundOptions as default, BackgroundOptions };
