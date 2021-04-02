import React from 'react';

import SettingsFunctions from '../../../../modules/helpers/settings';

export default function ResetModal(props) {
  const language = window.language.modals.main.settings.sections.advanced.reset_modal;

  return (
    <>
      <h3 style={{'textAlign': 'center'}}>{language.title}</h3>
      <h4>{language.question}</h4>
      <p>{language.information}</p>
      <div className='resetfooter'>
        <button className='reset' onClick={() => SettingsFunctions.setDefaultSettings('reset')}>{window.language.modals.main.settings.buttons.reset}</button>
        <button className='import' onClick={props.modalClose}>{language.cancel}</button>
      </div>
    </>
  );
}
