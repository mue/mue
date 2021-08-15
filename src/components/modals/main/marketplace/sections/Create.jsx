import { PureComponent } from 'react';
import { 
  SettingsRounded as Settings, 
  PhotoOutlined as Photos, 
  FormatQuoteOutlined as Quotes
} from '@material-ui/icons';
import { toast } from 'react-toastify';

import { saveFile } from '../../../../../modules/helpers/settings/modals';

import FileUpload from '../../settings/FileUpload';

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
      addonData: '',
      settingsClasses: {
        current: 'toggle lightTheme',
        json: 'toggle lightTheme'
      }
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
      addonData: settings,
      settingsClasses: {
        current: input ? 'toggle lightTheme' : 'toggle lightTheme active',
        json: input ? 'toggle lightTheme active' : 'toggle lightTheme'
      }
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

    const { time } = window.language.modals.main.settings.sections;
    const { marketplace, addons } = window.language.modals.main;
    const { welcome } = window.language.modals;

    const chooseType = (
      <>
        <h3>{time.type}</h3>
        <div className='themesToggleArea'>
          <div className='options'>
            <div className='toggle lightTheme' onClick={() => this.changeTab(2, 'photos')}>
              <Photos/>
              <span>{marketplace.photo_packs}</span>
            </div>
            <div className='toggle lightTheme' onClick={() => this.changeTab(2, 'quotes')}>
              <Quotes/>
              <span>{marketplace.quote_packs}</span>
            </div>
            <div className='toggle lightTheme' onClick={() => this.changeTab(2, 'settings')}>
              <Settings/>
              <span>{marketplace.preset_settings}</span>
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
        <h3>{marketplace.product.information}</h3>
        <p>{addons.create.metadata.name}</p>
        <input type='text' value={this.state.addonMetadata.name} onInput={(e) => setMetadata(e.target.value, 'name')}/>
        <p>{marketplace.product.version}</p>
        <input type='text' value={this.state.addonMetadata.version} onInput={(e) => setMetadata(e.target.value, 'version')}/>
        <p>{marketplace.product.author}</p>
        <input type='text' value={this.state.addonMetadata.author} onInput={(e) => setMetadata(e.target.value, 'author')}/>
        <p>{addons.create.metadata.icon_url}</p>
        <input type='text' value={this.state.addonMetadata.icon_url} onInput={(e) => setMetadata(e.target.value, 'icon_url')}/>
        <p>{addons.create.metadata.screenshot_url}</p>
        <input type='text' value={this.state.addonMetadata.screenshot_url} onInput={(e) => setMetadata(e.target.value, 'screenshot_url')}/>
        <p>{addons.create.metadata.description}</p>
        <textarea className='settingsTextarea' value={this.state.addonMetadata.description} onInput={(e) => setMetadata(e.target.value, 'description')}></textarea>
        <br/>
        <button onClick={() => this.changeTab(1)} className='uploadbg' style={{ marginRight: '10px' }}>{welcome.buttons.previous}</button>
        <button onClick={() => this.changeTab(this.state.addonMetadata.type)} className='uploadbg' disabled={nextDescriptionDisabled}>{welcome.buttons.next}</button>
      </>
    );

    // settings
    const nextSettingsDisabled = (this.state.addonData === '') ? true : false;
    const importSettings = (
      <>
        <h3>{welcome.sections.settings.title}</h3>
        <div className='themesToggleArea'>
          <div className='options'>
            <div className={this.state.settingsClasses.current} onClick={() => this.importSettings()}>
              <span>{addons.create.settings.current}</span>
            </div>
            <div className={this.state.settingsClasses.json} onClick={() => document.getElementById('file-input').click()}>
              <span>{addons.create.settings.json}</span>
            </div>
          </div>
        </div>
        <FileUpload id='file-input' type='settings' accept='application/json' loadFunction={(e) => this.importSettings(JSON.parse(e.target.result))} />
        <br/><br/>
        <button onClick={() => this.changeTab(2)} className='uploadbg' style={{ marginRight: '10px' }}>{welcome.buttons.previous}</button>
        <button onClick={() => this.changeTab(3)} className='uploadbg' disabled={nextSettingsDisabled}>{welcome.buttons.next}</button>
      </>
    );
    
    // quotes
    const addQuotes = (
      <>
        <h3>{addons.create.quotes.title}</h3>
      </>
    );

    // photos
    const addPhotos = (
      <>
        <h3>{addons.create.photos.title}</h3>
      </>
    );

    const downloadAddon = (
      <>
        <h3>{addons.create.finish.title}</h3>
        <button onClick={() => this.downloadAddon()} className='upload'>{addons.create.finish.download}</button>
        <br/><br/>
        <button onClick={() => this.changeTab(this.state.addonMetadata.type)} className='uploadbg' style={{ marginRight: '10px' }}>{welcome.buttons.previous}</button>
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
        <h2>{addons.create.other_title}</h2>
        {tabContent}
      </>
    );
  }
}
