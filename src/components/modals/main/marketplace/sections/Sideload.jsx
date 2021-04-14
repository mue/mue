import React from 'react';

import FileUpload from '../../settings/FileUpload';

import MarketplaceFunctions from '../../../../../modules/helpers/marketplace';

import { toast } from 'react-toastify';

export default function Sideload() {
  const manage = (type, input) => {
    switch (type) {
      case 'install':
        MarketplaceFunctions.install(input.type, input);
        break;
      default:
        break;
    }
      
    toast(window.language.toasts[type + 'ed']);
  }

  return (
    <>
      <div id='marketplace'>
        <FileUpload id='file-input' type='settings' accept='application/json' loadFunction={(e) => manage('install', JSON.parse(e.target.result))} />
        <button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>{window.language.modals.main.addons.sideload}</button>
      </div>
    </>
  );
}
