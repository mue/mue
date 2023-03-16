import variables from 'modules/variables';

import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { TextareaAutosize } from '@mui/material';
import { MdAddLink, MdClose } from 'react-icons/md';
import Tooltip from 'components/helpers/tooltip/Tooltip';

function AddModal({ urlError, iconError, addLink, closeModal, edit, editData, editLink }) {
  const [name, setName] = useState(edit ? editData.name : '');
  const [url, setUrl] = useState(edit ? editData.url : '');
  const [icon, setIcon] = useState(edit ? editData.url : '');

  return (
    <div className="smallModal" style={{ width: '260px' }}>
      <div className="shareHeader">
        <span className="title">{variables.getMessage('widgets.quicklinks.new')}</span>
        <Tooltip title={variables.getMessage('modals.welcome.buttons.close')}>
          <div className="close" onClick={() => closeModal()}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <div className="quicklinkModalTextbox">
        <TextareaAutosize
          maxRows={1}
          placeholder={variables.getMessage('widgets.quicklinks.name')}
          value={name}
          onChange={(e) => setName(e.target.value.replace(/(\r\n|\n|\r)/gm, ''))}
        />
        <span className="dropdown-error" />
        <TextareaAutosize
          maxRows={10}
          placeholder={variables.getMessage('widgets.quicklinks.url')}
          value={url}
          onChange={(e) => setUrl(e.target.value.replace(/(\r\n|\n|\r)/gm, ''))}
        />
        <span className="dropdown-error">{urlError}</span>
        <TextareaAutosize
          maxRows={10}
          maxLines={1}
          placeholder={variables.getMessage('widgets.quicklinks.icon')}
          value={icon}
          onChange={(e) => setIcon(e.target.value.replace(/(\r\n|\n|\r)/gm, ''))}
        />
        <span className="dropdown-error">{iconError}</span>
        {edit ? (
          <button
            style={{
              height: '16px',
              fontSize: '15px',
            }}
            onClick={() => editLink(editData, name, url, icon)}
          >
            <MdAddLink /> {variables.getMessage('modals.main.settings.sections.quicklinks.edit')}
          </button>
        ) : (
          <button
            style={{
              height: '16px',
              fontSize: '15px',
            }}
            onClick={() => addLink(name, url, icon)}
          >
            <MdAddLink /> {variables.getMessage('widgets.quicklinks.add')}
          </button>
        )}
      </div>
    </div>
  );
}

AddModal.propTypes = {
  urlError: PropTypes.string.isRequired,
  iconError: PropTypes.string.isRequired,
  addLink: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
  editData: PropTypes.object.isRequired,
  editLink: PropTypes.func.isRequired,
};

export default memo(AddModal);
