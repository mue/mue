import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MenuItem } from '@mui/material';
import {
  MdSource,
  MdOutlineKeyboardArrowRight,
  MdOutlineAutoAwesome,
  MdArrowBack,
} from 'react-icons/md';

import Header from '../../Header';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import Slider from '../../Slider';
import Radio from '../../Radio';
import SettingsItem from '../../SettingsItem';
import Tooltip from '../../../../../helpers/tooltip/Tooltip';

import ColourSettings from './Colour';
import CustomSettings from './Custom';

import { values } from 'modules/helpers/settings/modals';

export default class BackgroundSettings extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      backgroundType: localStorage.getItem('backgroundType') || 'api',
      backgroundFilter: localStorage.getItem('backgroundFilter') || 'none',
      backgroundCategories: [this.getMessage('modals.main.loading')],
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

    this.setState({
      backgroundCategories: data,
    });
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return this.setState({
        backgroundCategories: [this.getMessage('modals.update.offline.title')],
      });
    }

    this.getBackgroundCategories();
  }

  componentWillUnmount() {
    // stop making requests
    this.controller.abort();
  }

  render() {
    const { getMessage } = this;

    const interval = (
      <SettingsItem title="Interval" subtitle="Change how often the background is updated">
        <Dropdown
          label={getMessage('modals.main.settings.sections.background.interval.title')}
          name="backgroundchange"
        >
          <option value="refresh">{getMessage('tabname')}</option>
          <option value="60000">
            {getMessage('modals.main.settings.sections.background.interval.minute')}
          </option>
          <option value="1800000">
            {getMessage('modals.main.settings.sections.background.interval.half_hour')}
          </option>
          <option value="3600000">
            {getMessage('modals.main.settings.sections.background.interval.hour')}
          </option>
          <option value="86400000">
            {getMessage('modals.main.settings.sections.background.interval.day')}
          </option>
          <option value="604800000">{getMessage('widgets.date.week')}</option>
          <option value="2628000000">
            {getMessage('modals.main.settings.sections.background.interval.month')}
          </option>
        </Dropdown>
      </SettingsItem>
    );

    const APISettings = (
      <>
        <SettingsItem
          title="API Settings"
          subtitle="Options for the getting an image from an external service (API)"
        >
          {this.state.backgroundCategories[0] === getMessage('modals.main.loading') ? (
            <>
              <Dropdown
                label={getMessage('modals.main.settings.sections.background.category')}
                name="apiCategory"
              >
                <MenuItem value="loading" key="loading">
                  {getMessage('modals.main.loading')}
                </MenuItem>
                <MenuItem value="loading" key="loading">
                  {getMessage('modals.main.loading')}
                </MenuItem>
              </Dropdown>
            </>
          ) : (
            <Dropdown
              label={getMessage('modals.main.settings.sections.background.category')}
              name="apiCategory"
            >
              {this.state.backgroundCategories.map((category) => (
                <MenuItem value={category} key={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Dropdown>
          )}
          <Dropdown
            label={getMessage('modals.main.settings.sections.background.source.quality.title')}
            name="apiQuality"
            element=".other"
          >
            <option value="original">
              {getMessage('modals.main.settings.sections.background.source.quality.original')}
            </option>
            <option value="high">
              {getMessage('modals.main.settings.sections.background.source.quality.high')}
            </option>
            <option value="normal">
              {getMessage('modals.main.settings.sections.background.source.quality.normal')}
            </option>
            <option value="datasaver">
              {getMessage('modals.main.settings.sections.background.source.quality.datasaver')}
            </option>
          </Dropdown>
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
              {
                name: 'Pexels',
                value: 'pexels',
              },
            ]}
            name="backgroundAPI"
            category="background"
            element="#backgroundImage"
            onChange={(e) => this.setState({ backgroundAPI: e })}
          />
        </SettingsItem>
        {interval}
      </>
    );

    let backgroundSettings = APISettings;
    switch (this.state.backgroundType) {
      case 'custom':
        backgroundSettings = <CustomSettings interval={interval} />;
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

    const breadcrumb = (name, toSet) => (
      <div className="breadcrumb">
        <div onClick={() => this.setState({ [toSet]: false })} className="settingsReturn">
          <Tooltip title="back" key="backArrow">
            <MdArrowBack />
          </Tooltip>
        </div>
        <span className="subtitle">{name}</span>
      </div>
    );

    return (
      <>
        <Header
          title={getMessage('modals.main.settings.sections.background.title')}
          setting="background"
          category="background"
          element="#backgroundImage"
        />
        {this.state.effects ? breadcrumb('Effects', 'effects') : null}
        {this.state.backgroundSettingsSection
          ? breadcrumb('Source', 'backgroundSettingsSection')
          : null}
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
                    {getMessage('modals.main.settings.sections.background.source.title')}
                  </span>
                  <span className="subtitle">Select where to get background images from</span>
                </div>
              </div>
              <div className="action">
                <Dropdown
                  label={getMessage('modals.main.settings.sections.background.type.title')}
                  name="backgroundType"
                  onChange={(value) => this.setState({ backgroundType: value })}
                  category="background"
                >
                  {this.state.marketplaceEnabled ? (
                    <option value="photo_pack">
                      {this.getMessage('modals.main.navbar.marketplace')}
                    </option>
                  ) : null}
                  <option value="api">
                    {getMessage('modals.main.settings.sections.background.type.api')}
                  </option>
                  <option value="custom">
                    {getMessage('modals.main.settings.sections.background.type.custom_image')}
                  </option>
                  <option value="colour">
                    {getMessage('modals.main.settings.sections.background.type.custom_colour')}
                  </option>
                  <option value="random_colour">
                    {getMessage('modals.main.settings.sections.background.type.random_colour')}
                  </option>
                  <option value="random_gradient">
                    {getMessage('modals.main.settings.sections.background.type.random_gradient')}
                  </option>
                </Dropdown>
              </div>
            </div>
            <div className="moreSettings" onClick={() => this.setState({ effects: true })}>
              <div className="left">
                <MdOutlineAutoAwesome />
                <div className="content">
                  <span className="title">
                    {getMessage('modals.main.settings.sections.background.effects.title')}
                  </span>
                  <span className="subtitle">Add effects to the background image</span>
                </div>
              </div>
              <div className="action">
                {' '}
                <MdOutlineKeyboardArrowRight />
              </div>
            </div>
          </>
        ) : null}
        {this.state.backgroundSettingsSection !== true && this.state.effects !== true ? (
          <SettingsItem
            title="Display"
            subtitle="Change how background and photo information are loaded"
            final={true}
          >
            <Checkbox
              name="ddgProxy"
              text={getMessage('modals.main.settings.sections.background.ddg_image_proxy')}
              element=".other"
              disabled={!usingImage}
            />
            <Checkbox
              name="bgtransition"
              text={getMessage('modals.main.settings.sections.background.transition')}
              element=".other"
              disabled={!usingImage}
            />
            <Checkbox
              name="photoInformation"
              text={getMessage('modals.main.settings.sections.background.photo_information')}
              element=".other"
              disabled={
                this.state.backgroundType !== 'api' && this.state.backgroundType !== 'marketplace'
              }
            />
            <Checkbox
              name="photoMap"
              text={getMessage('modals.main.settings.sections.background.show_map')}
              element=".other"
              disabled={this.state.backgroundAPI !== 'unsplash'}
            />
          </SettingsItem>
        ) : null}
        {this.state.backgroundSettingsSection ? (
          <>
            <SettingsItem
              title={getMessage('modals.main.settings.sections.background.source.title')}
              subtitle="Select where to get background images from"
            >
              <Dropdown
                label={getMessage('modals.main.settings.sections.background.type.title')}
                name="backgroundType"
                onChange={(value) => this.setState({ backgroundType: value })}
                category="background"
              >
                {this.state.marketplaceEnabled ? (
                  <option value="photo_pack">
                    {this.getMessage('modals.main.navbar.marketplace')}
                  </option>
                ) : null}
                <option value="api">
                  {getMessage('modals.main.settings.sections.background.type.api')}
                </option>
                <option value="custom">
                  {getMessage('modals.main.settings.sections.background.type.custom_image')}
                </option>
                <option value="colour">
                  {getMessage('modals.main.settings.sections.background.type.custom_colour')}
                </option>
                <option value="random_colour">
                  {getMessage('modals.main.settings.sections.background.type.random_colour')}
                </option>
                <option value="random_gradient">
                  {getMessage('modals.main.settings.sections.background.type.random_gradient')}
                </option>
              </Dropdown>
            </SettingsItem>
            {backgroundSettings}
          </>
        ) : null}
        {(this.state.backgroundType === 'api' ||
          this.state.backgroundType === 'custom' ||
          this.state.marketplaceEnabled) &&
        this.state.effects ? (
          <SettingsItem
            title={getMessage('modals.main.settings.sections.background.effects.title')}
            subtitle="Add effects to the background image"
            final={true}
          >
            <Slider
              title={getMessage('modals.main.settings.sections.background.effects.blur')}
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
              title={getMessage('modals.main.settings.sections.background.effects.brightness')}
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
              label={getMessage('modals.main.settings.sections.background.effects.filters.title')}
              name="backgroundFilter"
              onChange={(value) => this.setState({ backgroundFilter: value })}
              category="background"
              element="#backgroundImage"
            >
              <option value="none">
                {getMessage('modals.main.settings.sections.appearance.navbar.refresh_options.none')}
              </option>
              <option value="grayscale">
                {getMessage('modals.main.settings.sections.background.effects.filters.grayscale')}
              </option>
              <option value="sepia">
                {getMessage('modals.main.settings.sections.background.effects.filters.sepia')}
              </option>
              <option value="invert">
                {getMessage('modals.main.settings.sections.background.effects.filters.invert')}
              </option>
              <option value="saturate">
                {getMessage('modals.main.settings.sections.background.effects.filters.saturate')}
              </option>
              <option value="contrast">
                {getMessage('modals.main.settings.sections.background.effects.filters.contrast')}
              </option>
            </Dropdown>
            {this.state.backgroundFilter !== 'none' ? (
              <Slider
                title={getMessage(
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
            ) : null}
          </SettingsItem>
        ) : null}
      </>
    );
  }
}
