import { memo } from 'react';
import PropTypes from 'prop-types';
import variables from 'modules/variables';
import { MdClose, MdRestartAlt } from 'react-icons/md';
import { setDefaultSettings } from 'modules/helpers/settings';
import Tooltip from 'components/helpers/tooltip/Tooltip';

function ResetModal({ modalClose }) {
  const reset = () => {
    variables.stats.postEvent('setting', 'Reset');
    setDefaultSettings('reset');
    window.location.reload();
  };

  return (
    <div className="smallModal">
      <div className="shareHeader">
        <span className="title">
          {variables.getMessage('modals.main.settings.sections.advanced.reset_modal.title')}
        </span>
        <Tooltip
          title={variables.getMessage('modals.main.settings.sections.advanced.reset_modal.cancel')}
        >
          <div className="close" onClick={modalClose}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <span className="title">
        {variables.getMessage('modals.main.settings.sections.advanced.reset_modal.question')}
      </span>
      <span className="subtitle">
        {variables.getMessage('modals.main.settings.sections.advanced.reset_modal.information')}
      </span>
      <div className="resetFooter">
        <button className="textButton" onClick={modalClose}>
          <MdClose />
          {variables.getMessage('modals.main.settings.sections.advanced.reset_modal.cancel')}
        </button>
        <button onClick={() => reset()}>
          <MdRestartAlt />
          {variables.getMessage('modals.main.settings.buttons.reset')}
        </button>
      </div>
    </div>
  );
}

ResetModal.propTypes = {
  modalClose: PropTypes.func.isRequired,
};

export default memo(ResetModal);
