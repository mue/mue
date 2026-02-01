import variables from 'config/variables';

import { useState, memo, useEffect } from 'react';
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
  const [suggestedName, setSuggestedName] = useState('');
  const [resetKey, setResetKey] = useState(Date.now());

  // Reset form when modal opens for adding new link
  useEffect(() => {
    if (!edit) {
      // Clear localStorage for the form fields
      localStorage.removeItem('quicklink_modal_name');
      localStorage.removeItem('quicklink_modal_url');
      localStorage.removeItem('quicklink_modal_iconType');
      localStorage.removeItem('quicklink_modal_icon_url');
      localStorage.removeItem('quicklink_modal_emoji');

      // Reset all state
      setName('');
      setUrl('');
      setIcon('');
      setIconType('auto');
      setIconData(null);
      setIconPreview(null);
      setUploadError('');
      setSuggestedName('');

      // Change the key to force remount
      setResetKey(Date.now());
    }
  }, [edit]);

  // Extract domain name from URL as suggestion
  useEffect(() => {
    if (name || !url) {
      setSuggestedName('');
      return;
    }

    try {
      let urlToTest = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        urlToTest = 'https://' + url;
      }

      const domain = new URL(urlToTest).hostname;
      if (domain) {
        // Extract first part of domain (e.g., "google" from "google.com", "bbc" from "bbc.co.uk")
        const parts = domain.split('.');
        let name = parts[0];
        // Handle cases like "co.uk" where we want "bbc" not "co"
        if (parts.length > 2 && parts[parts.length - 2] === 'co') {
          name = parts[parts.length - 3];
        }
        setSuggestedName(name);
      }
    } catch (e) {
      setSuggestedName('');
    }
  }, [url, name]);

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
    // Use suggested name if no name was entered
    const finalName = name || suggestedName || '';

    if (edit) {
      editLink(editData, finalName, url, icon, iconType, iconData);
    } else {
      addLink(finalName, url, icon, iconType, iconData);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="addLinkModal" onKeyDown={handleKeyDown}>
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
            <div className="addLinkModal-labelRow">
              <label className="addLinkModal-label">
                {variables.getMessage('widgets.quicklinks.name')}
              </label>
              {suggestedName && !name && (
                <span className="addLinkModal-suggestedText">
                  Suggested: {suggestedName}
                </span>
              )}
            </div>
            <Text
              key={`name-${resetKey}`}
              name="quicklink_modal_name"
              noSetting={true}
              onChange={(value) => setName(value)}
              placeholder={suggestedName || 'Enter link name (optional)'}
            />
          </div>
          <div className="addLinkModal-field">
            <label className="addLinkModal-label">
              {variables.getMessage('widgets.quicklinks.url')}
              <span className="addLinkModal-required">*</span>
            </label>
            <Text
              key={`url-${resetKey}`}
              name="quicklink_modal_url"
              noSetting={true}
              onChange={(value) => {
                // Auto-add https:// if no protocol specified
                let finalValue = value;
                if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                  finalValue = 'https://' + value;
                }
                setUrl(finalValue);
              }}
              placeholder="example.com"
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
              key={`icon-url-${resetKey}`}
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
              key={`emoji-${resetKey}`}
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
