import variables from 'modules/variables';
import { PureComponent } from 'react';
import { LocalMall } from '@mui/icons-material';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import SideloadFailedModal from '../SideloadFailedModal';

import FileUpload from '../../settings/FileUpload';

import { install } from 'modules/helpers/marketplace';

export default class Sideload extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor(props) {
    super(props);
    this.state = {
      showFailed: false,
      failedReason: ''
    }
  }

  installAddon(input) {
    let failedReason = '';
    if (!input.name) {
      failedReason = getMessage('modals.main.addons.sideload.errors.no_name');
    } else if (!input.author) {
      failedReason = getMessage('modals.main.addons.sideload.errors.no_author');
    } else if (!input.type) {
      failedReason = getMessage('modals.main.addons.sideload.errors.no_type');
    } else if (!input.version) {
      failedReason = getMessage('modals.main.addons.sideload.errors.no_version');
    } else if (input.type === 'photos' && (!input.photos || !input.photos.length || !input.photos[0].url.default || !input.photos[0].photographer || !input.photos[0].location)) {
      failedReason = getMessage('modals.main.addons.sideload.errors.invalid_photos');
    } else if (input.type === 'quotes' && (!input.quotes || !input.quotes.length || !input.quotes[0].quote || !input.quotes[0].author)) {
      failedReason = getMessage('modals.main.addons.sideload.errors.invalid_quotes');
    }

    if (failedReason !== '') {
      return this.setState({ 
        failedReason,
        showFailed: true
      });
    }

    install(input.type, input);
    toast(this.getMessage('toasts.installed'));
    variables.stats.postEvent('marketplace', 'Sideload');
  }
  
  render() {
    return (
      <div className='emptyitems'>
        <div className='emptyMessage'>
          <FileUpload id='file-input' type='settings' accept='application/json' loadFunction={(e) => this.installAddon(JSON.parse(e.target.result))} />
          <LocalMall/>
          <h1>{this.getMessage('modals.main.addons.sideload.title')}</h1>
          <button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>{this.getMessage('modals.main.settings.sections.background.source.upload')}</button>
        </div>
        <Modal closeTimeoutMS={100} onRequestClose={() => this.setState({ showFailed: false })} isOpen={this.state.showFailed} className='Modal resetmodal mainModal sideloadModal' overlayClassName='Overlay resetoverlay' ariaHideApp={false}>
          <SideloadFailedModal modalClose={() => this.setState({ showFailed: false })} reason={this.state.failedReason}/>
        </Modal>
      </div>
    );
  }
}
