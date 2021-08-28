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
    this.language = window.language.modals.main.settings;
  }

  render() {
    const { advanced } = this.language.sections;

    return (
      <>
        <h2>{advanced.title}</h2>
        <Checkbox name='offlineMode' text={advanced.offline_mode} element='.other' />
        <Dropdown name='timezone' label={advanced.timezone.title} category='timezone'>
          <option value='auto'>{advanced.timezone.automatic}</option>
          {time_zones.map((timezone) => (
            <option value={timezone} key={timezone}>{timezone}</option>
          ))}
        </Dropdown>

        <h3>{advanced.data}</h3>
        <button className='reset' onClick={() => this.setState({ resetModal: true })}>{this.language.buttons.reset}</button>
        <button className='export' onClick={() => exportSettings()}>{this.language.buttons.export}</button>
        <button className='import' onClick={() => document.getElementById('file-input').click()}>{this.language.buttons.import}</button>
        <FileUpload id='file-input' accept='application/json' type='settings' loadFunction={(e) => importSettings(e)}/>

        <h3>{advanced.customisation}</h3>
        <Text title={advanced.tab_name} name='tabName' default={window.language.tabname} category='other'/>
        <Text title={advanced.custom_js} name='customjs' textarea={true} category='other' element='other'/>
        <Text title={advanced.custom_css} name='customcss' textarea={true} category='other'/>

        <h3>{this.language.sections.experimental.title}</h3>
        <p style={{ maxWidth: '75%' }}>{advanced.experimental_warning}</p>
        <Switch name='experimental' text={this.language.enabled} element='.other'/>

        <Modal closeTimeoutMS={100} onRequestClose={() => this.setState({ resetModal: false })} isOpen={this.state.resetModal} className='Modal resetmodal mainModal' overlayClassName='Overlay resetoverlay' ariaHideApp={false}>
          <ResetModal modalClose={() => this.setState({ resetModal: false })} />
        </Modal>
      </>
    );
  }
}
