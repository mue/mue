import variables from 'config/variables';
import { useState, memo } from 'react';
import { MdClose, MdOutlineAddLink } from 'react-icons/md';
import { Tooltip, Button } from 'components/Elements';

function CustomURLModal({ modalClose, urlError, modalCloseOnly }) {
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
      <input
        type="text"
        value={url}
        onChange={(e) => setURL(e.target.value.replace(/(\r\n|\n|\r)/gm, ''))}
        varient="outlined"
      />
      <span className="dropdown-error">{urlError}</span>
      <div className="resetFooter">
        <Button
          type="secondary"
          onClick={modalCloseOnly}
          icon={<MdClose />}
          label={variables.getMessage('modals.main.settings.sections.advanced.reset_modal.cancel')}
        />
        <Button
          type="settings"
          onClick={() => modalClose(url)}
          icon={<MdOutlineAddLink />}
          label={variables.getMessage('modals.main.settings.sections.background.source.add_url')}
        />
      </div>
    </div>
  );
}

export default memo(CustomURLModal);
