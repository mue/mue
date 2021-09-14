import variables from 'modules/variables';
import { PureComponent } from 'react';
import Modal from 'react-modal';

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
    const getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
    const languagecode = variables.languagecode;

    return (
      <>
        <h2>{getMessage(languagecode, 'modals.main.settings.sections.advanced.title')}</h2>
        <Checkbox name='offlineMode' text={getMessage(languagecode, 'modals.main.settings.sections.advanced.offline_mode')} element='.other' />
        <Dropdown name='timezone' label={getMessage(languagecode, 'modals.main.settings.sections.advanced.timezone.title')} category='timezone'>
          <option value='auto'>{getMessage(languagecode, 'modals.main.settings.sections.advanced.timezone.automatic')}</option>
          {time_zones.map((timezone) => (
            <option value={timezone} key={timezone}>{timezone}</option>
          ))}
        </Dropdown>

        <h3>{getMessage(languagecode, 'modals.main.settings.sections.advanced.data')}</h3>
        <button className='reset' onClick={() => this.setState({ resetModal: true })}>{getMessage(languagecode, 'modals.main.settings.buttons.reset')}</button>
        <button className='export' onClick={() => exportSettings()}>{getMessage(languagecode, 'modals.main.settings.buttons.export')}</button>
        <button className='import' onClick={() => document.getElementById('file-input').click()}>{getMessage(languagecode, 'modals.main.settings.buttons.import')}</button>
        <FileUpload id='file-input' accept='application/json' type='settings' loadFunction={(e) => importSettings(e)}/>

        <h3>{getMessage(languagecode, 'modals.main.settings.sections.advanced.customisation')}</h3>
        <Text title={getMessage(languagecode, 'modals.main.settings.sections.advanced.tab_name')} name='tabName' default={getMessage(languagecode, 'tabname')} category='other'/>
        <Text title={getMessage(languagecode, 'modals.main.settings.sections.advanced.custom_js')} name='customjs' textarea={true} category='other' element='other'/>
        <Text title={getMessage(languagecode, 'modals.main.settings.sections.advanced.custom_css')} name='customcss' textarea={true} category='other'/>

        <h3>{getMessage(languagecode, 'modals.main.settings.sections.experimental.title')}</h3>
        <p style={{ maxWidth: '75%' }}>{getMessage(languagecode, 'modals.main.settings.sections.advanced.experimental_warning')}</p>
        <Switch name='experimental' text={getMessage(languagecode, 'modals.main.settings.enabled')} element='.other'/>

        <Modal closeTimeoutMS={100} onRequestClose={() => this.setState({ resetModal: false })} isOpen={this.state.resetModal} className='Modal resetmodal mainModal' overlayClassName='Overlay resetoverlay' ariaHideApp={false}>
          <ResetModal modalClose={() => this.setState({ resetModal: false })} />
        </Modal>
      </>
    );
  }
}
