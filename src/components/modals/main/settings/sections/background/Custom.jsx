import variables from 'modules/variables';
import { PureComponent } from 'react';
import { toast } from 'react-toastify';
import { Cancel, AddLink, AddPhotoAlternate, PersonalVideo } from '@mui/icons-material';
import EventBus from 'modules/helpers/eventbus';

import Checkbox from '../../Checkbox';
import FileUpload from '../../FileUpload';

import Modal from 'react-modal';

import CustomURLModal from './CustomURLModal';

export default class CustomSettings extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      customBackground: this.getCustom(),
      customURLModal: false
    };
  }

  resetCustom = () => {
    localStorage.setItem('customBackground', '[]');
    this.setState({
      customBackground: []
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
    document.querySelector('.reminder-info').style.display = 'block';
    localStorage.setItem('showReminder', true);
  }

  videoCheck(url) {
    return url.startsWith('data:video/') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  }
    
  videoCustomSettings = () => {
    const hasVideo = this.state.customBackground.filter(bg => this.videoCheck(bg));

    if (hasVideo.length > 0) { 
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
    
  uploadCustomBackground() {
    document.getElementById('bg-input').setAttribute('index', this.state.customBackground.length);
    document.getElementById('bg-input').click();
    // to fix loadFunction
    this.setState({
      currentBackgroundIndex: this.state.customBackground.length
    });
  }

  addCustomURL(e) {
    this.setState({
      customURLModal: false,
      currentBackgroundIndex: this.state.customBackground.length
    });
    this.customBackground({ target: { value: e }}, true, this.state.customBackground.length);
  }

  render() {
    return (
      <ul>
        <p>{this.getMessage('modals.main.settings.sections.background.source.custom_background')} <span className='modalLink' onClick={this.resetCustom}>{this.getMessage('modals.main.settings.buttons.reset')}</span></p>
        <div className='data-buttons-row'>
          <button onClick={() => this.uploadCustomBackground()}>{this.getMessage('modals.main.settings.sections.background.source.add_background')} <AddPhotoAlternate/></button>
          <button onClick={() => this.setState({ customURLModal: true })}>{this.getMessage('modals.main.settings.sections.background.source.add_url')} <AddLink/></button>
        </div>
        <div className='images-row'>
          {this.state.customBackground.map((url, index) => (
            <div style={{ backgroundImage: `url(${!this.videoCheck(url) ? this.state.customBackground[index] : ''})` }} key={index}>
              {this.videoCheck(url) ? <PersonalVideo className='customvideoicon'/> : null} 
              {this.state.customBackground.length > 0 ? <button className='cleanButton' onClick={() => this.modifyCustomBackground('remove', index)}>
                <Cancel/>
              </button> : null}
            </div>
          ))}
        </div>
        <FileUpload id='bg-input' accept='image/jpeg, image/png, image/webp, image/webm, image/gif, video/mp4, video/webm, video/ogg' loadFunction={(e) => this.customBackground(e, false, this.state.currentBackgroundIndex)} />
        {this.props.interval}
        {this.videoCustomSettings()}
        <Modal closeTimeoutMS={100} onRequestClose={() => this.setState({ customURLModal: false })} isOpen={this.state.customURLModal} className='Modal resetmodal mainModal' overlayClassName='Overlay resetoverlay' ariaHideApp={false}>
          <CustomURLModal modalClose={(e) => this.addCustomURL(e)} modalCloseOnly={() => this.setState({ customURLModal: false })} />
        </Modal>
      </ul>
    );
  }
}
