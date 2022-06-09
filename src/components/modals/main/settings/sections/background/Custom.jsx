import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import { toast } from 'react-toastify';
import {
  MdCancel,
  MdAddLink,
  MdAddPhotoAlternate,
  MdPersonalVideo,
  MdOutlineFileUpload,
  MdFolder,
} from 'react-icons/md';
import EventBus from 'modules/helpers/eventbus';
import { compressAccurately, filetoDataURL } from 'image-conversion';
import { videoCheck } from 'modules/helpers/background/widget';

import Checkbox from '../../Checkbox';
import FileUpload from '../../FileUpload';

import Modal from 'react-modal';

import CustomURLModal from './CustomURLModal';

export default class CustomSettings extends PureComponent {
  getMessage = (text, obj) => variables.language.getMessage(variables.languagecode, text, obj || {});

  constructor() {
    super();
    this.state = {
      customBackground: this.getCustom(),
      customURLModal: false,
    };
    this.customDnd = createRef(null);
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

  componentDidMount() {
    const dnd = this.customDnd.current;
    dnd.ondragover = dnd.ondragenter = (e) => {
      e.preventDefault();
    };

    // todo: make this get from FileUpload.jsx to prevent duplication
    dnd.ondrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      const settings = {};

      Object.keys(localStorage).forEach((key) => {
        settings[key] = localStorage.getItem(key);
      });

      const settingsSize = new TextEncoder().encode(JSON.stringify(settings)).length;
      if (videoCheck(file.type) === true) {
        if (settingsSize + file.size > 4850000) {
          return toast(this.getMessage('toasts.no_storage'));
        }

        return this.customBackground(file, false, this.state.currentBackgroundIndex);
      }

      compressAccurately(file, 300).then(async (res) => {
        if (settingsSize + res.size > 4850000) {
          return toast(this.getMessage('toasts.no_storage'));
        }

        this.customBackground(await filetoDataURL(res), false, this.state.currentBackgroundIndex);
      });
      e.preventDefault();
    };
  }

  render() {
    return (
      <>
        {this.props.interval}

        {/*<div className="settingsRow settingsNoBorder" style={{ alignItems: 'flex-start' }}>
          <div className="content">
            {/*<div className="images-row">
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
            <div className="dropzone" ref={this.customDnd}>
              <MdAddPhotoAlternate />
              <span className="title">
                {this.getMessage('modals.main.settings.sections.background.source.drop_to_upload')}
              </span>
              <span className="subtitle">
                {this.getMessage(
                  'modals.main.settings.sections.background.source.available_formats',
                  {
                    formats: 'jpeg, png, webp, webm, gif, mp4, webm, ogg',
                  },
                )}
              </span>
              <button onClick={() => this.uploadCustomBackground()}>
                {this.getMessage('modals.main.settings.sections.background.source.select')}
              </button>
            </div>
            <button onClick={() => this.setState({ customURLModal: true })}>
              {this.getMessage('modals.main.settings.sections.background.source.add_url')}{' '}
              <MdAddLink />
            </button>
          </div>
        </div>*/}

        <div className="dropzone" ref={this.customDnd}>
          <div className="imagesTopBar">
            <div>
            <MdAddPhotoAlternate />
            <div>
              <span className="title">Custom Images</span>
              <span className="subtitle">Select images from your local computer</span>
            </div>
            </div>
            <div className='topbarbuttons'>
              <button onClick={() => this.uploadCustomBackground()}>
                Upload
                <MdOutlineFileUpload />
              </button>
              <button onClick={() => this.setState({ customURLModal: true })}>
                {this.getMessage('modals.main.settings.sections.background.source.add_url')}{' '}
                <MdAddLink />
              </button>
            </div>
          </div>
          <div className="dropzone-content">
            {this.state.customBackground.length > 0 ? (
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
            ) : (
              <div className="photosEmpty">
                <div className="emptyNewMessage">
                  <MdAddPhotoAlternate />
                  <span className="title">
                    {this.getMessage(
                      'modals.main.settings.sections.background.source.drop_to_upload',
                    )}
                  </span>
                  <span className="subtitle">
                    {this.getMessage(
                      'modals.main.settings.sections.background.source.formats',
                      {
                        list: 'jpeg, png, webp, webm, gif, mp4, webm, ogg',
                      },
                    )}
                  </span>
                  <button onClick={() => this.uploadCustomBackground()}>
                    {this.getMessage('modals.main.settings.sections.background.source.select')}
                    <MdFolder/>
                  </button>
                </div>
              </div>
            )}
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
