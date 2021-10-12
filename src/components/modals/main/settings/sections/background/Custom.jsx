import variables from 'modules/variables';
import { PureComponent, Fragment } from 'react';
import { toast } from 'react-toastify';
import { Cancel } from '@mui/icons-material';
import { TextField } from '@mui/material';

import Checkbox from '../../Checkbox';
import FileUpload from '../../FileUpload';

export default class CustomSettings extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      customBackground: this.getCustom()
    };
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

  render() {
    return (
      <ul>
        <p>{this.getMessage('modals.main.settings.sections.background.source.custom_background')} <span className='modalLink' onClick={this.resetCustom}>{this.getMessage('modals.main.settings.buttons.reset')}</span></p>
        {this.state.customBackground.map((_url, index) => (
          <Fragment key={index}>
            <TextField value={this.state.customBackground[index]} onChange={(e) => this.customBackground(e, true, index)} autoComplete='off' autoCorrect='off' autoCapitalize='off' spellCheck={false} varient='outlined' />
            {this.state.customBackground.length > 1 ? <button className='cleanButton' onClick={() => this.modifyCustomBackground('remove', index)}>
              <Cancel/>
            </button> : null}
            <span className='modalLink' onClick={() => this.uploadCustombackground(index)}>{this.getMessage('modals.main.settings.sections.background.source.upload')}</span>
            {this.videoCustomSettings(index)}
          </Fragment>
        ))}
        <br/><br/>
        <button className='uploadbg' onClick={() => this.modifyCustomBackground('add')}>{this.getMessage('modals.main.settings.sections.background.source.add_background')}</button>
        <br/><br/>
        <FileUpload id='bg-input' accept='image/jpeg, image/png, image/webp, image/webm, image/gif, video/mp4, video/webm, video/ogg' loadFunction={(e) => this.customBackground(e, false, this.state.currentBackgroundIndex)} />
        {this.props.interval}
      </ul>
    );
  }
}
