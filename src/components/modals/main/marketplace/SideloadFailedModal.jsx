import variables from 'modules/variables';

export default function SideloadFailedModal({ modalClose, reason }) {
  const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>{getMessage('modals.main.error_boundary.error')}</h1>
      <span>{getMessage('modals.main.addons.sideload.failed')}</span>
      <br/><br/>
      <span>{reason}</span>
      <div className='resetfooter'>
        <button className='import' onClick={modalClose}>{getMessage('modals.welcome.buttons.close')}</button>
      </div>
    </>
  );
}
