import { LocalMall } from '@material-ui/icons';
import { toast } from 'react-toastify';

import FileUpload from '../../settings/FileUpload';

import { install } from '../../../../../modules/helpers/marketplace';

export default function Sideload() {
  const installAddon = (input) => {
    install(input.type, input);
    toast(window.language.toasts.installed);
    window.stats.postEvent('marketplace', 'Sideload');
  };

  return (
    <div className='emptyitems'>
      <div className='emptyMessage'>
        <FileUpload id='file-input' type='settings' accept='application/json' loadFunction={(e) => installAddon(JSON.parse(e.target.result))} />
        <LocalMall/>
        <h1>{window.language.modals.main.addons.sideload}</h1>
        <button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>{window.language.modals.main.settings.sections.background.source.upload}</button>
      </div>
    </div>
  );
}
