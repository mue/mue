import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

import SettingsFunctions from '../../../../modules/helpers/settings';

export default function ResetModal(props) {
  const language = window.language.modals.main.settings.sections.advanced.reset_modal;

  const reset = () => {
    window.stats.postEvent('setting', 'Reset');
    SettingsFunctions.setDefaultSettings('reset');
    window.location.reload();
  };

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>{language.title}</h1>
      <span>{language.question}</span>
      <br/><br/>
      <span>{language.information}</span>
      <div className='resetfooter'>
        <button className='round reset' style={{ marginLeft: 0 }} onClick={() => reset()}>
          <DeleteIcon/>
        </button>
        <button className='round import' style={{ marginLeft: '5px' }} onClick={props.modalClose}>
          <CloseIcon/>
        </button>
      </div>
    </>
  );
}
