import { useState } from 'react';
import variables from 'config/variables';
import { MdClose } from 'react-icons/md';
import { Button } from 'components/Elements';

const FolderTaggingModal = ({ files, onConfirm, onCancel }) => {
  const [folderName, setFolderName] = useState('');

  const handleConfirm = () => {
    onConfirm(folderName.trim());
  };

  return (
    <div className="smallModal">
      <div className="shareHeader">
        <span className="title">
          {variables.getMessage('modals.main.settings.sections.background.source.tag_images')}
        </span>
        <button className="closeModal" onClick={onCancel}>
          <MdClose />
        </button>
      </div>
      <div className="taggingModalContent">
        <p className="subtitle">
          {variables.getMessage('modals.main.settings.sections.background.source.tag_description', {
            count: files.length,
          })}
        </p>
        <div className="taggingInput">
          <label>
            {variables.getMessage('modals.main.settings.sections.background.source.folder_name')}
          </label>
          <input
            type="text"
            placeholder={variables.getMessage(
              'modals.main.settings.sections.background.source.folder_placeholder',
            )}
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleConfirm();
              }
            }}
            autoFocus
          />
        </div>
      </div>
      <div className="resetFooter">
        <Button
          type="settings"
          onClick={onCancel}
          label={variables.getMessage('modals.main.settings.buttons.cancel')}
        />
        <Button
          type="settings"
          onClick={handleConfirm}
          label={variables.getMessage('modals.main.settings.buttons.continue')}
        />
      </div>
    </div>
  );
};

export default FolderTaggingModal;
