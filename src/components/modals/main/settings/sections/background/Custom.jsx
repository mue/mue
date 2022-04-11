import variables from 'modules/variables';
import { PureComponent } from 'react';
import { toast } from 'react-toastify';
import { MdCancel, MdAddLink, MdAddPhotoAlternate, MdPersonalVideo } from 'react-icons/md';
import EventBus from 'modules/helpers/eventbus';

import Checkbox from '../../Checkbox';
import FileUpload from '../../FileUpload';
import SettingsItem from '../../SettingsItem';

import Modal from 'react-modal';

import CustomURLModal from './CustomURLModal';

export default class CustomSettings extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      customBackground: this.getCustom(),
      customURLModal: false,
    };
  }

  resetCustom = () => {
    localStorage.setItem('customBackground', '[]');
    this.setState({
      customBackground: [],
    });
    toast(this.getMessage('toasts.reset'));
    EventBus.dispatch('refresh', 'background');
  };

  customBackground(e, text, index) {
    const result = text === true ? e.target.value : e.target.result;

    const customBackground = this.state.customBackground;
    customBackground[index] = result;
    this.setState({
      customBackground,
    });
    this.forceUpdate();

    localStorage.setItem('customBackground', JSON.stringify(customBackground));
    document.querySelector('.reminder-info').style.display = 'flex';
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
      customBackground,
    });
    this.forceUpdate();

    localStorage.setItem('customBackground', JSON.stringify(customBackground));
    document.querySelector('.reminder-info').style.display = 'flex';
    localStorage.setItem('showReminder', true);
  }

  videoCheck(url) {
    return (
      url.startsWith('data:video/') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.ogg')
    );
  }

  videoCustomSettings = () => {
    const hasVideo = this.state.customBackground.filter((bg) => this.videoCheck(bg));

    if (hasVideo.length > 0) {
      return (
        <>
          <Checkbox
            name="backgroundVideoLoop"
            text={this.getMessage('modals.main.settings.sections.background.source.loop_video')}
          />
          <Checkbox
            name="backgroundVideoMute"
            text={this.getMessage('modals.main.settings.sections.background.source.mute_video')}
          />
        </>
      );
    } else {
      return null;
    }
  };

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
      currentBackgroundIndex: this.state.customBackground.length,
    });
  }

  addCustomURL(e) {
    this.setState({
      customURLModal: false,
      currentBackgroundIndex: this.state.customBackground.length,
    });
    this.customBackground({ target: { value: e } }, true, this.state.customBackground.length);
  }

  render() {
    return (
      <>
        {this.props.interval}
        <div className="settingsRow" style={{ alignItems: 'flex-start' }}>
          <div className="content">
            <div className="images-row">
              {this.state.customBackground.map((url, index) => (
                <div key={index}>
                  <img
                    alt={'Custom background ' + (index || 0)}
                    src={`${!this.videoCheck(url) ? this.state.customBackground[index] : ''}`}
                  />
                  {this.videoCheck(url) ? <MdPersonalVideo className="customvideoicon" /> : null}
                  {this.state.customBackground.length > 0 ? (
                    <button
                      className="iconButton"
                      onClick={() => this.modifyCustomBackground('remove', index)}
                    >
                      <MdCancel />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div className="action">
            {/*<button onClick={() => this.uploadCustomBackground()}>{this.getMessage('modals.main.settings.sections.background.source.add_background')} <MdAddPhotoAlternate/></button>*/}
            <div className="dropzone">
              <MdAddPhotoAlternate />
              <span className="title">Drop to upload</span>
              <span className="subtitle">
                Available formats, jpeg, png, webp, webm, gif, mp4, webm, ogg
              </span>
              <button onClick={() => this.uploadCustomBackground()}>Or Select</button>
            </div>
            <button onClick={() => this.setState({ customURLModal: true })}>
              {this.getMessage('modals.main.settings.sections.background.source.add_url')}{' '}
              <MdAddLink />
            </button>
            {/*<span className='subtitle'>
              {this.getMessage('modals.main.settings.sections.background.source.custom_background')}{' '}
              <span className="link" onClick={this.resetCustom}>
                {this.getMessage('modals.main.settings.buttons.reset')}
              </span>
                  </span>*/}
          </div>
        </div>
        <FileUpload
          id="bg-input"
          accept="image/jpeg, image/png, image/webp, image/webm, image/gif, video/mp4, video/webm, video/ogg"
          loadFunction={(e) => this.customBackground(e, false, this.state.currentBackgroundIndex)}
        />
        {this.videoCustomSettings()}
        <Modal
          closeTimeoutMS={100}
          onRequestClose={() => this.setState({ customURLModal: false })}
          isOpen={this.state.customURLModal}
          className="Modal resetmodal mainModal"
          overlayClassName="Overlay resetoverlay"
          ariaHideApp={false}
        >
          <CustomURLModal
            modalClose={(e) => this.addCustomURL(e)}
            modalCloseOnly={() => this.setState({ customURLModal: false })}
          />
        </Modal>
      </>
    );
  }
}
