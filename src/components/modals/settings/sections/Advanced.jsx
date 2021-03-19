import React from 'react';

import Checkbox from '../Checkbox';
import FileUpload from '../FileUpload';
import ResetModal from '../ResetModal';

import SettingsFunctions from '../../../../modules/helpers/settings';

import { toast } from 'react-toastify';
import Modal from 'react-modal';

export default class AdvancedSettings extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      resetModal: false
    };
  }

  resetItem(type) {
    document.getElementById(type).value = '';
    toast(this.props.language.toasts.reset);
  }

  settingsImport(e) {
    const content = JSON.parse(e.target.result);

    for (const key of Object.keys(content)) {
      localStorage.setItem(key, content[key]);
    }

    toast(this.props.language.toasts.imported);
  }

  componentDidMount() {
    document.getElementById('customcss').value = localStorage.getItem('customcss');
    document.getElementById('customjs').value = localStorage.getItem('customjs');
  }

  componentDidUpdate() {
    localStorage.setItem('customcss', document.getElementById('customcss').value);
    localStorage.setItem('customjs', document.getElementById('customjs').value);
  }

  render() {
    const { advanced } = this.props.language.sections;

    return (
      <div>
        <h2>{advanced.title}</h2>
        <Checkbox name='offlineMode' text={advanced.offline_mode} />

        <h3>{advanced.data}</h3>
        <button className='reset' onClick={() => this.setState({ resetModal: true })}>{this.props.language.buttons.reset}</button>
        <button className='export' onClick={() => SettingsFunctions.exportSettings()}>{this.props.language.buttons.export}</button>
        <button className='import' onClick={() => document.getElementById('file-input').click()}>{this.props.language.buttons.import}</button>
        <FileUpload id='file-input' accept='application/json' type='settings' loadFunction={(e) => this.settingsImport(e)} />

        <h3>{advanced.customisation}</h3>
        <ul>
          <p>{advanced.custom_css} <span className='modalLink' onClick={() => this.resetItem('customcss')}>{this.props.language.buttons.reset}</span></p>
          <textarea id='customcss'></textarea>
        </ul>
        <ul>
          <p>{advanced.custom_js} <span className='modalLink' onClick={() => this.resetItem('customjs')}>{this.props.language.buttons.reset}</span></p>
          <textarea id='customjs'></textarea>
        </ul>

        <h3>{this.props.language.sections.experimental.title}</h3>
        <p>{advanced.experimental_warning}</p>
        <Checkbox name='experimental' text={this.props.language.enabled} />

        <Modal onRequestClose={() => this.setState({ resetModal: false })} isOpen={this.state.resetModal} className={'modal'} overlayClassName={'Overlay'} ariaHideApp={false}>
          <ResetModal modalClose={() => this.setState({ resetModal: false })} />
        </Modal>
      </div>
    );
  }
}
