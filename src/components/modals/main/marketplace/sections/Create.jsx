import { PureComponent } from 'react';

import FileUpload from '../../settings/FileUpload';

import Settings from '@material-ui/icons/SettingsRounded';
import Photos from '@material-ui/icons/PhotoOutlined';
import Quotes from '@material-ui/icons/FormatQuoteOutlined';

import { saveFile } from '../../../../../modules/helpers/settings/modals';
import { toast } from 'react-toastify';

import '../../../welcome/welcome.scss';

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
        screenshot_url: ''
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

  importSettings(input) {
    const data = input || localStorage;
    let settings = {};
    Object.keys(data).forEach((key) => {
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
      [this.state.addonMetadata.type]: this.state.addonData
    }, this.state.addonMetadata.name + '.json');
  }

  render() {
    let tabContent;

    const chooseType = (
      <>
        <h3>Type</h3>
        <div className='themesToggleArea'>
          <div className='options'>
            <div className='toggle lightTheme' onClick={() => this.changeTab(2, 'photos')}>
              <Photos/>
              <span>Photo Pack (soon™️)</span>
            </div>
            <div className='toggle lightTheme' onClick={() => this.changeTab(2, 'quotes')}>
              <Quotes/>
              <span>Quote Pack (soon™️)</span>
            </div>
            <div className='toggle lightTheme' onClick={() => this.changeTab(2, 'settings')}>
              <Settings/>
              <span>Preset Settings</span>
            </div>
          </div>
        </div>
      </>
    );

    // todo: find a better way to do all this
    const nextDescriptionDisabled = (this.state.addonMetadata.name !== undefined && 
      this.state.addonMetadata.description !== undefined &&
      this.state.addonMetadata.version !== undefined && this.state.addonMetadata.author !== undefined && 
      this.state.addonMetadata.icon_url !== undefined && this.state.addonMetadata.screenshot_url !== undefined) 
    ? false : true;
    
    const setMetadata = (data, type) => {
      this.setState({
        addonMetadata: {
          name: (type === 'name') ? data : this.state.addonMetadata.name,
          description: (type === 'description') ? data : this.state.addonMetadata.description,
          version: (type === 'version') ? data : this.state.addonMetadata.version,
          author: (type === 'author') ? data : this.state.addonMetadata.author,
          icon_url: (type === 'icon_url') ? data : this.state.addonMetadata.icon_url,
          screenshot_url: (type === 'screenshot_url') ? data : this.state.addonMetadata.screenshot_url,
          type: this.state.addonMetadata.type
        }
      });
    }

    const writeDescription = ( 
      <>
        <h3>Information</h3>
        <p>Name</p>
        <input type='text' value={this.state.addonMetadata.name} onInput={(e) => setMetadata(e.target.value, 'name')}/>
        <p>Version</p>
        <input type='text' value={this.state.addonMetadata.version} onInput={(e) => setMetadata(e.target.value, 'version')}/>
        <p>Author</p>
        <input type='text' value={this.state.addonMetadata.author} onInput={(e) => setMetadata(e.target.value, 'author')}/>
        <p>Icon URL</p>
        <input type='text' value={this.state.addonMetadata.icon_url} onInput={(e) => setMetadata(e.target.value, 'icon_url')}/>
        <p>Screenshot URL</p>
        <input type='text' value={this.state.addonMetadata.screenshot_url} onInput={(e) => setMetadata(e.target.value, 'screenshot_url')}/>
        <p>Description</p>
        <textarea className='settingsTextarea' value={this.state.addonMetadata.description} onInput={(e) => setMetadata(e.target.value, 'description')}></textarea>
        <br/>
        <button onClick={() => this.changeTab(1)} className='uploadbg' style={{ marginRight: '10px' }}>Back</button>
        <button onClick={() => this.changeTab(this.state.addonMetadata.type)} className='uploadbg' disabled={nextDescriptionDisabled}>Next</button>
      </>
    );

    const nextSettingsDisabled = (this.state.addonData === '') ? true : false;

    // settings
    const importSettings = (
      <>
        <h3>Import Settings</h3>
        <p onClick={() => this.importSettings()} className='addToMue'>Import current setup</p>
        <br/><br/><br/>
        <FileUpload id='file-input' type='settings' accept='application/json' loadFunction={(e) => this.importSettings(JSON.parse(e.target.result))} />
        <p className='addToMue' style={{ position: 'absolute' }} onClick={() => document.getElementById('file-input').click()}>Upload JSON</p>
        <br/><br/>
        <button onClick={() => this.changeTab(2)} className='uploadbg' style={{ marginRight: '10px' }}>Back</button>
        <button onClick={() => this.changeTab(3)} className='uploadbg' disabled={nextSettingsDisabled}>Next</button>
      </>
    );
    
    // quotes
    const addQuotes = (
      <>
        <h3>Add Quotes</h3>
      </>
    );

    // photos
    const addPhotos = (
      <>
        <h3>Add Photos</h3>
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
      case 'quotes': tabContent = addQuotes; break;
      case 'photos': tabContent = addPhotos; break;
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
