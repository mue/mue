import variables from 'modules/variables';
import { useState, memo } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import Tooltip from '../../../../../helpers/tooltip/Tooltip';

function CustomURLModal({ modalClose, modalCloseOnly }) {
  const [url, setURL] = useState();

  return (
    <div className="smallModal">
      <div className="shareHeader">
        <span className="title">
          {variables.getMessage('modals.main.settings.sections.background.source.add_url')}
        </span>
        <Tooltip
          title={variables.getMessage('modals.main.settings.sections.advanced.reset_modal.cancel')}
        >
          <div className="close" onClick={modalCloseOnly}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <div className="copy">
        <input
          type="text"
          value={url}
          onChange={(e) => setURL(e.target.value)}
          varient="outlined"
        />
        <Tooltip
          title={variables.getMessage('modals.main.settings.sections.background.source.add_url')}
          placement="top"
        >
          <button onClick={() => modalClose(url)}>
            <MdAdd />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default memo(CustomURLModal);
