import { memo } from 'react';
import variables from 'config/variables';
import { MdClose, MdRestartAlt } from 'react-icons/md';
import { Tooltip, Button } from 'components/Elements';

function ClearModal({ modalClose, resetStats }) {
  return (
    <div className="smallModal">
      <div className="shareHeader">
        <span className="title">
          {variables.getMessage('settings:sections.advanced.reset_modal.title')}
        </span>
        <Tooltip title={variables.getMessage('settings:sections.advanced.reset_modal.cancel')}>
          <div className="close" onClick={modalClose}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <span className="title">
        {variables.getMessage('settings:sections.stats.clear_modal.question')}
      </span>
      <span className="subtitle">
        {variables.getMessage('settings:sections.stats.clear_modal.information')}
      </span>
      <div className="resetFooter">
        <Button
          type="secondary"
          onClick={modalClose}
          icon={<MdClose />}
          label={variables.getMessage('settings:sections.advanced.reset_modal.cancel')}
        />
        <Button
          type="settings"
          onClick={() => resetStats()}
          icon={<MdRestartAlt />}
          label={variables.getMessage('settings:buttons.reset')}
        />
      </div>
    </div>
  );
}

const MemoizedClearModal = memo(ClearModal);

export { MemoizedClearModal as default, MemoizedClearModal as ClearModal };
