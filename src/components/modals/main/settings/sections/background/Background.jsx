import React from 'react';

import EventBus from '../../../../../../modules/helpers/eventbus';

import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import FileUpload from '../../FileUpload';
import Slider from '../../Slider';
import Switch from '../../Switch';
import Radio from '../../Radio';

import ColourSettings from './Colour';

import { toast } from 'react-toastify';

export default class BackgroundSettings extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      customBackground: localStorage.getItem('customBackground') || '',
      backgroundType: localStorage.getItem('backgroundType') || 'api',
      backgroundCategories: [window.language.modals.main.loading]
    };
    this.language = window.language.modals.main.settings;
    this.controller = new AbortController();
  }

  resetCustom = () => {
    localStorage.setItem('customBackground', '');
    this.setState({
      customBackground: ''
    });
    toast(window.language.toasts.reset);
    EventBus.dispatch('refresh', 'background');
  }

  customBackground(e, text) {
    const result = (text === true) ? e.target.value : e.target.result;
    localStorage.setItem('customBackground', result);
    this.setState({
      customBackground: result
    });
    EventBus.dispatch('refresh', 'background');
  }

  videoCustomSettings = () => {
    const customBackground = this.state.customBackground;

    if (customBackground.startsWith('data:video/') || customBackground.endsWith('.mp4') || customBackground.endsWith('.webm') || customBackground.endsWith('.ogg')) { 
      return (
        <>
          <Checkbox name='backgroundVideoLoop' text={this.language.sections.background.source.loop_video}/>
          <Checkbox name='backgroundVideoMute' text={this.language.sections.background.source.mute_video}/>
        </>
      );
    } else {
      return null;
    }
  }

  marketplaceType = () => {
    if (localStorage.getItem('photo_packs')) {
      return <option value='photo_pack'>{window.language.modals.main.navbar.marketplace}</option>;
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
        backgroundCategories: [window.language.modals.update.offline.title]
      });
    }

    this.getBackgroundCategories();
  }

  componentWillUnmount() {
    // stop making requests
    this.controller.abort();
  }

  render() {
    const { background } = this.language.sections;

    let backgroundSettings;

    const apiOptions = [
      {
        'name': 'Mue',
        'value': 'mue'
      },
      {
        'name': 'Unsplash',
        'value': 'unsplash'
      }
    ];

    const APISettings = (
      <>
        <br/>
        <Radio title={background.source.api} options={apiOptions} name='backgroundAPI' category='background'/>
        <br/>
        <Dropdown label={background.category} name='apiCategory'>
          {this.state.backgroundCategories.map((category) => (
            <option value={category} key={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
          ))}
        </Dropdown>
      </>
    );

    const customSettings = (
      <>
        <ul>
          <p>{background.source.custom_background} <span className='modalLink' onClick={this.resetCustom}>{this.language.buttons.reset}</span></p>
          <input type='text' value={this.state.customBackground} onChange={(e) => this.customBackground(e, true)}></input>
          <span className='modalLink' onClick={() => document.getElementById('bg-input').click()}>{background.source.upload}</span>
          <FileUpload id='bg-input' accept='image/jpeg, image/png, image/webp, image/webm, image/gif, video/mp4, video/webm, video/ogg' loadFunction={(e) => this.customBackground(e)} />
        </ul>
        {this.videoCustomSettings()}
      </>
    );

    switch (this.state.backgroundType) {
      case 'custom': backgroundSettings = customSettings; break;
      case 'colour': backgroundSettings = <ColourSettings/>; break;
      // API
      default: backgroundSettings = APISettings; break;
    }
  
    return (
      <>
        <h2>{background.title}</h2>
        <Switch name='background' text={this.language.enabled} category='background' />
        <Checkbox name='ddgProxy' text={background.ddg_proxy} />
        <Checkbox name='bgtransition' text={background.transition} />

        <h3>{background.source.title}</h3>
        <Dropdown label={background.type.title} name='backgroundType' onChange={(value) => this.setState({ backgroundType: value })} category='background'>
          {this.marketplaceType()}
          <option value='api'>{background.type.api}</option>
          <option value='custom'>{background.type.custom_image}</option>
          <option value='colour'>{background.type.custom_colour}</option>
        </Dropdown>
        <br/>

        {backgroundSettings}

        <h3>{background.buttons.title}</h3>
        <Checkbox name='view' text={background.buttons.view} element='.other' />
        <Checkbox name='favouriteEnabled' text={background.buttons.favourite} element='.other' />
        <Checkbox name='downloadbtn' text={background.buttons.download} element='.other' />

        <h3>{background.effects.title}</h3>
        <Slider title={background.effects.blur} name='blur' min='0' max='100' default='0' display='%' category='background' />
        <Slider title={background.effects.brightness} name='brightness' min='0' max='100' default='90' display='%' category='background' />
        <br/><br/>
      </>
    );
  }
}
