import React from 'react';

import SettingsFunctions from '../../../../modules/helpers/settings';

export default function ResetModal(props) {
  return (
    <>
      <h3 style={{'textAlign': 'center'}}>WARNING</h3>
      <h4>Do you want to reset Mue?</h4>
      <p>This will delete all data. If you want to keep your data and preferences, please export first.</p>
      <div className='resetfooter'>
        <button className='reset' onClick={() => SettingsFunctions.setDefaultSettings('reset')}>Reset</button>
        <button className='import' onClick={props.modalClose}>Cancel</button>
      </div>
    </>
  );
}
