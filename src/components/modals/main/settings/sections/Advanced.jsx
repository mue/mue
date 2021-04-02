import React from 'react';

import Checkbox from '../Checkbox';
import FileUpload from '../FileUpload';
import Text from '../Text';
import ResetModal from '../ResetModal';

import SettingsFunctions from '../../../../../modules/helpers/settings';

import { toast } from 'react-toastify';
import Modal from 'react-modal';

export default class AdvancedSettings extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      resetModal: false
    };
    this.language = window.language.modals.main.settings;
  }

  settingsImport(e) {
    const content = JSON.parse(e.target.result);

    for (const key of Object.keys(content)) {
      localStorage.setItem(key, content[key]);
    }

    toast(this.language.toasts.imported);
  }

  render() {
    const { advanced } = this.language.sections;

    return (
      <>
        <h2>{advanced.title}</h2>
        <Checkbox name='offlineMode' text={advanced.offline_mode} />

        <h3>{advanced.data}</h3>
        <button className='reset' onClick={() => this.setState({ resetModal: true })}>{this.language.buttons.reset}</button>
        <button className='export' onClick={() => SettingsFunctions.exportSettings()}>{this.language.buttons.export}</button>
        <button className='import' onClick={() => document.getElementById('file-input').click()}>{this.language.buttons.import}</button>
        <FileUpload id='file-input' accept='application/json' type='settings' loadFunction={(e) => this.settingsImport(e)} />

        <h3>{advanced.customisation}</h3>
        <Text title={advanced.custom_js} name='customjs' textarea={true}/>
        <Text title={advanced.custom_css} name='customcss' textarea={true}/>
        <Text title='Tab Name' name='tabName'/>

        <h3>{this.language.sections.experimental.title}</h3>
        <p>{advanced.experimental_warning}</p>
        <Checkbox name='experimental' text={this.language.enabled} />

        <Modal onRequestClose={() => this.setState({ resetModal: false })} isOpen={this.state.resetModal} className={'Modal resetmodal'} overlayClassName={'Overlay resetoverlay'} ariaHideApp={false}>
          <ResetModal modalClose={() => this.setState({ resetModal: false })} />
        </Modal>
      </>
    );
  }
}
