import variables from 'config/variables';
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
import EventBus from 'utils/eventbus';
import { compressAccurately, filetoDataURL } from 'image-conversion';
import videoCheck from '../api/videoCheck';

import { Checkbox, FileUpload } from 'components/Form/Settings';
import { Tooltip, Button } from 'components/Elements';
import Modal from 'react-modal';

import CustomURLModal from './CustomURLModal';
import defaults from './default';

export default class CustomSettings extends PureComponent {
  getMessage = (text, obj) => variables.getMessage(text, obj || {});

  constructor() {
    super();
    this.state = {
      customBackground: this.getCustom(),
      customURLModal: false,
      urlError: '',
    };
    this.customDnd = createRef(null);
  }

  resetCustom = () => {
    localStorage.setItem('customBackground', '[]');
    this.setState({
      customBackground: [],
    });
    toast(variables.getMessage('toasts.reset'));
    EventBus.emit('refresh', 'background');
  };

  customBackground(e, index) {
    const result = e.target.result;

    const customBackground = this.state.customBackground;
    customBackground[index || customBackground.length] = result;

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

  videoCustomSettings = () => {
    const hasVideo = this.state.customBackground.filter((bg) => videoCheck(bg));

    if (hasVideo.length > 0) {
      return (
        <>
          <Checkbox
            name="backgroundVideoLoop"
            text={variables.getMessage(
              'modals.main.settings.sections.background.source.loop_video',
            )}
          />
          <Checkbox
            name="backgroundVideoMute"
            text={variables.getMessage(
              'modals.main.settings.sections.background.source.mute_video',
            )}
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
      const custom = localStorage.getItem('customBackground');
      data = custom ? [custom] : defaults.customBackground
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
    // regex: https://ihateregex.io/expr/url/
    // eslint-disable-next-line no-useless-escape
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b([-a-zA-Z0-9()!@:%_.~#?&=]*)/;
    if (urlRegex.test(e) === false) {
      return this.setState({
        urlError: variables.getMessage('widgets.quicklinks.url_error'),
      });
    }

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
          return toast(variables.getMessage('toasts.no_storage'));
        }

        return this.customBackground(file, this.state.currentBackgroundIndex);
      }

      compressAccurately(file, {
        size: 450,
        accuracy: 0.9,
      }).then(async (res) => {
        if (settingsSize + res.size > 4850000) {
          return toast(variables.getMessage('toasts.no_storage'));
        }

        this.customBackground({
          target: {
            result: await filetoDataURL(res),
          }
        }, this.state.currentBackgroundIndex);
      });
      e.preventDefault();
    };
  }

  render() {
    return (
      <>
        <div className="dropzone" ref={this.customDnd}>
          <div className="imagesTopBar">
            <div>
              <MdAddPhotoAlternate />
              <div>
                <span className="title">
                  {variables.getMessage(
                    'modals.main.settings.sections.background.source.custom_title',
                  )}
                </span>
                <span className="subtitle">
                  {variables.getMessage(
                    'modals.main.settings.sections.background.source.custom_description',
                  )}
                </span>
              </div>
            </div>
            <div className="topbarbuttons">
              <Button
                type="settings"
                onClick={() => this.uploadCustomBackground()}
                icon={<MdOutlineFileUpload />}
                label={variables.getMessage(
                  'modals.main.settings.sections.background.source.upload',
                )}
              />
              <Button
                type="settings"
                onClick={() => this.setState({ customURLModal: true })}
                icon={<MdAddLink />}
                label={variables.getMessage(
                  'modals.main.settings.sections.background.source.add_url',
                )}
              />
            </div>
          </div>
          <div className="dropzone-content">
            {this.state.customBackground.length > 0 ? (
              <div className="images-row">
                {this.state.customBackground.map((url, index) => (
                  <div key={index}>
                    <img
                      alt={'Custom background ' + (index || 0)}
                      src={`${!videoCheck(url) ? this.state.customBackground[index] : ''}`}
                    />
                    {videoCheck(url) && <MdPersonalVideo className="customvideoicon" />}
                    {this.state.customBackground.length > 0 && (
                      <Tooltip
                        title={variables.getMessage(
                          'modals.main.settings.sections.background.source.remove',
                        )}
                      >
                        <Button
                          type="settings"
                          onClick={() => this.modifyCustomBackground('remove', index)}
                          icon={<MdCancel />}
                        />
                      </Tooltip>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="photosEmpty">
                <div className="emptyNewMessage">
                  <MdAddPhotoAlternate />
                  <span className="title">
                    {variables.getMessage(
                      'modals.main.settings.sections.background.source.drop_to_upload',
                    )}
                  </span>
                  <span className="subtitle">
                    {variables.getMessage(
                      'modals.main.settings.sections.background.source.formats',
                      {
                        list: 'jpeg, png, webp, webm, gif, mp4, webm, ogg',
                      },
                    )}
                  </span>
                  <Button
                    type="settings"
                    onClick={() => this.uploadCustomBackground()}
                    icon={<MdFolder />}
                    label={variables.getMessage(
                      'modals.main.settings.sections.background.source.select',
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <FileUpload
          id="bg-input"
          accept="image/jpeg, image/png, image/webp, image/webm, image/gif, video/mp4, video/webm, video/ogg"
          loadFunction={(e) => this.customBackground(e, this.state.currentBackgroundIndex)}
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
            urlError={this.state.urlError}
            modalCloseOnly={() => this.setState({ customURLModal: false })}
          />
        </Modal>
      </>
    );
  }
}
