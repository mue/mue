import variables from 'config/variables';
import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { MdSource, MdOutlineAutoAwesome } from 'react-icons/md';

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

const BackgroundOptions = memo(() => {
  const [backgroundType, setBackgroundType] = useState(
    localStorage.getItem('backgroundType') || 'api',
  );
  const [backgroundFilter, setBackgroundFilter] = useState(
    localStorage.getItem('backgroundFilter') || 'none',
  );
  const [backgroundCategories, setBackgroundCategories] = useState([
    variables.getMessage('modals.main.loading'),
  ]);
  const [backgroundCategoriesOG, setBackgroundCategoriesOG] = useState([]);
  const [backgroundAPI, setBackgroundAPI] = useState(localStorage.getItem('backgroundAPI') || 'mue');
  const [marketplaceEnabled] = useState(localStorage.getItem('photo_packs'));
  const [effects, setEffects] = useState(false);
  const [backgroundSettingsSection, setBackgroundSettingsSection] = useState(false);
  
  const controllerRef = useRef(null);

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

  const updateAPI = useCallback((e) => {
    localStorage.setItem('nextImage', null);
    // Clear prefetch queue when API changes to prevent showing cached images from old API
    localStorage.removeItem('imageQueue');
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
  }, [backgroundCategories, backgroundCategoriesOG]);

  useEffect(() => {
    controllerRef.current = new AbortController();

    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      setBackgroundCategories([variables.getMessage('modals.update.offline.title')]);
      return;
    }

    getBackgroundCategories();

    return () => {
      // stop making requests
      controllerRef.current.abort();
    };
  }, [getBackgroundCategories]);

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
    if (effects) {
      return (
        <Header
          title={variables.getMessage('modals.main.settings.sections.background.title')}
          secondaryTitle={variables.getMessage(
            'modals.main.settings.sections.background.effects.title',
          )}
          goBack={() => setEffects(false)}
        />
      );
    }
    
    if (backgroundSettingsSection) {
      return (
        <Header
          title={variables.getMessage('modals.main.settings.sections.background.title')}
          secondaryTitle={variables.getMessage(
            'modals.main.settings.sections.background.source.title',
          )}
          goBack={() => setBackgroundSettingsSection(false)}
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
      
      {!backgroundSettingsSection && !effects && (
        <>
          <NavigationCard
            icon={MdSource}
            title={variables.getMessage('modals.main.settings.sections.background.source.title')}
            subtitle={variables.getMessage(
              'modals.main.settings.sections.background.source.subtitle',
            )}
            onClick={() => setBackgroundSettingsSection(true)}
            action={
              <Dropdown
                label={variables.getMessage('modals.main.settings.sections.background.type.title')}
                name="backgroundType"
                onChange={(value) => {
                  // Clear prefetch queue when changing background type
                  localStorage.removeItem('imageQueue');
                  setBackgroundType(value);
                }}
                category="background"
                items={getBackgroundOptionItems(marketplaceEnabled)}
              />
            }
          />
          
          {showEffects && (
            <NavigationCard
              icon={MdOutlineAutoAwesome}
              title={variables.getMessage(
                'modals.main.settings.sections.background.effects.title',
              )}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.background.effects.subtitle',
              )}
              onClick={() => setEffects(true)}
            />
          )}
        </>
      )}

      {!backgroundSettingsSection && !effects && showEffects && (
        <DisplaySettings usingImage={usingImage} />
      )}

      {backgroundSettingsSection && (
        <>
          <SourceSection
            backgroundType={backgroundType}
            marketplaceEnabled={marketplaceEnabled}
            onTypeChange={(value) => {
              // Clear prefetch queue when changing background type
              localStorage.removeItem('imageQueue');
              setBackgroundType(value);
            }}
          />
          {getBackgroundSettings()}
        </>
      )}

      {showEffects && effects && (
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
