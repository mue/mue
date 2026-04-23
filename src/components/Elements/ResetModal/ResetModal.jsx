import { memo } from 'react';
import { useT } from 'contexts';
import variables from 'config/variables';
import { MdClose, MdRestartAlt } from 'react-icons/md';
import { setDefaultSettings } from 'utils/settings';
import { Tooltip, Button } from 'components/Elements';

function ResetModal({ modalClose }) {
  const t = useT();
  const reset = () => {
    variables.stats.postEvent('setting', 'Reset');
    setDefaultSettings('reset');
    window.location.reload();
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
      <span className="title">
        {t('modals.main.settings.sections.advanced.reset_modal.question')}
      </span>
      <span className="subtitle">
        {t('modals.main.settings.sections.advanced.reset_modal.information')}
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
          onClick={() => reset()}
          icon={<MdRestartAlt />}
          label={t('modals.main.settings.buttons.reset')}
        />
      </div>
    </div>
  );
}

const MemoizedResetModal = memo(ResetModal);

export { MemoizedResetModal as default, MemoizedResetModal as ResetModal };
