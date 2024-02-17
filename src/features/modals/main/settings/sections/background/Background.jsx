import variables from 'config/variables';
import { PureComponent } from 'react';
import { MenuItem } from '@mui/material';
import { MdSource, MdOutlineKeyboardArrowRight, MdOutlineAutoAwesome } from 'react-icons/md';

import Header from '../../../../../../components/Layout/Settings/Header/Header';
import Checkbox from '../../../../../../components/Form/Settings/Checkbox/Checkbox';
import ChipSelect from '../../../../../../components/Form/Settings/ChipSelect/ChipSelect';
import Dropdown from '../../../../../../components/Form/Settings/Dropdown/Dropdown';
import Slider from '../../../../../../components/Form/Settings/Slider/Slider';
import Radio from '../../../../../../components/Form/Settings/Radio/Radio';
import {
  Row,
  Content,
  Action,
} from '../../../../../../components/Layout/Settings/Item/SettingsItem';
import Text from '../../../../../../components/Form/Settings/Text/Text';

import ColourSettings from './Colour';
import CustomSettings from './Custom';

import { values } from 'modules/helpers/settings/modals';

export default class BackgroundSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      backgroundType: localStorage.getItem('backgroundType') || 'api',
      backgroundFilter: localStorage.getItem('backgroundFilter') || 'none',
      backgroundCategories: [variables.getMessage('modals.main.loading')],
      backgroundAPI: localStorage.getItem('backgroundAPI') || 'mue',
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
    /* const interval = (
      <Row
        final={
          localStorage.getItem('photo_packs') &&
          this.state.backgroundType !== 'custom' &&
          this.state.backgroundType !== 'colour' &&
          this.state.backgroundType !== 'api'
        }
      >
      <Content         title={variables.getMessage('modals.main.settings.sections.background.interval.title')}
        subtitle={variables.getMessage(
          'modals.main.settings.sections.background.interval.subtitle',
        )} />
        <Action>
        <Dropdown
          label={variables.getMessage('modals.main.settings.sections.background.interval.title')}
          name="backgroundchange"
          name2="backgroundStartTime"
          value2={Date.now()}
        >
          <option value="refresh">{variables.getMessage('tabname')}</option>
          <option value="60000">
            {variables.getMessage('modals.main.settings.sections.background.interval.minute')}
          </option>
          <option value="1800000">
            {variables.getMessage('modals.main.settings.sections.background.interval.half_hour')}
          </option>
          <option value="3600000">
            {variables.getMessage('modals.main.settings.sections.background.interval.hour')}
          </option>
          <option value="86400000">
            {variables.getMessage('modals.main.settings.sections.background.interval.day')}
          </option>
          <option value="604800000">{variables.getMessage('widgets.date.week')}</option>
          <option value="2628000000">
            {variables.getMessage('modals.main.settings.sections.background.interval.month')}
          </option>
        </Dropdown>
        </Action>
      </Row>
    );*/

    const APISettings = (
      <>
        <Row final={this.state.backgroundAPI === 'mue'}>
          <Content
            title={variables.getMessage('modals.main.settings.sections.background.api')}
            subtitle={variables.getMessage('modals.main.settings.sections.background.api_subtitle')}
          />
          <Action>
            {this.state.backgroundCategories[0] === variables.getMessage('modals.main.loading') ? (
              <>
                <Dropdown
                  label={variables.getMessage('modals.main.settings.sections.background.category')}
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
                label={variables.getMessage('modals.main.settings.sections.background.categories')}
                options={this.state.backgroundCategories}
                name="apiCategories"
              />
            )}
            <Dropdown
              label={variables.getMessage(
                'modals.main.settings.sections.background.source.quality.title',
              )}
              name="apiQuality"
              element=".other"
              items={[
                {
                  value: 'original',
                  text: variables.getMessage(
                    'modals.main.settings.sections.background.source.quality.original',
                  ),
                },
                {
                  value: 'high',
                  text: variables.getMessage(
                    'modals.main.settings.sections.background.source.quality.high',
                  ),
                },
                {
                  value: 'normal',
                  text: variables.getMessage(
                    'modals.main.settings.sections.background.source.quality.normal',
                  ),
                },
                {
                  value: 'datasaver',
                  text: variables.getMessage(
                    'modals.main.settings.sections.background.source.quality.datasaver',
                  ),
                },
              ]}
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
            <Action
              title={variables.getMessage(
                'modals.main.settings.sections.background.unsplash.title',
              )}
              subtitle={variables.getMessage('modals.main.settings.sections.background.subtitle')}
            />
            <Action>
              <Text
                title={variables.getMessage('modals.main.settings.sections.background.id')}
                subtitle={variables.getMessage(
                  'modals.main.settings.sections.background.id_subtitle',
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
          title={variables.getMessage('modals.main.settings.sections.background.title')}
          secondaryTitle={variables.getMessage(
            'modals.main.settings.sections.background.effects.title',
          )}
          goBack={() => this.setState({ effects: false })}
        />
      );
    } else if (this.state.backgroundSettingsSection === true) {
      header = (
        <Header
          title={variables.getMessage('modals.main.settings.sections.background.title')}
          secondaryTitle={variables.getMessage(
            'modals.main.settings.sections.background.source.title',
          )}
          goBack={() => this.setState({ backgroundSettingsSection: false })}
        />
      );
    } else {
      header = (
        <Header
          title={variables.getMessage('modals.main.settings.sections.background.title')}
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
                    {variables.getMessage('modals.main.settings.sections.background.source.title')}
                  </span>
                  <span className="subtitle">
                    {variables.getMessage(
                      'modals.main.settings.sections.background.source.subtitle',
                    )}
                  </span>
                </div>
              </div>
              <div className="action">
                <Dropdown
                  label={variables.getMessage(
                    'modals.main.settings.sections.background.type.title',
                  )}
                  name="backgroundType"
                  onChange={(value) => this.setState({ backgroundType: value })}
                  category="background"
                  items={[
                    this.state.marketplaceEnabled && {
                      value: 'photo_pack',
                      text: variables.getMessage('modals.main.navbar.marketplace'),
                    },
                    {
                      value: 'api',
                      text: variables.getMessage(
                        'modals.main.settings.sections.background.type.api',
                      ),
                    },
                    {
                      value: 'custom',
                      text: variables.getMessage(
                        'modals.main.settings.sections.background.type.custom_image',
                      ),
                    },
                    {
                      value: 'colour',
                      text: variables.getMessage(
                        'modals.main.settings.sections.background.type.custom_colour',
                      ),
                    },
                    {
                      value: 'random_colour',
                      text: variables.getMessage(
                        'modals.main.settings.sections.background.type.random_colour',
                      ),
                    },
                    {
                      value: 'random_gradient',
                      text: variables.getMessage(
                        'modals.main.settings.sections.background.type.random_gradient',
                      ),
                    },
                  ]}
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
                          'modals.main.settings.sections.background.effects.title',
                        )}
                      </span>
                      <span className="subtitle">
                        {variables.getMessage(
                          'modals.main.settings.sections.background.effects.subtitle',
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
              title={variables.getMessage('modals.main.settings.sections.background.display')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.background.display_subtitle',
              )}
            />
            <Action>
              <Checkbox
                name="ddgProxy"
                text={variables.getMessage(
                  'modals.main.settings.sections.background.ddg_image_proxy',
                )}
                element=".other"
                disabled={!usingImage}
              />
              <Checkbox
                name="bgtransition"
                text={variables.getMessage('modals.main.settings.sections.background.transition')}
                element=".other"
                disabled={!usingImage}
              />
              <Checkbox
                name="photoInformation"
                text={variables.getMessage(
                  'modals.main.settings.sections.background.photo_information',
                )}
                element=".other"
              />
              <Checkbox
                name="photoMap"
                text={variables.getMessage('modals.main.settings.sections.background.show_map')}
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
                  'modals.main.settings.sections.background.source.title',
                )}
                subtitle={variables.getMessage(
                  'modals.main.settings.sections.background.source.subtitle',
                )}
              />
              <Action>
                <Dropdown
                  label={variables.getMessage(
                    'modals.main.settings.sections.background.type.title',
                  )}
                  name="backgroundType"
                  onChange={(value) => this.setState({ backgroundType: value })}
                  category="background"
                  items={[
                    this.state.marketplaceEnabled && {
                      value: 'photo_pack',
                      text: variables.getMessage('modals.main.navbar.marketplace'),
                    },
                    {
                      value: 'api',
                      text: variables.getMessage(
                        'modals.main.settings.sections.background.type.api',
                      ),
                    },
                    {
                      value: 'custom',
                      text: variables.getMessage(
                        'modals.main.settings.sections.background.type.custom_image',
                      ),
                    },
                    {
                      value: 'colour',
                      text: variables.getMessage(
                        'modals.main.settings.sections.background.type.custom_colour',
                      ),
                    },
                    {
                      value: 'random_colour',
                      text: variables.getMessage(
                        'modals.main.settings.sections.background.type.random_colour',
                      ),
                    },
                    {
                      value: 'random_gradient',
                      text: variables.getMessage(
                        'modals.main.settings.sections.background.type.random_gradient',
                      ),
                    },
                  ]}
                />
              </Action>
            </Row>
            {/* // todo: ideally refactor all of this file, but we need interval to appear on marketplace too */}
            {/*{this.state.backgroundType === 'api' ||
            this.state.backgroundType === 'custom' ||
            this.state.marketplaceEnabled
              ? interval
                  : null}*/}
            {backgroundSettings}
          </>
        )}
        {(this.state.backgroundType === 'api' ||
          this.state.backgroundType === 'custom' ||
          this.state.marketplaceEnabled) &&
        this.state.effects ? (
          <Row final={true}>
            <Content
              title={variables.getMessage('modals.main.settings.sections.background.effects.title')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.background.effects.subtitle',
              )}
            />
            <Action>
              <Slider
                title={variables.getMessage(
                  'modals.main.settings.sections.background.effects.blur',
                )}
                name="blur"
                min="0"
                max="100"
                default="0"
                display="%"
                marks={values('background')}
                category="background"
                element="#backgroundImage"
              />
              <Slider
                title={variables.getMessage(
                  'modals.main.settings.sections.background.effects.brightness',
                )}
                name="brightness"
                min="0"
                max="100"
                default="90"
                display="%"
                marks={values('background')}
                category="background"
                element="#backgroundImage"
              />
              <Dropdown
                label={variables.getMessage(
                  'modals.main.settings.sections.background.effects.filters.title',
                )}
                name="backgroundFilter"
                onChange={(value) => this.setState({ backgroundFilter: value })}
                category="background"
                element="#backgroundImage"
                items={[
                  {
                    value: 'none',
                    text: variables.getMessage(
                      'modals.main.settings.sections.appearance.navbar.refresh_options.none',
                    ),
                  },
                  {
                    value: 'grayscale',
                    text: variables.getMessage(
                      'modals.main.settings.sections.background.effects.filters.grayscale',
                    ),
                  },
                  {
                    value: 'sepia',
                    text: variables.getMessage(
                      'modals.main.settings.sections.background.effects.filters.sepia',
                    ),
                  },
                  {
                    value: 'invert',
                    text: variables.getMessage(
                      'modals.main.settings.sections.background.effects.filters.invert',
                    ),
                  },
                  {
                    value: 'saturate',
                    text: variables.getMessage(
                      'modals.main.settings.sections.background.effects.filters.saturate',
                    ),
                  },
                  {
                    value: 'contrast',
                    text: variables.getMessage(
                      'modals.main.settings.sections.background.effects.filters.contrast',
                    ),
                  },
                ]}
              />
              {this.state.backgroundFilter !== 'none' && (
                <Slider
                  title={variables.getMessage(
                    'modals.main.settings.sections.background.effects.filters.amount',
                  )}
                  name="backgroundFilterAmount"
                  min="0"
                  max="100"
                  default="0"
                  display="%"
                  marks={values('background')}
                  category="background"
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
