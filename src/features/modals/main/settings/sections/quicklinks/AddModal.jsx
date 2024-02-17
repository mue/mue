import variables from 'modules/variables';

import { useState, memo } from 'react';
import { TextareaAutosize } from '@mui/material';
import { MdAddLink, MdClose } from 'react-icons/md';
import Tooltip from 'features/helpers/tooltip/Tooltip';

function AddModal({ urlError, iconError, addLink, closeModal, edit, editData, editLink }) {
  const [name, setName] = useState(edit ? editData.name : '');
  const [url, setUrl] = useState(edit ? editData.url : '');
  const [icon, setIcon] = useState(edit ? editData.icon : '');

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
        <TextareaAutosize
          maxRows={1}
          placeholder={variables.getMessage('widgets.quicklinks.name')}
          value={name}
          onChange={(e) => setName(e.target.value.replace(/(\r\n|\n|\r)/gm, ''))}
          style={{ gridColumn: 'span 2' }}
        />
        <TextareaAutosize
          maxRows={10}
          placeholder={variables.getMessage('widgets.quicklinks.url')}
          value={url}
          onChange={(e) => setUrl(e.target.value.replace(/(\r\n|\n|\r)/gm, ''))}
        />
        <TextareaAutosize
          maxRows={10}
          maxLines={1}
          placeholder={variables.getMessage('widgets.quicklinks.icon')}
          value={icon}
          onChange={(e) => setIcon(e.target.value.replace(/(\r\n|\n|\r)/gm, ''))}
        />
      </div>
      <div className="addFooter">
        <span className="dropdown-error">
          {iconError} {urlError}
        </span>
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
            className="btn-settings"
            onClick={() => addLink(name, url, icon)}
          >
            <MdAddLink /> {variables.getMessage('widgets.quicklinks.add')}
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(AddModal);
