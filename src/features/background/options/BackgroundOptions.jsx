/* eslint-disable react-hooks/exhaustive-deps */
import variables from 'config/variables';
import { useState, useEffect } from 'react';
import { MdSource, MdOutlineKeyboardArrowRight, MdOutlineAutoAwesome } from 'react-icons/md';

import { Header, PreferencesWrapper, Section } from 'components/Layout/Settings';
import { Checkbox, Dropdown, Slider, Radio, Text, ChipSelect } from 'components/Form/Settings';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
//import Text from 'components/Form/Settings/Text/Text';

import ColourSettings from './Colour';
import CustomSettings from './Custom';

import values from 'utils/data/slider_values.json';
import { APIQualityOptions, backgroundImageEffects, getBackgroundOptionItems } from './optionTypes';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';

import defaults from './default';

function BackgroundOptions() {
  const { subSection } = useTab();

  const [backgroundType, setBackgroundType] = useState(
    localStorage.getItem('backgroundType') || defaults.backgroundType,
  );
  const [backgroundFilter, setBackgroundFilter] = useState(
    localStorage.getItem('backgroundFilter') || 'none',
  );
  const [backgroundCategories, setBackgroundCategories] = useState([
    variables.getMessage('modals.main.loading'),
  ]);
  const [backgroundAPI, setBackgroundAPI] = useState(
    localStorage.getItem('backgroundAPI') || defaults.backgroundAPI,
  );
  const [marketplaceEnabled, setMarketplaceEnabled] = useState(localStorage.getItem('photo_packs'));
  const [effects, setEffects] = useState(false);
  const [backgroundSettingsSection, setBackgroundSettingsSection] = useState(false);

  const controller = new AbortController();
  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  async function getBackgroundCategories() {
    const data = await (
      await fetch(variables.constants.API_URL + '/images/categories', {
        signal: controller.signal,
      })
    ).json();

    if (controller.signal.aborted === true) {
      return;
    }

    if (backgroundAPI !== 'mue') {
      // remove counts from unsplash categories
      data.forEach((category) => {
        delete category.count;
      });
    }

    setBackgroundCategories(data);
  }

  function updateAPI(e) {
    localStorage.setItem('nextImage', null);
    if (e === 'mue') {
      setBackgroundCategories(backgroundCategories);
      setBackgroundAPI('mue');
    } else {
      const data = backgroundCategories;
      data.forEach((category) => {
        delete category.count;
      });

      setBackgroundAPI('unsplash');
      setBackgroundCategories(data);
    }
  }

  useEffect(() => {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      setBackgroundCategories([variables.getMessage('modals.update.offline.title')]);
      return;
    }

    getBackgroundCategories();

    return () => {
      controller.abort();
    };
  }, []);

  const APISettings = (
    <>
      <Row final={backgroundAPI === 'mue'}>
        <Content
          title={variables.getMessage('settings:sections.background.api')}
          subtitle={variables.getMessage('settings:sections.background.api_subtitle')}
        />
        <Action>
          {backgroundCategories[0] === variables.getMessage('modals.main.loading') ? (
            <>
              <Dropdown
                label={variables.getMessage('settings:sections.background.category')}
                name="apiCategories"
                items={[
                  {
                    value: 'loading',
                    text: variables.getMessage('modals.main.loading'),
                  },
                  {
                    value: 'loading',
                    text: variables.getMessage('modals.main.loading'),
                  },
                ]}
              />
            </>
          ) : (
            <ChipSelect
              label={variables.getMessage('settings:sections.background.categories')}
              options={backgroundCategories}
              name="apiCategories"
            />
          )}
          <Dropdown
            label={variables.getMessage('settings:sections.background.source.quality.title')}
            name="apiQuality"
            element=".other"
            items={APIQualityOptions}
          />
          <Radio
            title="API"
            options={[
              {
                name: 'Mue',
                value: 'mue',
              },
              {
                name: 'Unsplash',
                value: 'unsplash',
              },
            ]}
            name="backgroundAPI"
            category="background"
            element="#backgroundImage"
            onChange={(e) => updateAPI(e)}
          />
        </Action>
      </Row>
      {backgroundAPI === 'unsplash' && (
        <Row final={true}>
          <Content
            title={variables.getMessage('settings:sections.background.unsplash.title')}
            subtitle={variables.getMessage('settings:sections.background.unsplash.subtitle')}
          />
          <Action>
            <Text
              title={variables.getMessage('settings:sections.background.unsplash.id')}
              subtitle={variables.getMessage('settings:sections.background.unsplash.id_subtitle')}
              placeholder="e.g. 123456, 654321"
              name="unsplashCollections"
              category="background"
              element="#backgroundImage"
            />
          </Action>
        </Row>
      )}
    </>
  );

  const EffectsOptions = () => (
    <PreferencesWrapper>
      <Row final={true}>
        <Content
          title={variables.getMessage('settings:sections.background.effects.title')}
          subtitle={variables.getMessage('settings:sections.background.effects.subtitle')}
        />
        <Action>
          <Slider
            title={variables.getMessage('settings:sections.background.effects.blur')}
            name="blur"
            min="0"
            max="100"
            default="0"
            display="%"
            marks={values.background}
            category="backgroundeffect"
            element="#backgroundImage"
          />
          <Slider
            title={variables.getMessage('settings:sections.background.effects.brightness')}
            name="brightness"
            min="0"
            max="100"
            default="90"
            display="%"
            marks={values.background}
            category="backgroundeffect"
            element="#backgroundImage"
          />
          <Dropdown
            label={variables.getMessage('settings:sections.background.effects.filters.title')}
            name="backgroundFilter"
            onChange={(value) => setBackgroundFilter(value)}
            category="backgroundeffect"
            element="#backgroundImage"
            items={backgroundImageEffects}
          />
          {backgroundFilter !== 'none' && (
            <Slider
              title={variables.getMessage('settings:sections.background.effects.filters.amount')}
              name="backgroundFilterAmount"
              min="0"
              max="100"
              default="0"
              display="%"
              marks={values.background}
              category="backgroundeffect"
              element="#backgroundImage"
            />
          )}
        </Action>
      </Row>
    </PreferencesWrapper>
  );

  let backgroundSettings = APISettings;
  switch (backgroundType) {
    case 'custom':
      backgroundSettings = <CustomSettings />;
      break;
    case 'colour':
      backgroundSettings = <ColourSettings />;
      break;
    case 'random_colour':
    case 'random_gradient':
      backgroundSettings = <></>;
      break;
    default:
      break;
  }

  if (
    localStorage.getItem('photo_packs') &&
    backgroundType !== 'custom' &&
    backgroundType !== 'colour' &&
    backgroundType !== 'api'
  ) {
    backgroundSettings = null;
  }

  const usingImage =
    backgroundType !== 'colour' &&
    backgroundType !== 'random_colour' &&
    backgroundType !== 'random_gradient';

  let header;
  if (effects === true) {
    header = (
      <Header
        title={variables.getMessage('settings:sections.background.title')}
        secondaryTitle={variables.getMessage('settings:sections.background.effects.title')}
        goBack={() => setEffects(false)}
      />
    );
  } else if (backgroundSettingsSection === true) {
    header = (
      <Header
        title={variables.getMessage('settings:sections.background.title')}
        secondaryTitle={variables.getMessage('settings:sections.background.source.title')}
        goBack={() => setBackgroundSettingsSection(false)}
      />
    );
  } else {
    header = (
      <Header
        title={variables.getMessage('settings:sections.background.title')}
        setting="background"
        category="background"
        element="#backgroundImage"
      />
    );
  }

  return (
    <>
      {header}
      {subSection === '' ? (
        <>
          <Section
            id="source"
            title={variables.getMessage('settings:sections.background.source.title')}
            subtitle={variables.getMessage('settings:sections.background.source.subtitle')}
            icon={<MdSource />}
          >
            <Dropdown
              label={variables.getMessage('settings:sections.background.type.title')}
              name="backgroundType"
              onChange={(value) => this.setState({ backgroundType: value })}
              category="background"
              items={getBackgroundOptionItems(marketplaceEnabled)}
            />
          </Section>
          {backgroundType === 'api' || backgroundType === 'custom' || marketplaceEnabled ? (
            <>
              <Section
                id="effects"
                title={variables.getMessage('settings:sections.background.effects.title')}
                subtitle={variables.getMessage('settings:sections.background.effects.subtitle')}
                icon={<MdOutlineAutoAwesome />}
              />
            </>
          ) : null}
        </>
      ) : null}
      {subSection === '' &&
      (backgroundType === 'api' || backgroundType === 'custom' || marketplaceEnabled) ? (
        <PreferencesWrapper>
          <Row final={true}>
            <Content
              title={variables.getMessage('settings:sections.background.display')}
              subtitle={variables.getMessage('settings:sections.background.display_subtitle')}
            />
            <Action>
              <Checkbox
                name="bgtransition"
                text={variables.getMessage('settings:sections.background.transition')}
                element=".other"
                disabled={!usingImage}
              />
              <Checkbox
                name="photoInformation"
                text={variables.getMessage('settings:sections.background.photo_information')}
                element=".other"
              />
              <Checkbox
                name="photoMap"
                text={variables.getMessage('settings:sections.background.show_map')}
                element=".other"
                disabled={!usingImage}
              />
            </Action>
          </Row>
        </PreferencesWrapper>
      ) : null}
      {subSection === 'source' && (
        <>
          <Row final={backgroundType === 'random_colour' || backgroundType === 'random_gradient'}>
            <Content
              title={variables.getMessage('settings:sections.background.source.title')}
              subtitle={variables.getMessage('settings:sections.background.source.subtitle')}
            />
            <Action>
              <Dropdown
                label={variables.getMessage('settings:sections.background.type.title')}
                name="backgroundType"
                onChange={(value) => setBackgroundType(value)}
                category="background"
                items={getBackgroundOptionItems(marketplaceEnabled)}
              />
            </Action>
          </Row>
          {/*  todo: ideally refactor all of this file, but we need interval to appear on marketplace too */}
          {backgroundSettings}
        </>
      )}
      {(backgroundType === 'api' || backgroundType === 'custom' || marketplaceEnabled) &&
      subSection === 'effects' ? (
        <>{EffectsOptions()}</>
      ) : null}
    </>
  );
}

export { BackgroundOptions as default, BackgroundOptions };
