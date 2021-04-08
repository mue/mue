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
      backgroundType: localStorage.getItem('backgroundType') || 'api'
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
          <Checkbox name='backgroundVideoLoop' text='Loop Video'/>
          <Checkbox name='backgroundVideoMute' text='Mute Video'/>
        </>
      )
    } else {
      return null;
    }
  }

  componentDidUpdate() {
    localStorage.setItem('customBackground', this.state.customBackground);
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
          <option value='wildlife'>Landscapes</option>
          <option value='wildlife'>Wildlife</option>
          <option value='nature'>Vehicles</option>
          <option value='nature'>Cities</option>
          <option value='nature'>Castles</option>
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

        <h3>{background.buttons.title}</h3>
        <Checkbox name='view' text={background.buttons.view} />
        <Checkbox name='favouriteEnabled' text={background.buttons.favourite} />
        <Checkbox name='downloadbtn' text={background.buttons.download}/>

        <h3>{background.effects.title}</h3>
        <Slider title={background.effects.blur} name='blur' min='0' max='100' default='0' display='%' />
        <Slider title={background.effects.brightness} name='brightness' min='0' max='100' default='100' display='%' />
        <br/><br/>
  
        <Dropdown label='Type' name='backgroundType' onChange={(value) => this.setState({ backgroundType: value })}>
          <option value='api'>{background.type.api}</option>
          <option value='custom'>{background.type.custom_image}</option>
          <option value='colour'>{background.type.custom_colour}</option>
        </Dropdown>
        <br/>

        {backgroundSettings}
      </>
    );
  }
}
