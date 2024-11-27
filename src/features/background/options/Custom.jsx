import variables from 'config/variables';
import { PureComponent, createRef } from 'react';
import { toast } from 'react-toastify';
import {
  MdCancel,
  MdAddLink,
  MdAddPhotoAlternate,
  MdOutlineFileUpload,
  MdFolder,
} from 'react-icons/md';
import { addCustomImage, getCustomImages, deleteCustomImage } from 'utils/indexedDB';

import { Tooltip, Button } from 'components/Elements';
import Modal from 'react-modal';

import CustomURLModal from './CustomURLModal';

export default class CustomSettings extends PureComponent {
  getMessage = (text, obj) => variables.getMessage(text, obj || {});

  constructor() {
    super();
    this.state = {
      customBackground: [],
      customURLModal: false,
      urlError: '',
      isDragging: false,
    };
    this.customDnd = createRef(null);
  }

  componentDidMount() {
    this.loadCustomImages();

    const dnd = this.customDnd.current;
    dnd.ondragover = dnd.ondragenter = (e) => {
      e.preventDefault();
      this.setState({ isDragging: true });
    };

    dnd.ondragleave = (e) => {
      e.preventDefault();
      this.setState({ isDragging: false });
    };

    dnd.ondrop = (e) => {
      e.preventDefault();
      this.setState({ isDragging: false });
      const files = Array.from(e.dataTransfer.files);
      this.handleFileUpload(files);
    };
  }

  loadCustomImages = () => {
    getCustomImages().then((images) => {
      this.setState({ customBackground: images });
    });
  };

  addCustomImage = (image) => {
    addCustomImage({ url: image }).then(() => {
      this.loadCustomImages();
      toast(variables.getMessage('toasts.upload_success'));
    });
  };

  removeCustomImage = (id) => {
    deleteCustomImage(id).then(() => {
      this.loadCustomImages();
      toast(variables.getMessage('toasts.remove_success'));
    });
  };

  uploadCustomBackground = () => {
    document.getElementById('bg-input').click();
  };

  handleFileUpload = (files) => {
    const maxSize = 5 * 1024 * 1024; // 5MB size limit
    files.forEach((file) => {
      if (file.size > maxSize) {
        toast.error(variables.getMessage('toasts.upload_size_error'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        this.addCustomImage(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  render() {
    return (
      <>
        <div ref={this.customDnd}>
          <div className="imagesTopBar">
            <div>
              <MdAddPhotoAlternate />
              <div>
                <span className="title">
                  {variables.getMessage('settings:sections.background.source.custom_title')}
                </span>
                <span className="subtitle">
                  {variables.getMessage('settings:sections.background.source.custom_description')}
                </span>
              </div>
            </div>
            <div className="topbarbuttons">
              <Button
                type="settings"
                onClick={this.uploadCustomBackground}
                icon={<MdOutlineFileUpload />}
                label={variables.getMessage('settings:sections.background.source.upload')}
              />
              <Button
                type="settings"
                onClick={() => this.setState({ customURLModal: true })}
                icon={<MdAddLink />}
                label={variables.getMessage('settings:sections.background.source.add_url')}
              />
            </div>
          </div>
          <div className={`dropzone dropzone-content ${this.state.isDragging ? 'dragging' : ''}`}>
            {this.state.customBackground.length > 0 ? (
              <div className="images-row fixed-width">
                {this.state.customBackground.map((image, index) => (
                  <div key={index} className="image-container">
                    <img alt={'Custom background ' + index} src={image.url} />
                    <Tooltip
                      title={variables.getMessage('settings:sections.background.source.remove')}
                    >
                      <Button
                        type="settings"
                        onClick={() => this.removeCustomImage(image.id)}
                        icon={<MdCancel />}
                      />
                    </Tooltip>
                  </div>
                ))}
              </div>
            ) : (
              <div className="photosEmpty">
                <div className="emptyNewMessage">
                  <MdAddPhotoAlternate />
                  <span className="title">
                    {variables.getMessage('settings:sections.background.source.drop_to_upload')}
                  </span>
                  <span className="subtitle">
                    {variables.getMessage('settings:sections.background.source.formats', {
                      list: 'jpeg, png, webp, webm, gif, mp4, webm, ogg',
                    })}
                  </span>
                  <Button
                    type="settings"
                    onClick={this.uploadCustomBackground}
                    icon={<MdFolder />}
                    label={variables.getMessage('settings:sections.background.source.select')}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <input
          type="file"
          id="bg-input"
          accept="image/jpeg, image/png, image/webp, image/webm, image/gif, video/mp4, video/webm, video/ogg"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            const files = Array.from(e.target.files);
            this.handleFileUpload(files);
          }}
        />
        <Modal
          closeTimeoutMS={100}
          onRequestClose={() => this.setState({ customURLModal: false })}
          isOpen={this.state.customURLModal}
          className="Modal resetmodal mainModal"
          overlayClassName="Overlay resetoverlay"
          ariaHideApp={false}
        >
          <CustomURLModal
            modalClose={(e) => this.addCustomImage(e)}
            urlError={this.state.urlError}
            modalCloseOnly={() => this.setState({ customURLModal: false })}
          />
        </Modal>
      </>
    );
  }
}
