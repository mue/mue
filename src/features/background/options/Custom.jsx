import variables from 'config/variables';
import { memo, useRef, useState, useEffect, useCallback } from 'react';
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

const getCustom = () => {
  let data;
  try {
    data = JSON.parse(localStorage.getItem('customBackground'));
  } catch (e) {
    data = [localStorage.getItem('customBackground')];
  }
  return data;
};

const CustomSettings = memo(() => {
  const [customBackground, setCustomBackground] = useState(getCustom());
  const [customURLModal, setCustomURLModal] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const customDnd = useRef(null);

  const resetCustom = useCallback(() => {
    localStorage.setItem('customBackground', '[]');
    setCustomBackground([]);
    toast(variables.getMessage('toasts.reset'));
    EventBus.emit('refresh', 'background');
  }, []);

  const handleCustomBackground = useCallback((e, index) => {
    const result = e.target.result;

    setCustomBackground((prev) => {
      const updated = [...prev];
      updated[index || updated.length] = result;
      localStorage.setItem('customBackground', JSON.stringify(updated));
      document.querySelector('.reminder-info').style.display = 'flex';
      localStorage.setItem('showReminder', true);
      return updated;
    });
  }, []);

  const modifyCustomBackground = useCallback((type, index) => {
    setCustomBackground((prev) => {
      const updated = [...prev];
      if (type === 'add') {
        updated.push('');
      } else {
        updated.splice(index, 1);
      }
      localStorage.setItem('customBackground', JSON.stringify(updated));
      document.querySelector('.reminder-info').style.display = 'flex';
      localStorage.setItem('showReminder', true);
      return updated;
    });
  }, []);

  const uploadCustomBackground = useCallback(() => {
    const newIndex = customBackground.length;
    document.getElementById('bg-input').setAttribute('index', newIndex);
    document.getElementById('bg-input').click();
    setCurrentBackgroundIndex(newIndex);
  }, [customBackground.length]);

  const addCustomURL = useCallback((e) => {
    // regex: https://ihateregex.io/expr/url/
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b([-a-zA-Z0-9()!@:%_.~#?&=]*)/;
    if (urlRegex.test(e) === false) {
      return setUrlError(variables.getMessage('widgets.quicklinks.url_error'));
    }

    const newIndex = customBackground.length;
    setCustomURLModal(false);
    setCurrentBackgroundIndex(newIndex);
    handleCustomBackground({ target: { result: e } }, newIndex);
  }, [customBackground.length, handleCustomBackground]);

  useEffect(() => {
    const dnd = customDnd.current;
    if (!dnd) return;

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
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

        const reader = new FileReader();
        reader.onloadend = () => {
          handleCustomBackground({ target: { result: reader.result } }, currentBackgroundIndex);
        };
        reader.readAsDataURL(file);
        return;
      }

      compressAccurately(file, {
        size: 450,
        accuracy: 0.9,
      }).then(async (res) => {
        if (settingsSize + res.size > 4850000) {
          return toast(variables.getMessage('toasts.no_storage'));
        }

        handleCustomBackground(
          {
            target: {
              result: await filetoDataURL(res),
            },
          },
          currentBackgroundIndex,
        );
      });
    };

    dnd.ondragover = handleDragOver;
    dnd.ondragenter = handleDragOver;
    dnd.ondrop = handleDrop;

    return () => {
      if (dnd) {
        dnd.ondragover = null;
        dnd.ondragenter = null;
        dnd.ondrop = null;
      }
    };
  }, [currentBackgroundIndex, handleCustomBackground]);

  const hasVideo = customBackground.filter((bg) => videoCheck(bg)).length > 0;

  return (
    <>
      <div className="dropzone" ref={customDnd}>
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
              onClick={uploadCustomBackground}
              icon={<MdOutlineFileUpload />}
              label={variables.getMessage(
                'modals.main.settings.sections.background.source.upload',
              )}
            />
            <Button
              type="settings"
              onClick={() => setCustomURLModal(true)}
              icon={<MdAddLink />}
              label={variables.getMessage(
                'modals.main.settings.sections.background.source.add_url',
              )}
            />
          </div>
        </div>
        <div className="dropzone-content">
          {customBackground.length > 0 ? (
            <div className="images-row">
              {customBackground.map((url, index) => (
                <div key={index}>
                  <img
                    alt={'Custom background ' + (index || 0)}
                    src={`${!videoCheck(url) ? customBackground[index] : ''}`}
                  />
                  {videoCheck(url) && <MdPersonalVideo className="customvideoicon" />}
                  {customBackground.length > 0 && (
                    <Tooltip
                      title={variables.getMessage(
                        'modals.main.settings.sections.background.source.remove',
                      )}
                    >
                      <Button
                        type="settings"
                        onClick={() => modifyCustomBackground('remove', index)}
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
                  onClick={uploadCustomBackground}
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
        loadFunction={(e) => handleCustomBackground(e, currentBackgroundIndex)}
      />
      {hasVideo && (
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
      )}
      <Modal
        closeTimeoutMS={100}
        onRequestClose={() => setCustomURLModal(false)}
        isOpen={customURLModal}
        className="Modal resetmodal mainModal"
        overlayClassName="Overlay resetoverlay"
        ariaHideApp={false}
      >
        <CustomURLModal
          modalClose={addCustomURL}
          urlError={urlError}
          modalCloseOnly={() => setCustomURLModal(false)}
        />
      </Modal>
    </>
  );
});

CustomSettings.displayName = 'CustomSettings';

export default CustomSettings;
