import SettingsFunctions from '../../../../modules/helpers/settings';

export default function ResetModal(props) {
  const language = window.language.modals.main.settings.sections.advanced.reset_modal;

  const reset = () => {
    window.stats.postEvent('setting', 'Reset');
    SettingsFunctions.setDefaultSettings('reset');
    window.location.reload();
  }

  return (
    <>
      <h3 style={{ textAlign: 'center' }}>{language.title}</h3>
      <h4>{language.question}</h4>
      <p>{language.information}</p>
      <div className='resetfooter'>
        <button className='reset' style={{ marginLeft: 0 }} onClick={() => reset()}>{window.language.modals.main.settings.buttons.reset}</button>
        <button className='import' style={{ marginLeft: '5px' }} onClick={props.modalClose}>{language.cancel}</button>
      </div>
    </>
  );
}
