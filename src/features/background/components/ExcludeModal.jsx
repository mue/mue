import { useT } from 'contexts';
import { memo } from 'react';
import EventBus from 'utils/eventbus';
import { Tooltip, Button } from 'components/Elements';

import { MdClose, MdDone } from 'react-icons/md';

function ExcludeModal({ modalClose, info }) {
  const t = useT();
  const excludeImage = async () => {
    let backgroundExclude = JSON.parse(localStorage.getItem('backgroundExclude'));
    backgroundExclude.push(info.pun);
    backgroundExclude = JSON.stringify(backgroundExclude);
    localStorage.setItem('backgroundExclude', backgroundExclude);
    EventBus.emit('refresh', 'background');
    modalClose();
  };

  return (
    <div className="smallModal">
      <div className="shareHeader">
        <span className="title">
          {t('modals.main.settings.sections.advanced.reset_modal.title')}
        </span>
        <Tooltip title={t('modals.main.settings.sections.advanced.reset_modal.cancel')}>
          <div className="close" onClick={modalClose}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <span className="subtitle">
        {t('widgets.background.exclude_confirm', { category: info.category })}
      </span>
      <div className="resetFooter">
        <Button
          type="secondary"
          onClick={modalClose}
          icon={<MdClose />}
          label={t('modals.main.settings.sections.advanced.reset_modal.cancel')}
        />
        <Button
          type="settings"
          onClick={() => excludeImage()}
          icon={<MdDone />}
          label={t('widgets.background.confirm')}
        />
      </div>
    </div>
  );
}

export default memo(ExcludeModal);
