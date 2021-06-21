import LocalMallIcon from '@material-ui/icons/LocalMall';

import FileUpload from '../../settings/FileUpload';

import MarketplaceFunctions from '../../../../../modules/helpers/marketplace';

import { toast } from 'react-toastify';

export default function Sideload() {
  const install = (input) => {
    MarketplaceFunctions.install(input.type, input);
    toast(window.language.toasts.installed);
    window.analytics.postEvent('marketplaceUpdate', 'Sideload used');
  };

  return (
    <div className='emptyitems'>
      <div className='emptyMessage'>
        <FileUpload id='file-input' type='settings' accept='application/json' loadFunction={(e) => install(JSON.parse(e.target.result))} />
        <LocalMallIcon/>
        <h1>{window.language.modals.main.addons.sideload}</h1>
        <button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>{window.language.modals.main.settings.sections.background.source.upload}</button>
      </div>
    </div>
  );
}
