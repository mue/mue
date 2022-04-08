import variables from 'modules/variables';
import { MdClose, MdRestartAlt } from 'react-icons/md';
import { setDefaultSettings } from 'modules/helpers/settings';

export default function ResetModal({ modalClose }) {
  const reset = () => {
    variables.stats.postEvent('setting', 'Reset');
    setDefaultSettings('reset');
    window.location.reload();
  };

  return (
    <div className="resetModal">
      <span className="mainTitle" style={{ textAlign: 'center' }}>
        {variables.language.getMessage(
          variables.languagecode,
          'modals.main.settings.sections.advanced.reset_modal.title',
        )}
      </span>
      <span className="title">
        {variables.language.getMessage(
          variables.languagecode,
          'modals.main.settings.sections.advanced.reset_modal.question',
        )}
      </span>
      <span style={{ maxWidth: '450px' }} className="subtitle">
        {variables.language.getMessage(
          variables.languagecode,
          'modals.main.settings.sections.advanced.reset_modal.information',
        )}
      </span>
      <div className="resetFooter">
        <button onClick={modalClose}>
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
