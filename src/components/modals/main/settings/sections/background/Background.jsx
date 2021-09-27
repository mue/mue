import variables from 'modules/variables';
import { PureComponent } from 'react';

import Header from '../../Header';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import Slider from '../../Slider';
import Radio from '../../Radio';

import ColourSettings from './Colour';
import CustomSettings from './Custom';

export default class BackgroundSettings extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      backgroundType: localStorage.getItem('backgroundType') || 'api',
      backgroundCategories: [this.getMessage('modals.main.loading')]
    };
    this.controller = new AbortController();
  }

  marketplaceType = () => {
    if (localStorage.getItem('photo_packs')) {
      return <option value='photo_pack'>{this.getMessage('modals.main.navbar.marketplace')}</option>;
    }
  }

  async getBackgroundCategories() {
    const data = await (await fetch(window.constants.API_URL + '/images/categories', { signal: this.controller.signal })).json();

    if (this.controller.signal.aborted === true) {
      return;
    }

    this.setState({
      backgroundCategories: data
    });
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return this.setState({
        backgroundCategories: [this.getMessage('modals.update.offline.title')]
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

    let backgroundSettings;

    const apiOptions = [
      {
        name: 'Mue',
        value: 'mue'
      },
      {
        name: 'Unsplash',
        value: 'unsplash'
      },
      {
        name: 'Pexels',
        value: 'pexels'
      }
    ];

    const interval = (
      <>
        <br/><br/>
        <Dropdown label={getMessage('modals.main.settings.sections.background.interval.title')} name='backgroundchange'>
        <option value='refresh'>{getMessage('tabname')}</option>
          <option value='60000'>{getMessage('modals.main.settings.sections.background.interval.minute')}</option>
          <option value='1800000'>{getMessage('modals.main.settings.sections.background.interval.half_hour')}</option>
          <option value='3600000'>{getMessage('modals.main.settings.sections.background.interval.hour')}</option>
          <option value='86400000'>{getMessage('modals.main.settings.sections.background.interval.day')}</option>
          <option value='604800000'>{getMessage('widgets.date.week')}</option>
          <option value='2628000000'>{getMessage('modals.main.settings.sections.background.interval.month')}</option>
        </Dropdown>
      </>
    );

    const APISettings = (
      <>
        <br/>
        <Radio title={getMessage('modals.main.settings.sections.background.source.api')} options={apiOptions} name='backgroundAPI' category='background' element='#backgroundImage'/>
        <br/>
        <Dropdown label={getMessage('modals.main.settings.sections.background.category')} name='apiCategory'>
          {this.state.backgroundCategories.map((category) => (
            <option value={category} key={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
          ))}
        </Dropdown>
        <br/><br/>
        <Dropdown label={getMessage('modals.main.settings.sections.background.source.quality.title')} name='apiQuality' element='.other'>
          <option value='original'>{getMessage('modals.main.settings.sections.background.source.quality.original')}</option>
          <option value='high'>{getMessage('modals.main.settings.sections.background.source.quality.high')}</option>
          <option value='normal'>{getMessage('modals.main.settings.sections.background.source.quality.normal')}</option>
          <option value='datasaver'>{getMessage('modals.main.settings.sections.background.source.quality.datasaver')}</option>
        </Dropdown>
        {interval}
      </>
    );

    switch (this.state.backgroundType) {
      case 'custom': backgroundSettings = <CustomSettings interval={interval}/>; break;
      case 'colour': backgroundSettings = <ColourSettings/>; break;
      default: backgroundSettings = APISettings; break;
    }

    if (localStorage.getItem('photo_packs') && this.state.backgroundType !== 'custom' && this.state.backgroundType !== 'colour' && this.state.backgroundType !== 'api') {
      backgroundSettings = null;
    }
  
    return (
      <>
        <Header title={getMessage('modals.main.settings.sections.background.title')} category='background' element='#backgroundImage'/>
        <Checkbox name='ddgProxy' text={getMessage('modals.main.settings.sections.background.ddg_image_proxy')} element='.other' />
        <Checkbox name='bgtransition' text={getMessage('modals.main.settings.sections.background.transition')} element='.other' />
        <Checkbox name='photoInformation' text={getMessage('modals.main.settings.sections.background.photo_information')} element='.other' />
        <Checkbox name='photoMap' text={getMessage('modals.main.settings.sections.background.show_map')} element='.other'/>

        <h3>{getMessage('modals.main.settings.sections.background.source.title')}</h3>
        <Dropdown label={getMessage('modals.main.settings.sections.background.type.title')} name='backgroundType' onChange={(value) => this.setState({ backgroundType: value })} category='background'>
          {this.marketplaceType()}
          <option value='api'>{getMessage('modals.main.settings.sections.background.type.api')}</option>
          <option value='custom'>{getMessage('modals.main.settings.sections.background.type.custom_image')}</option>
          <option value='colour'>{getMessage('modals.main.settings.sections.background.type.custom_colour')}</option>
          <option value='random_colour'>{getMessage('modals.main.settings.sections.background.type.random_colour')}</option>
          <option value='random_gradient'>{getMessage('modals.main.settings.sections.background.type.random_gradient')}</option>
        </Dropdown>
        <br/>

        {backgroundSettings}

        <h3>{getMessage('modals.main.settings.sections.background.buttons.title')}</h3>
        <Checkbox name='downloadbtn' text={getMessage('modals.main.settings.sections.background.buttons.download')} element='.other' />

        <h3>{getMessage('modals.main.settings.sections.background.effects.title')}</h3>
        <Slider title={getMessage('modals.main.settings.sections.background.effects.blur')} name='blur' min='0' max='100' default='0' display='%' category='background' element='#backgroundImage' />
        <Slider title={getMessage('modals.main.settings.sections.background.effects.brightness')} name='brightness' min='0' max='100' default='90' display='%' category='background' element='#backgroundImage' />
        <br/><br/>
        <Dropdown label={getMessage('modals.main.settings.sections.background.effects.filters.title')} name='backgroundFilter' category='background' element='#backgroundImage'>
          <option value='grayscale'>{getMessage('modals.main.settings.sections.background.effects.filters.grayscale')}</option>
          <option value='sepia'>{getMessage('modals.main.settings.sections.background.effects.filters.sepia')}</option>
          <option value='invert'>{getMessage('modals.main.settings.sections.background.effects.filters.invert')}</option>
          <option value='saturate'>{getMessage('modals.main.settings.sections.background.effects.filters.saturate')}</option>
          <option value='contrast'>{getMessage('modals.main.settings.sections.background.effects.filters.contrast')}</option>
        </Dropdown>
        <Slider title={getMessage('modals.main.settings.sections.background.effects.filters.amount')} name='backgroundFilterAmount' min='0' max='100' default='0' display='%' category='background' element='#backgroundImage' />
      </>
    );
  }
}
