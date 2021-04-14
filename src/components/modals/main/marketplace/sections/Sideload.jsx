import React from 'react';

import FileUpload from '../../settings/FileUpload';

import MarketplaceFunctions from '../../../../../modules/helpers/marketplace';

import { toast } from 'react-toastify';

export default function Sideload() {
  const install = (input) => {
    MarketplaceFunctions.install(input.type, input);
    toast(window.language.toasts.installed);
  }

  return (
    <>
      <FileUpload id='file-input' type='settings' accept='application/json' loadFunction={(e) => install(JSON.parse(e.target.result))} />
      <button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>{window.language.modals.main.addons.sideload}</button>
    </>
  );
}
