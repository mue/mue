import variables from 'modules/variables';
import { MdClose, MdRestartAlt } from 'react-icons/md';
import { setDefaultSettings } from 'modules/helpers/settings';
import Tooltip from '../../../helpers/tooltip/Tooltip';

export default function ResetModal({ modalClose }) {
  const reset = () => {
    variables.stats.postEvent('setting', 'Reset');
    setDefaultSettings('reset');
    window.location.reload();
  };

  return (
    <div className="smallModal">
      <div className="shareHeader">
        <span className="title">
          {variables.language.getMessage(
            variables.languagecode,
            'modals.main.settings.sections.advanced.reset_modal.title',
          )}
        </span>
        <Tooltip title="Close">
          <div className="close" onClick={modalClose}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <span className="title">
        {variables.language.getMessage(
          variables.languagecode,
          'modals.main.settings.sections.advanced.reset_modal.question',
        )}
      </span>
      <span className="subtitle">
        {variables.language.getMessage(
          variables.languagecode,
          'modals.main.settings.sections.advanced.reset_modal.information',
        )}
      </span>
      <div className="resetFooter">
        <button className="textButton" onClick={modalClose}>
          <MdClose />
          Close
        </button>
        <button onClick={() => reset()}>
          <MdRestartAlt />
          Reset
        </button>
      </div>
    </div>
  );
}
