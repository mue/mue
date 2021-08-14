import { PureComponent } from 'react';

import FileUpload from '../../settings/FileUpload';

import { saveFile } from '../../../../../modules/helpers/settings/modals';

import { toast } from 'react-toastify';

export default class Create extends PureComponent {
  constructor() {
    super();
    this.state = {
      currentTab: 1,
      addonMetadata: {
        name: '',
        description: '',
        type: '',
        version: '',
        author: '',
        icon_url: '',
        screenshot_url: '',
      },
      addonData: ''
    };
  }

  changeTab(tab, type) { 
    if (type) {
      return this.setState({ 
        currentTab: tab,
        addonMetadata: {
          type: type
        } 
      });
    }

    this.setState({
      currentTab: tab
    });
  }

  importSettings() {
    let settings = {};
    Object.keys(localStorage).forEach((key) => {
      if (key === 'statsData' || key === 'firstRun' || key === 'showWelcome' || key === 'language' || key === 'installed' || key === 'stats') {
        return;
      }
      settings[key] = localStorage.getItem(key);
    });

    this.setState({
      addonData: settings
    });

    toast('Imported settings!');
  }

  uploadSettings(input) {
    let settings = {};
    Object.keys(input).forEach((key) => {
      if (key === 'statsData' || key === 'firstRun' || key === 'showWelcome' || key === 'language' || key === 'installed' || key === 'stats') {
        return;
      }
      settings[key] = localStorage.getItem(key);
    });

    this.setState({
      addonData: settings
    });

    toast('Imported settings!');
  }

  downloadAddon() {
    saveFile({
      name: this.state.addonMetadata.name,
      description: this.state.addonMetadata.description,
      type: this.state.addonMetadata.type,
      version: this.state.addonMetadata.version,
      author: this.state.addonMetadata.author,
      icon_url: this.state.addonMetadata.icon_url,
      screenshot_url: this.state.addonMetadata.screenshot_url,
      settings: this.state.addonData
    }, this.state.addonMetadata.name + '.json');
  }

  render() {
    let tabContent;

    const chooseType = (
      <>
        <h3>Type</h3>
        <button onClick={() => this.changeTab(2, 'settings')} className='uploadbg'>Settings</button>
      </>
    );

    const writeDescription = ( 
      <>
        <h3>Information</h3>
        <p>Name</p>
        <input type='text' value={this.state.addonMetadata.name} onInput={(e) => this.setState({ addonMetadata: { name: e.target.value }})}/>
        <p>Version</p>
        <input type='text' value={this.state.addonMetadata.version} onInput={(e) => this.setState({ addonMetadata: { version: e.target.value }})}/>
        <p>Author</p>
        <input type='text' value={this.state.addonMetadata.author} onInput={(e) => this.setState({ addonMetadata: { author: e.target.value }})}/>
        <p>Icon URL</p>
        <input type='text' value={this.state.addonMetadata.icon_url} onInput={(e) => this.setState({ addonMetadata: { icon_url: e.target.value }})}/>
        <p>Screenshot URL</p>
        <input type='text' value={this.state.addonMetadata.screenshot_url} onInput={(e) => this.setState({ addonMetadata: { screenshot_url: e.target.value }})}/>
        <p>Description</p>
        <textarea className='settingsTextarea' value={this.state.addonMetadata.description} onInput={(e) => this.setState({ addonMetadata: { description: e.target.value }})}></textarea>
        <br/>
        <button onClick={() => this.changeTab(1)} className='uploadbg' style={{ marginRight: '10px' }}>Back</button>
        <button onClick={() => this.changeTab(this.state.addonMetadata.type)} className='uploadbg'>Next</button>
      </>
    );

    // settings
    const importSettings = (
      <>
        <h3>Import Settings</h3>
        <p onClick={() => this.importSettings()} className='addToMue'>Import current setup</p>
        <br/><br/><br/>
        <FileUpload id='file-input' type='settings' accept='application/json' loadFunction={(e) => this.uploadSettings(JSON.parse(e.target.result))} />
        <p className='addToMue' style={{ position: 'absolute' }} onClick={() => document.getElementById('file-input').click()}>Upload JSON</p>
        <br/><br/>
        <button onClick={() => this.changeTab(2, 'settings')} className='uploadbg' style={{ marginRight: '10px' }}>Back</button>
        <button onClick={() => this.changeTab(3)} className='uploadbg'>Next</button>
      </>
    );

    const downloadAddon = (
      <>
        <h3>Finish</h3>
        <button onClick={() => this.downloadAddon()} className='upload'>Download Add-on</button>
        <br/><br/>
        <button onClick={() => this.changeTab(this.state.addonMetadata.type)} className='uploadbg' style={{ marginRight: '10px' }}>Back</button>
      </>
    );

    switch (this.state.currentTab) {
      case 2: tabContent = writeDescription; break;
      case 'settings': tabContent = importSettings; break;
      case 3: tabContent = downloadAddon; break;
      default: tabContent = chooseType;
    }

    return (
      <>
        <h2>Create Add-on</h2>
        {tabContent}
      </>
    );
  }
}