import { useState } from 'react';
import { TextareaAutosize } from '@mui/material';
import { MdAddLink, MdClose } from 'react-icons/md';
import Tooltip from 'components/helpers/tooltip/Tooltip';

import variables from 'modules/variables';

export default function AddModal({ urlError, addLink, closeModal, edit, editData, editLink }) {
  const [name, setName] = useState(edit ? editData.name : '');
  const [url, setUrl] = useState(edit ? editData.url : '');
  const [icon, setIcon] = useState(edit ? editData.url : '');

  return (
    <div className="smallModal">
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
          onChange={(e) => setName(e.target.value)}
        />
        <span className="dropdown-error" />
        <TextareaAutosize
          maxRows={10}
          placeholder={variables.getMessage('widgets.quicklinks.url')}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <span className="dropdown-error">{urlError}</span>
        <TextareaAutosize
          maxRows={10}
          placeholder={variables.getMessage('widgets.quicklinks.icon')}
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        />
        <span className="dropdown-error" />
        {edit ? (
          <button onClick={() => editLink(editData, name, url, icon)}>
            <MdAddLink /> Edit
          </button>
        ) : (
          <button onClick={() => addLink(name, url, icon)}>
            <MdAddLink /> {variables.getMessage('widgets.quicklinks.add')}
          </button>
        )}
      </div>
    </div>
  );
}
