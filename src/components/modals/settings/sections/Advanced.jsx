import React from 'react';

import Checkbox from '../Checkbox';
import FileUpload from '../FileUpload';

import SettingsFunctions from '../../../../modules/helpers/settings';

import { toast } from 'react-toastify';

export default class AdvancedSettings extends React.PureComponent {
  resetItem(type) {
    document.getElementById(type).value = '';
    toast(this.props.toastLanguage.reset);
  }

  componentDidMount() {
    document.getElementById('customcss').value = localStorage.getItem('customcss');
    document.getElementById('customjs').value = localStorage.getItem('customjs');
  }

  settingsImport(e) {
    const content = JSON.parse(e.target.result);

    for (const key of Object.keys(content)) {
      localStorage.setItem(key, content[key]);
    }

    toast(this.props.toastLanguage.imported);
  }

  componentWillUnmount() {
    localStorage.setItem('customcss', document.getElementById('customcss').value);
    localStorage.setItem('customjs', document.getElementById('customjs').value);
  }

  render() {
    return (
      <div>
        <h2>Advanced</h2>
        <Checkbox name='offlineMode' text='Offline Mode' />
        <h3>Data</h3>
        <button className='reset' onClick={() => SettingsFunctions.setDefaultSettings('reset')}>Reset</button>
        <button className='export' onClick={() => SettingsFunctions.exportSettings()}>Export</button>
        <button className='import' onClick={() => document.getElementById('file-input').click()}>Import</button>
        <FileUpload id='file-input' accept='application/json' type='settings' loadFunction={(e) => this.settingsImport(e)} />
        <h3>Customisation</h3>
        <ul>
          <p>Custom CSS <span className='modalLink' onClick={() => this.resetItem('customcss')}>Reset</span></p>
          <textarea id='customcss'></textarea>
        </ul>
        <ul>
          <p>Custom JS <span className='modalLink' onClick={() => this.resetItem('customjs')}>Reset</span></p>
          <textarea id='customjs'></textarea>
        </ul>
        <h3>Experimental</h3>
        <p>Please note that the Mue team cannot provide support if you have experimental mode on. Please disable it first and see if the issues continue to occur before contacting support.</p>
        <Checkbox name='experimental' text='Enabled' />
      </div>
    );
  }
}
