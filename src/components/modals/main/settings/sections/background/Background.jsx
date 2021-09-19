import variables from 'modules/variables';
import { PureComponent, Fragment } from 'react';
import { toast } from 'react-toastify';
import { Cancel } from '@mui/icons-material';

import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import FileUpload from '../../FileUpload';
import Slider from '../../Slider';
import Switch from '../../Switch';
import Radio from '../../Radio';

import ColourSettings from './Colour';

import EventBus from 'modules/helpers/eventbus';

export default class BackgroundSettings extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      customBackground: this.getCustom(),
      backgroundType: localStorage.getItem('backgroundType') || 'api',
      backgroundCategories: [this.getMessage('modals.main.loading')]
    };
    this.controller = new AbortController();
  }

  resetCustom = () => {
    localStorage.setItem('customBackground', '[""]');
    this.setState({
      customBackground: ['']
    });
    toast(this.getMessage('toasts.reset'));
    EventBus.dispatch('refresh', 'background');
  }

  customBackground(e, text, index) {
    const result = (text === true) ? e.target.value : e.target.result;

    const customBackground = this.state.customBackground;
    customBackground[index] = result;
    this.setState({
      customBackground
    });
    this.forceUpdate();

    localStorage.setItem('customBackground', JSON.stringify(customBackground));
    document.querySelector('.reminder-info').style.display = 'block';
    localStorage.setItem('showReminder', true);
  }

  modifyCustomBackground(type, index) {
    const customBackground = this.state.customBackground;
    if (type === 'add') {
      customBackground.push('');
    } else {
      customBackground.splice(index, 1);
    }

    this.setState({
      customBackground
    });
    this.forceUpdate();

    localStorage.setItem('customBackground', JSON.stringify(customBackground));
  }

  videoCustomSettings = (index) => {
    const customBackground = this.state.customBackground[index];
    if (customBackground.startsWith('data:video/') || customBackground.endsWith('.mp4') || customBackground.endsWith('.webm') || customBackground.endsWith('.ogg')) { 
      return (
        <>
          <Checkbox name='backgroundVideoLoop' text={this.getMessage('modals.main.settings.sections.background.source.loop_video')}/>
          <Checkbox name='backgroundVideoMute' text={this.getMessage('modals.main.settings.sections.background.source.mute_video')}/>
        </>
      );
    } else {
      return null;
    }
  }

  marketplaceType = () => {
    if (localStorage.getItem('photo_packs')) {
      return <option value='photo_pack'>{this.getMessage('modals.main.navbar.marketplace')}</option>;
    }
  }

  getCustom() {
    let data;
    try {
      data = JSON.parse(localStorage.getItem('customBackground'));
    } catch (e) {
      data = [localStorage.getItem('customBackground')];
    }

    return data;
  }

  uploadCustombackground(index) {
    document.getElementById('bg-input').setAttribute('index', index);
    document.getElementById('bg-input').click();
    // to fix loadFunction
    this.setState({
      currentBackgroundIndex: index
    });
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

    const customSettings = (
      <>
        <ul>
          <p>{getMessage('modals.main.settings.sections.background.source.custom_background')} <span className='modalLink' onClick={this.resetCustom}>{getMessage('modals.main.settings.buttons.reset')}</span></p>
          {this.state.customBackground.map((_url, index) => (
            <Fragment key={index}>
              <input type='text' value={this.state.customBackground[index]} onChange={(e) => this.customBackground(e, true, index)}></input>
              {this.state.customBackground.length > 1 ? <button className='cleanButton' onClick={() => this.modifyCustomBackground('remove', index)}>
                <Cancel/>
              </button> : null}
              <span className='modalLink' onClick={() => this.uploadCustombackground(index)}>{getMessage('modals.main.settings.sections.background.source.upload')}</span>
              {this.videoCustomSettings(index)}
              <br/><br/>  
            </Fragment>
          ))}
          <button className='uploadbg' onClick={() => this.modifyCustomBackground('add')}>{getMessage('modals.main.settings.sections.background.source.add_background')}</button>
          <FileUpload id='bg-input' accept='image/jpeg, image/png, image/webp, image/webm, image/gif, video/mp4, video/webm, video/ogg' loadFunction={(e) => this.customBackground(e, false, this.state.currentBackgroundIndex)} />
          {interval}
        </ul>
      </>
    );

    switch (this.state.backgroundType) {
      case 'custom': backgroundSettings = customSettings; break;
      case 'colour': backgroundSettings = <ColourSettings/>; break;
      default: backgroundSettings = APISettings; break;
    }

    if (localStorage.getItem('photo_packs') && this.state.backgroundType !== 'custom' && this.state.backgroundType !== 'colour' && this.state.backgroundType !== 'api') {
      backgroundSettings = null;
    }
  
    return (
      <>
        <h2>{getMessage('modals.main.settings.sections.background.title')}</h2>
        <Switch name='background' text={getMessage('modals.main.settings.enabled')} category='background' element='#backgroundImage' />
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
        <Checkbox name='view' text={getMessage('modals.main.settings.sections.background.buttons.view')} category='navbar' />
        <Checkbox name='favouriteEnabled' text={getMessage('modals.main.settings.sections.background.buttons.favourite')} category='navbar' />
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
