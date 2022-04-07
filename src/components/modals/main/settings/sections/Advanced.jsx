import variables from 'modules/variables';
import { PureComponent } from 'react';
import Modal from 'react-modal';
import { MenuItem } from '@mui/material';
import { MdUpload as ImportIcon, MdDownload as ExportIcon, MdRestartAlt as ResetIcon } from 'react-icons/md';

import { exportSettings, importSettings } from 'modules/helpers/settings/modals';

import Checkbox from '../Checkbox';
import FileUpload from '../FileUpload';
import Text from '../Text';
import Switch from '../Switch';
import ResetModal from '../ResetModal';
import Dropdown from '../Dropdown';

const time_zones = require('components/widgets/time/timezones.json');

export default class AdvancedSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      resetModal: false
    };
  }

  render() {
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    return (
      <>
        <h2>{getMessage('modals.main.settings.sections.advanced.title')}</h2>
        <Checkbox name='offlineMode' text={getMessage('modals.main.settings.sections.advanced.offline_mode')} element='.other' />
        <Dropdown name='timezone' label={getMessage('modals.main.settings.sections.advanced.timezone.title')} category='timezone' manual={true}>
          <MenuItem value='auto'>{getMessage('modals.main.settings.sections.advanced.timezone.automatic')}</MenuItem>
          {time_zones.map((timezone) => (
            <MenuItem value={timezone} key={timezone}>{timezone}</MenuItem>
          ))}
        </Dropdown>

        {localStorage.getItem('welcomePreview') !== 'true' ?
         <>
           <h3>{getMessage('modals.main.settings.sections.advanced.data')}</h3>
           <br/>
           <div className='data-buttons-row'>
             <button onClick={() => this.setState({ resetModal: true })}>
               {getMessage('modals.main.settings.buttons.reset')}
               <ResetIcon/>
             </button>
             <button onClick={() => exportSettings()}>
               {getMessage('modals.main.settings.buttons.export')}
               <ExportIcon/>
             </button>
             <button onClick={() => document.getElementById('file-input').click()}>
               {getMessage('modals.main.settings.buttons.import')}
               <ImportIcon/>
             </button>
           </div>
         </>
        : null}
        <FileUpload id='file-input' accept='application/json' type='settings' loadFunction={(e) => importSettings(e)}/>

        <h3>{getMessage('modals.main.settings.sections.advanced.customisation')}</h3>
        <Text title={getMessage('modals.main.settings.sections.advanced.tab_name')} name='tabName' default={getMessage('tabname')} category='other'/>
        <Text title={getMessage('modals.main.settings.sections.advanced.custom_css')} name='customcss' textarea={true} category='other'/>

        <h3>{getMessage('modals.main.settings.sections.experimental.title')}</h3>
        <p style={{ maxWidth: '75%' }}>{getMessage('modals.main.settings.sections.advanced.experimental_warning')}</p>
        <Switch name='experimental' text={getMessage('modals.main.settings.enabled')} element='.other'/>

        <Modal closeTimeoutMS={100} onRequestClose={() => this.setState({ resetModal: false })} isOpen={this.state.resetModal} className='Modal resetmodal mainModal' overlayClassName='Overlay resetoverlay' ariaHideApp={false}>
          <ResetModal modalClose={() => this.setState({ resetModal: false })} />
        </Modal>
      </>
    );
  }
}
