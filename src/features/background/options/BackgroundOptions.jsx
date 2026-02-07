import variables from 'config/variables';
import { useT } from 'contexts';
import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { MdSource, MdOutlineAutoAwesome } from 'react-icons/md';
import { toast } from 'react-toastify';
import EventBus from 'utils/eventbus';
import { clearQueuesOnSettingChange } from 'utils/queueOperations';
import { uninstall } from 'utils/marketplace';

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
  const t = useT();
  const navigate = useNavigate();
  const [backgroundType, setBackgroundType] = useState(
    localStorage.getItem('backgroundType') || 'api',
  );
  const [backgroundFilter, setBackgroundFilter] = useState(
    localStorage.getItem('backgroundFilter') || 'none',
  );
  const [backgroundCategories, setBackgroundCategories] = useState(() => {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return [t('modals.update.offline.title')];
    }
    return [t('modals.main.loading')];
  });
  const [backgroundCategoriesOG, setBackgroundCategoriesOG] = useState([]);
  const [backgroundAPI, setBackgroundAPI] = useState(
    localStorage.getItem('backgroundAPI') || 'mue',
  );
  const [marketplaceEnabled] = useState(localStorage.getItem('photo_packs'));

  const getInstalledPhotoPacks = () => {
    try {
      const installed = JSON.parse(localStorage.getItem('installed')) || [];
      return installed.filter((item) => item.type === 'photos');
    } catch {
      return [];
    }
  };

  const [installedPhotoPacks, setInstalledPhotoPacks] = useState(getInstalledPhotoPacks());

  const shouldShowSourceByDefault = ['colour', 'random_colour', 'random_gradient'].includes(
    backgroundType,
  );

  const controllerRef = useRef(null);

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

  useEffect(() => {
    const handleInstalledAddonsChanged = () => {
      setInstalledPhotoPacks(getInstalledPhotoPacks());
      const currentType = localStorage.getItem('backgroundType') || 'api';
      if (currentType !== backgroundType) {
        setBackgroundType(currentType);
      }
    };

    window.addEventListener('installedAddonsChanged', handleInstalledAddonsChanged);
    return () => window.removeEventListener('installedAddonsChanged', handleInstalledAddonsChanged);
  }, [backgroundType]);

  const handlePhotoPackUninstall = (type, name) => {
    uninstall(type, name);
    toast(t('toasts.uninstalled'));
    variables.stats.postEvent('marketplace-item', `${name} uninstalled`);
    setInstalledPhotoPacks(getInstalledPhotoPacks());
    window.dispatchEvent(new window.Event('installedAddonsChanged'));
  };

  const goToPhotoPacks = () => {
    navigate('/discover/photo_packs');
  };

  const handleToggle = (pack) => {
    const itemId = pack.id || pack.name;
    navigate(`/discover/item/${itemId}`);

    variables.stats.postEvent('marketplace', 'ItemPage viewed');
  };

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
          title={t('modals.main.settings.sections.background.title')}
          secondaryTitle={t('modals.main.settings.sections.background.effects.title')}
          goBack={() => onSubSectionChange(null, sectionName)}
        />
      );
    }

    if (currentSubSection === 'source') {
      return (
        <Header
          title={t('modals.main.settings.sections.background.title')}
          secondaryTitle={t('modals.main.settings.sections.background.source.title')}
          goBack={() => onSubSectionChange(null, sectionName)}
        />
      );
    }

    return (
      <Header
        title={t('modals.main.settings.sections.background.title')}
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
            title={t('modals.main.settings.sections.background.source.title')}
            subtitle={t('modals.main.settings.sections.background.source.subtitle')}
            onClick={() => onSubSectionChange('source', sectionName)}
            action={
              <Dropdown
                label={t('modals.main.settings.sections.background.type.title')}
                name="backgroundType"
                onChange={(value) => {
                  clearQueuesOnSettingChange('backgroundType');
                  setBackgroundType(value);
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
              title={t('modals.main.settings.sections.background.effects.title')}
              subtitle={t('modals.main.settings.sections.background.effects.subtitle')}
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
