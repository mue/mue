import { memo } from 'react';
import { useT } from 'contexts';
import { MdClose } from 'react-icons/md';
import { Tooltip } from 'components/Elements';

function SideloadFailedModal({ modalClose, reason }) {
  const t = useT();
  return (
    <div className="smallModal">
      <div className="shareHeader">
        <span className="title">{t('modals.main.error_boundary.title')}</span>
        <Tooltip title={t('modals.main.settings.sections.advanced.reset_modal.cancel')}>
          <div className="close" onClick={modalClose}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <span>{t('modals.main.addons.sideload.failed')}</span>
      <span className="subtitle">{reason}</span>
    </div>
  );
}

const MemoizedSideloadFailedModal = memo(SideloadFailedModal);
export {
  MemoizedSideloadFailedModal as default,
  MemoizedSideloadFailedModal as SideloadFailedModal,
};
