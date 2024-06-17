import variables from 'config/variables';
import { PureComponent } from 'react';
import { MdSource, MdOutlineKeyboardArrowRight, MdOutlineAutoAwesome } from 'react-icons/md';

import { Header } from 'components/Layout/Settings';
import { Checkbox, Dropdown, Slider, Radio, Text, ChipSelect } from 'components/Form/Settings';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
//import Text from 'components/Form/Settings/Text/Text';

import ColourSettings from './Colour';
import CustomSettings from './Custom';

import values from 'utils/data/slider_values.json';
import { APIQualityOptions, backgroundImageEffects, getBackgroundOptionItems } from './optionTypes';

import defaults from './default';

class BackgroundOptions extends PureComponent {
  constructor() {
    super();
    this.state = {
      backgroundType: localStorage.getItem('backgroundType') || defaults.backgroundType,
      backgroundFilter: localStorage.getItem('backgroundFilter') || 'none',
      backgroundCategories: [variables.getMessage('modals.main.loading')],
      backgroundAPI: localStorage.getItem('backgroundAPI') || defaults.backgroundAPI,
      marketplaceEnabled: localStorage.getItem('photo_packs'),
      effects: false,
      backgroundSettingsSection: false,
    };
    this.controller = new AbortController();
  }

  async getBackgroundCategories() {
    const data = await (
      await fetch(variables.constants.API_URL + '/images/categories', {
        signal: this.controller.signal,
      })
    ).json();

    if (this.controller.signal.aborted === true) {
      return;
    }

    if (this.state.backgroundAPI !== 'mue') {
      // remove counts from unsplash categories
      data.forEach((category) => {
        delete category.count;
      });
    }

    this.setState({
      backgroundCategories: data,
      backgroundCategoriesOG: data,
    });
  }

  updateAPI(e) {
    localStorage.setItem('nextImage', null);
    if (e === 'mue') {
      this.setState({
        backgroundCategories: this.state.backgroundCategoriesOG,
        backgroundAPI: 'mue',
      });
    } else {
      const data = this.state.backgroundCategories;
      data.forEach((category) => {
        delete category.count;
      });

      this.setState({
        backgroundAPI: 'unsplash',
        backgroundCategories: data,
      });
    }
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return this.setState({
        backgroundCategories: [variables.getMessage('modals.update.offline.title')],
      });
    }

    this.getBackgroundCategories();
  }

  componentWillUnmount() {
    // stop making requests
    this.controller.abort();
  }

  render() {
    const APISettings = (
      <>
        <Row final={this.state.backgroundAPI === 'mue'}>
          <Content
            title={variables.getMessage('settings:sections.background.api')}
            subtitle={variables.getMessage('settings:sections.background.api_subtitle')}
          />
          <Action>
            {this.state.backgroundCategories[0] === variables.getMessage('modals.main.loading') ? (
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
                options={this.state.backgroundCategories}
                name="apiCategories"
              />
            )}
            <Dropdown
              label={variables.getMessage(
                'settings:sections.background.source.quality.title',
              )}
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
              onChange={(e) => this.updateAPI(e)}
            />
          </Action>
        </Row>
        {this.state.backgroundAPI === 'unsplash' && (
          <Row final={true}>
            <Content
              title={variables.getMessage(
                'settings:sections.background.unsplash.title',
              )}
              subtitle={variables.getMessage(
                'settings:sections.background.unsplash.subtitle',
              )}
            />
            <Action>
              <Text
                title={variables.getMessage('settings:sections.background.unsplash.id')}
                subtitle={variables.getMessage(
                  'settings:sections.background.unsplash.id_subtitle',
                )}
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

    let backgroundSettings = APISettings;
    switch (this.state.backgroundType) {
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
      this.state.backgroundType !== 'custom' &&
      this.state.backgroundType !== 'colour' &&
      this.state.backgroundType !== 'api'
    ) {
      backgroundSettings = null;
    }

    const usingImage =
      this.state.backgroundType !== 'colour' &&
      this.state.backgroundType !== 'random_colour' &&
      this.state.backgroundType !== 'random_gradient';

    let header;
    if (this.state.effects === true) {
      header = (
        <Header
          title={variables.getMessage('settings:sections.background.title')}
          secondaryTitle={variables.getMessage(
            'settings:sections.background.effects.title',
          )}
          goBack={() => this.setState({ effects: false })}
        />
      );
    } else if (this.state.backgroundSettingsSection === true) {
      header = (
        <Header
          title={variables.getMessage('settings:sections.background.title')}
          secondaryTitle={variables.getMessage(
            'settings:sections.background.source.title',
          )}
          goBack={() => this.setState({ backgroundSettingsSection: false })}
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
        {this.state.backgroundSettingsSection !== true && this.state.effects !== true ? (
          <>
            <div
              className="moreSettings"
              onClick={() => this.setState({ backgroundSettingsSection: true })}
            >
              <div className="left">
                <MdSource />
                <div className="content">
                  <span className="title">
                    {variables.getMessage('settings:sections.background.source.title')}
                  </span>
                  <span className="subtitle">
                    {variables.getMessage(
                      'settings:sections.background.source.subtitle',
                    )}
                  </span>
                </div>
              </div>
              <div className="action">
                <Dropdown
                  label={variables.getMessage(
                    'settings:sections.background.type.title',
                  )}
                  name="backgroundType"
                  onChange={(value) => this.setState({ backgroundType: value })}
                  category="background"
                  items={getBackgroundOptionItems(this.state.marketplaceEnabled)}
                />
              </div>
            </div>
            {this.state.backgroundType === 'api' ||
            this.state.backgroundType === 'custom' ||
            this.state.marketplaceEnabled ? (
              <>
                <div className="moreSettings" onClick={() => this.setState({ effects: true })}>
                  <div className="left">
                    <MdOutlineAutoAwesome />
                    <div className="content">
                      <span className="title">
                        {variables.getMessage(
                          'settings:sections.background.effects.title',
                        )}
                      </span>
                      <span className="subtitle">
                        {variables.getMessage(
                          'settings:sections.background.effects.subtitle',
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="action">
                    {' '}
                    <MdOutlineKeyboardArrowRight />
                  </div>
                </div>
              </>
            ) : null}
          </>
        ) : null}
        {this.state.backgroundSettingsSection !== true &&
        this.state.effects !== true &&
        (this.state.backgroundType === 'api' ||
          this.state.backgroundType === 'custom' ||
          this.state.marketplaceEnabled) ? (
          <Row final={true}>
            <Content
              title={variables.getMessage('settings:sections.background.display')}
              subtitle={variables.getMessage(
                'settings:sections.background.display_subtitle',
              )}
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
                text={variables.getMessage(
                  'settings:sections.background.photo_information',
                )}
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
        ) : null}
        {this.state.backgroundSettingsSection && (
          <>
            <Row
              final={
                this.state.backgroundType === 'random_colour' ||
                this.state.backgroundType === 'random_gradient'
              }
            >
              <Content
                title={variables.getMessage(
                  'settings:sections.background.source.title',
                )}
                subtitle={variables.getMessage(
                  'settings:sections.background.source.subtitle',
                )}
              />
              <Action>
                <Dropdown
                  label={variables.getMessage(
                    'settings:sections.background.type.title',
                  )}
                  name="backgroundType"
                  onChange={(value) => this.setState({ backgroundType: value })}
                  category="background"
                  items={getBackgroundOptionItems(this.state.marketplaceEnabled)}
                />
              </Action>
            </Row>
            {/*  todo: ideally refactor all of this file, but we need interval to appear on marketplace too */}
            {backgroundSettings}
          </>
        )}
        {(this.state.backgroundType === 'api' ||
          this.state.backgroundType === 'custom' ||
          this.state.marketplaceEnabled) &&
        this.state.effects ? (
          <Row final={true}>
            <Content
              title={variables.getMessage('settings:sections.background.effects.title')}
              subtitle={variables.getMessage(
                'settings:sections.background.effects.subtitle',
              )}
            />
            <Action>
              <Slider
                title={variables.getMessage(
                  'settings:sections.background.effects.blur',
                )}
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
                title={variables.getMessage(
                  'settings:sections.background.effects.brightness',
                )}
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
                label={variables.getMessage(
                  'settings:sections.background.effects.filters.title',
                )}
                name="backgroundFilter"
                onChange={(value) => this.setState({ backgroundFilter: value })}
                category="backgroundeffect"
                element="#backgroundImage"
                items={backgroundImageEffects}
              />
              {this.state.backgroundFilter !== 'none' && (
                <Slider
                  title={variables.getMessage(
                    'settings:sections.background.effects.filters.amount',
                  )}
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
        ) : null}
      </>
    );
  }
}

export { BackgroundOptions as default, BackgroundOptions };
