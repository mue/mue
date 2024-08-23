import { memo } from 'react';
import variables from 'config/variables';
import { MdClose } from 'react-icons/md';
import { Tooltip } from 'components/Elements';

function SideloadFailedModal({ modalClose, reason }) {
  return (
    <div className="smallModal">
      <div className="shareHeader">
        <span className="title">{variables.getMessage('modals.main.error_boundary.title')}</span>
        <Tooltip title={variables.getMessage('settings:sections.advanced.reset_modal.cancel')}>
          <div className="close" onClick={modalClose}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <span>{variables.getMessage('addons:sideload.failed')}</span>
      <span className="subtitle">{reason}</span>
    </div>
  );
}

const MemoizedSideloadFailedModal = memo(SideloadFailedModal);
export {
  MemoizedSideloadFailedModal as default,
  MemoizedSideloadFailedModal as SideloadFailedModal,
};
