import { memo } from 'react';
import { useT } from 'contexts';
import { MdClose, MdRestartAlt } from 'react-icons/md';
import { Tooltip, Button } from 'components/Elements';

function ClearModal({ modalClose, resetStats }) {
  const t = useT();
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
      <span className="title">{t('modals.main.settings.sections.stats.clear_modal.question')}</span>
      <span className="subtitle">
        {t('modals.main.settings.sections.stats.clear_modal.information')}
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
          onClick={() => resetStats()}
          icon={<MdRestartAlt />}
          label={t('modals.main.settings.buttons.reset')}
        />
      </div>
    </div>
  );
}

const MemoizedClearModal = memo(ClearModal);

export { MemoizedClearModal as default, MemoizedClearModal as ClearModal };
