import { useT } from 'contexts';
import { useState, memo } from 'react';
import { MdClose, MdOutlineAddLink } from 'react-icons/md';
import { Tooltip, Button } from 'components/Elements';

function CustomURLModal({ modalClose, urlError, modalCloseOnly }) {
  const t = useT();
  const [url, setURL] = useState();

  return (
    <div className="smallModal">
      <div className="shareHeader">
        <span className="title">
          {t('modals.main.settings.sections.background.source.add_url')}
        </span>
        <Tooltip title={t('modals.main.settings.sections.advanced.reset_modal.cancel')}>
          <div className="close" onClick={modalCloseOnly}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <input
        type="text"
        value={url}
        onChange={(e) => setURL(e.target.value.replace(/(\r\n|\n|\r)/gm, ''))}
      />
      <span className="dropdown-error">{urlError}</span>
      <div className="resetFooter">
        <Button
          type="secondary"
          onClick={modalCloseOnly}
          icon={<MdClose />}
          label={t('modals.main.settings.sections.advanced.reset_modal.cancel')}
        />
        <Button
          type="settings"
          onClick={() => modalClose(url)}
          icon={<MdOutlineAddLink />}
          label={t('modals.main.settings.sections.background.source.add_url')}
        />
      </div>
    </div>
  );
}

export default memo(CustomURLModal);
