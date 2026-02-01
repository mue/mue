import variables from 'config/variables';

import { useState, memo } from 'react';
import { MdAddLink, MdClose } from 'react-icons/md';
import { Tooltip } from 'components/Elements';
import { Button } from 'components/Elements';
import { Dropdown, Text } from 'components/Form/Settings';
import { IconService } from 'utils/quicklinks';

import './AddModal.scss';

function AddModal({ urlError, iconError, addLink, closeModal, edit, editData, editLink }) {
  const [name, setName] = useState(edit ? editData.name : '');
  const [url, setUrl] = useState(edit ? editData.url : '');
  const [icon, setIcon] = useState(edit ? editData.icon : '');
  const [iconType, setIconType] = useState(edit && editData.iconType ? editData.iconType : 'auto');
  const [iconData, setIconData] = useState(edit && editData.iconData ? editData.iconData : null);
  const [iconPreview, setIconPreview] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const handleIconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const dataUrl = await IconService.uploadCustomIcon(file);
      setIconData(dataUrl);
      setIconPreview(dataUrl);
      setUploadError('');
    } catch (e) {
      setUploadError(e.message);
    }
  };

  const handleSubmit = () => {
    if (edit) {
      editLink(editData, name, url, icon, iconType, iconData);
    } else {
      addLink(name, url, icon, iconType, iconData);
    }
  };

  return (
    <div className="addLinkModal">
      <div className="shareHeader">
        <span className="title">
          {edit
            ? variables.getMessage('widgets.quicklinks.edit')
            : variables.getMessage('widgets.quicklinks.new')}
        </span>
        <Tooltip title={variables.getMessage('modals.welcome.buttons.close')}>
          <div className="close" onClick={() => closeModal()}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <div className="quicklinkModalTextbox">
        <div className="addLinkModal-row">
          <div className="addLinkModal-field">
            <label className="addLinkModal-label">
              {variables.getMessage('widgets.quicklinks.name')}
            </label>
            <Text
              name="quicklink_modal_name"
              noSetting={true}
              onChange={(value) => setName(value)}
              placeholder="Enter link name (optional)"
            />
          </div>
          <div className="addLinkModal-field">
            <label className="addLinkModal-label">
              {variables.getMessage('widgets.quicklinks.url')}
              <span className="addLinkModal-required">*</span>
            </label>
            <Text
              name="quicklink_modal_url"
              noSetting={true}
              onChange={(value) => setUrl(value)}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="addLinkModal-dropdownWrapper">
          <Dropdown
            label="Icon Type"
            name="quicklink_modal_iconType"
            noSetting={true}
            onChange={(value) => setIconType(value)}
            items={[
              { value: 'auto', text: 'Auto-detect Icon' },
              { value: 'custom_url', text: 'Custom Icon URL' },
              { value: 'custom_upload', text: 'Upload Icon' },
              { value: 'emoji', text: 'Emoji' },
              { value: 'letter', text: 'Letter Avatar' },
            ]}
          />
        </div>

        {iconType === 'custom_url' && (
          <div className="text-field" style={{ gridColumn: 'span 2' }}>
            <Text
              name="quicklink_modal_icon_url"
              noSetting={true}
              onChange={(value) => setIcon(value)}
              placeholder="https://example.com/icon.png"
            />
          </div>
        )}
        {iconType === 'custom_upload' && (
          <div className="text-field" style={{ gridColumn: 'span 2' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleIconUpload}
              style={{ padding: '10px 0' }}
            />
            {iconPreview && (
              <img
                src={iconPreview}
                alt="Preview"
                style={{ width: '40px', height: '40px', marginTop: '8px', borderRadius: '4px' }}
              />
            )}
            {uploadError && (
              <span className="dropdown-error" style={{ display: 'block', marginTop: '4px' }}>
                {uploadError}
              </span>
            )}
          </div>
        )}
        {iconType === 'emoji' && (
          <div className="text-field" style={{ gridColumn: 'span 2' }}>
            <Text
              name="quicklink_modal_emoji"
              noSetting={true}
              onChange={(value) => setIcon(value)}
              placeholder="🚀"
            />
          </div>
        )}
      </div>
      <div className="addFooter">
        <span className="dropdown-error">
          {iconError} {urlError}
        </span>
        <Button
          type="settings"
          onClick={handleSubmit}
          icon={<MdAddLink />}
          label={
            edit
              ? variables.getMessage('modals.main.settings.sections.quicklinks.edit')
              : variables.getMessage('widgets.quicklinks.add')
          }
        />
      </div>
    </div>
  );
}

const MemoizedAddModal = memo(AddModal);
export { MemoizedAddModal as default, MemoizedAddModal as AddModal };
