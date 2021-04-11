import React from 'react';

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
  }

  resetCustom() {
    localStorage.setItem('customBackground', '');
    this.setState({
      customBackground: ''
    });
    toast(this.language.toasts.reset);
  }

  fileUpload(e) {
    localStorage.setItem('customBackground', e.target.result);
    this.setState({
      customBackground: e.target.result
    });
  }

  videoCustomSettings = () => {
    const customBackground = this.state.customBackground;

    if (customBackground.endsWith('.mp4') || customBackground.endsWith('.webm') || customBackground.endsWith('.ogg')) { 
      return (
        <>
          <Checkbox name='backgroundVideoLoop' text={this.language.sections.background.source.loop_video}/>
          <Checkbox name='backgroundVideoMute' text={this.language.sections.background.source.mute_video}/>
        </>
      )
    } else {
      return null;
    }
  }

  marketplaceType = () => {
    if (localStorage.getItem('photo_packs')) {
      return <option value='photo_pack'>{window.language.modals.main.navbar.marketplace}</option>
    }
  }

  componentDidUpdate() {
    localStorage.setItem('customBackground', this.state.customBackground);
  }

  async getBackgroundCategories() {
    const data = await (await fetch(window.constants.API_URL + '/images/categories')).json();
    this.setState({
      backgroundCategories: data
    });
  }

  componentDidMount() {
    this.getBackgroundCategories();
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
        <Radio title={background.source.api} options={apiOptions} name='backgroundAPI'/>
        <br/>
        <Dropdown label='Category' name='apiCategory'>
          {this.state.backgroundCategories.map((category) => (
            <option value={category} key={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
          ))}
        </Dropdown>
      </>
    );

    const customSettings = (
      <>
        <ul>
          <p>{background.source.custom_url} <span className='modalLink' onClick={() => this.resetCustom()}>{this.language.buttons.reset}</span></p>
          <input type='text' value={this.state.customBackground} onChange={(e) => this.setState({ customBackground: e.target.value })}></input>
        </ul>
        {this.videoCustomSettings()}
        <ul>
          <p>{background.source.custom_background} <span className='modalLink' onClick={() => this.resetCustom()}>{this.language.buttons.reset}</span></p>
          <button className='uploadbg' onClick={() => document.getElementById('bg-input').click()}>{background.source.upload}</button>
          <FileUpload id='bg-input' accept='image/jpeg, image/png, image/webp, image/webm, image/gif' loadFunction={(e) => this.fileUpload(e)} />
        </ul>
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
        <Switch name='background' text={this.language.enabled} />
        <Checkbox name='ddgProxy' text={background.ddg_proxy} />
        <Checkbox name='bgtransition' text={background.transition} />

        <h3>{background.source.title}</h3>
        <Dropdown label={background.type.title} name='backgroundType' onChange={(value) => this.setState({ backgroundType: value })}>
          {this.marketplaceType()}
          <option value='api'>{background.type.api}</option>
          <option value='custom'>{background.type.custom_image}</option>
          <option value='colour'>{background.type.custom_colour}</option>
        </Dropdown>
        <br/>

        {backgroundSettings}

        <h3>{background.buttons.title}</h3>
        <Checkbox name='view' text={background.buttons.view} />
        <Checkbox name='favouriteEnabled' text={background.buttons.favourite} />
        <Checkbox name='downloadbtn' text={background.buttons.download}/>

        <h3>{background.effects.title}</h3>
        <Slider title={background.effects.blur} name='blur' min='0' max='100' default='0' display='%' />
        <Slider title={background.effects.brightness} name='brightness' min='0' max='100' default='100' display='%' />
        <br/><br/>
      </>
    );
  }
}
