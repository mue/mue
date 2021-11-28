import variables from 'modules/variables';
import { PureComponent } from 'react';
import { 
  SettingsRounded as Settings, 
  PhotoOutlined as Photos, 
  FormatQuoteOutlined as Quotes,
  Upload as ImportIcon,
  Download as ExportIcon,
} from '@mui/icons-material';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';

import { saveFile } from 'modules/helpers/settings/modals';

import FileUpload from '../../settings/FileUpload';
import Dropdown from '../../settings/Dropdown';

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
      if (key === 'statsData' || key === 'firstRun' || key === 'showWelcome' || key === 'language' || key === 'installed' || key === 'stats' || key === 'backup_settings' || key === 'showReminder' 
      || key === 'experimental' || key === 'debugtimeout' || key === 'quotelanguage') {
        return;
      }
      settings[key] = localStorage.getItem(key);
    });

    this.setState({
      addonData: settings,
      settingsClasses: {
        current: input ? 'toggle lightTheme' : 'toggle lightTheme',
        json: input ? 'toggle lightTheme' : 'toggle lightTheme'
      }
    });

    toast(variables.language.getMessage(variables.languagecode, 'toasts.imported'));
  }

  updateQuotePackType(type) {
    if (type === 'quotePack') {
      this.setState({ 
        addonMetadata: {
          type,
          name: this.state.addonMetadata.name,
          description: this.state.addonMetadata.description,
          version: this.state.addonMetadata.version,
          author: this.state.addonMetadata.author,
          icon_url: this.state.addonMetadata.icon_url,
          screenshot_url: this.state.addonMetadata.screenshot_url,
          quotes: []
        }
      });
    } else {
      this.setState({ 
        addonMetadata: {
          type,
          name: this.state.addonMetadata.name,
          description: this.state.addonMetadata.description,
          version: this.state.addonMetadata.version,
          author: this.state.addonMetadata.author,
          icon_url: this.state.addonMetadata.icon_url,
          screenshot_url: this.state.addonMetadata.screenshot_url
        },
        addonData: {
          url: '',
          name: '',
          author: ''
        }
      });
    }
  }
  
  updateQuotePackAPI(type, data) {
    this.setState({
      addonData: {
        url: (type === 'url') ? data : this.state.addonData.url || '',
        name: (type === 'name') ? data : this.state.addonData.name || '',
        author: (type === 'author') ? data : this.state.addonData.author || '',
      }
    });
  }

  importQuotes() {
    this.setState({
      addonData: JSON.parse(localStorage.getItem('customQuote')) || []
    });

    toast(variables.language.getMessage(variables.languagecode, 'toasts.imported'));
  }

  importPhotos() {
    let data = [];
    try {
      const current = JSON.parse(localStorage.getItem('customBackground')) || [];
      data = current.map((item) => {
        return {
          photographer: '???',
          location: '???',
          url: {
            default: item
          }
        }
      });
      toast(variables.language.getMessage(variables.languagecode, 'toasts.imported'));
    } catch (e) {
      console.log(e);
      toast(variables.language.getMessage(variables.languagecode, 'toasts.error'));
    }

    this.setState({
      addonData: data
    });
  }

  downloadAddon() {
    saveFile({
      name: this.state.addonMetadata.name,
      description: this.state.addonMetadata.description,
      type: (this.state.addonMetadata.type === 'quote_api') ? 'quotes' : this.state.addonMetadata.type,
      version: this.state.addonMetadata.version,
      author: this.state.addonMetadata.author,
      icon_url: this.state.addonMetadata.icon_url,
      screenshot_url: this.state.addonMetadata.screenshot_url,
      [this.state.addonMetadata.type]: this.state.addonData
    }, this.state.addonMetadata.name + '.json');
  }

  render() {
    let tabContent;

    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    const chooseType = (
      <>
        <h3>{getMessage('modals.main.settings.sections.time.type')}</h3>
        <div className='themesToggleArea'>
          <div className='options'>
            <div className='toggle lightTheme' onClick={() => this.changeTab(2, 'photos')}>
              <Photos/>
              <span>{getMessage('modals.main.marketplace.photo_packs')}</span>
            </div>
            <div className='toggle lightTheme' onClick={() => this.changeTab(2, 'quotes')}>
              <Quotes/>
              <span>{getMessage('modals.main.marketplace.quote_packs')}</span>
            </div> 
            <div className='toggle lightTheme' onClick={() => this.changeTab(2, 'settings')}>
              <Settings/>
              <span>{getMessage('modals.main.marketplace.preset_settings')}</span>
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
    };

    const writeDescription = ( 
      <>
        <h3>{getMessage('modals.main.marketplace.product.information')}</h3>
        <TextField label={getMessage('modals.main.addons.create.metadata.name')} varient='outlined' InputLabelProps={{ shrink: true }} value={this.state.addonMetadata.name} onInput={(e) => setMetadata(e.target.value, 'name')}/>
        <TextField label={getMessage('modals.main.marketplace.product.version')} varient='outlined' InputLabelProps={{ shrink: true }} value={this.state.addonMetadata.version} onInput={(e) => setMetadata(e.target.value, 'version')}/>
        <TextField label={getMessage('modals.main.marketplace.product.author')} varient='outlined' InputLabelProps={{ shrink: true }} value={this.state.addonMetadata.author} onInput={(e) => setMetadata(e.target.value, 'author')}/>
        <TextField label={getMessage('modals.main.addons.create.metadata.icon_url')} varient='outlined' InputLabelProps={{ shrink: true }} value={this.state.addonMetadata.icon_url} onInput={(e) => setMetadata(e.target.value, 'icon_url')}/>
        <TextField label={getMessage('modals.main.addons.create.metadata.screenshot_url')} varient='outlined' InputLabelProps={{ shrink: true }} value={this.state.addonMetadata.screenshot_url} onInput={(e) => setMetadata(e.target.value, 'screenshot_url')}/>
        <TextField label={getMessage('modals.main.addons.create.metadata.description')} varient='outlined' InputLabelProps={{ shrink: true }} multiline spellCheck={false} rows={4} InputLabelProps={{ shrink: true }} value={this.state.addonMetadata.description} onInput={(e) => setMetadata(e.target.value, 'description')}/>
        <br/>
        <button onClick={() => this.changeTab(1)} className='uploadbg' style={{ marginRight: '10px' }}>{getMessage('modals.welcome.buttons.previous')}</button>
        <button onClick={() => this.changeTab(this.state.addonMetadata.type)} className='uploadbg' disabled={nextDescriptionDisabled}>{getMessage('modals.welcome.buttons.next')}</button>
      </>
    );

    // settings
    const nextSettingsDisabled = (this.state.addonData === '') ? true : false;
    const importSettings = (
      <>
        <h3>{getMessage('modals.welcome.sections.settings.title')}</h3>
        <div className='themesToggleArea' >
          <div className='options' style={{ maxWidth: '512px' }}>
            <div className={this.state.settingsClasses.current} onClick={() => this.importSettings()}>
              <ExportIcon/>
              <span>{getMessage('modals.main.addons.create.settings.current')}</span>
            </div>
            <div className={this.state.settingsClasses.json} onClick={() => document.getElementById('file-input').click()}>
              <ImportIcon/>
              <span>{getMessage('modals.main.addons.create.settings.json')}</span>
            </div>
          </div>
        </div>
        <FileUpload id='file-input' type='settings' accept='application/json' loadFunction={(e) => this.importSettings(JSON.parse(e.target.result))} />
        <br/><br/>
        <button onClick={() => this.changeTab(2)} className='uploadbg' style={{ margin: '10px' }}>{getMessage('modals.welcome.buttons.previous')}</button>
        <button onClick={() => this.changeTab(3)} className='uploadbg' style={{ margin: '10px' }} disabled={nextSettingsDisabled}>{getMessage('modals.welcome.buttons.next')}</button>
      </>
    );
    
    // quotes
    const nextQuotesDisabled = ((this.state.addonMetadata.type === 'quote_api' && this.state.addonData.url !== '' && this.state.addonData.name !== '' && this.state.addonData.author !== '') 
      || (this.state.addonMetadata.type === 'quotes' && this.state.addonData.quotes !== '')) ? false : true;
    const addQuotes = (
      <>
        <h3>{getMessage('modals.main.addons.create.quotes.title')}</h3>
        <Dropdown label={getMessage('modals.main.settings.sections.time.type')} noSetting onChange={(e) => this.updateQuotePackType(e)}>
          <option value='quotes'>{getMessage('modals.main.addons.create.quotes.local.title')}</option>
          <option value='quote_api'>{getMessage('modals.main.addons.create.quotes.api.title')}</option>
        </Dropdown>
        {this.state.addonMetadata.type === 'quote_api' ? <>
          <TextField label={getMessage('modals.main.addons.create.quotes.api.url')} varient='outlined' InputLabelProps={{ shrink: true }} value={this.state.addonData.url} onInput={(e) => this.updateQuotePack(e.target.value, 'url')}/>
          <TextField label={getMessage('modals.main.addons.create.quotes.api.name')} varient='outlined' InputLabelProps={{ shrink: true }} value={this.state.addonData.name} onInput={(e) => this.updateQuotePack(e.target.value, 'name')}/>
          <TextField label={getMessage('modals.main.addons.create.quotes.api.author')} varient='outlined' InputLabelProps={{ shrink: true }} value={this.state.addonData.author} onInput={(e) => this.updateQuotePack(e.target.value, 'author')}/>
          <br/><br/>
        </> : <>
        <div className='themesToggleArea'>
          <div className='options'>
            <div onClick={() => this.importQuotes()} className='toggle lightTheme' style={{ width: '60%', margin: '10px 0 10px 0' }}>
              <ExportIcon/>
              <span>{getMessage('modals.main.addons.create.settings.current')}</span>
            </div>
          </div>
        </div>
        <br/>
        </>}
        <button onClick={() => this.changeTab(2)} className='uploadbg'>{getMessage('modals.welcome.buttons.previous')}</button>
        <button onClick={() => this.changeTab(3)} className='uploadbg' style={{ margin: '10px' }} disabled={nextQuotesDisabled}>{getMessage('modals.welcome.buttons.next')}</button>
      </>
    );

    // photos
    const nextPhotosDisabled = (this.state.addonData.photos !== '' && this.state.addonData.photos !== []) ? false : true;
    const addPhotos = (
      <>
        <h3>{getMessage('modals.main.addons.create.photos.title')}</h3>
        <div className='themesToggleArea'>
          <div className='options'>
            <div onClick={() => this.importPhotos()} className='toggle lightTheme' style={{ width: '60%', margin: '10px 0 10px 0' }}>
              <ExportIcon/>
              <span>{getMessage('modals.main.addons.create.settings.current')}</span>
            </div>
          </div>
        </div>
        <br/>
        <button onClick={() => this.changeTab(2)} className='uploadbg'>{getMessage('modals.welcome.buttons.previous')}</button>
        <button onClick={() => this.changeTab(3)} className='uploadbg' style={{ margin: '10px' }} disabled={nextPhotosDisabled}>{getMessage('modals.welcome.buttons.next')}</button>
      </>
    );

    const downloadAddon = (
      <>
        <div className='themesToggleArea'>
          <div className='options'>
            <div onClick={() => this.downloadAddon()} className='toggle lightTheme' style={{ width: '60%', margin: '10px 0 10px 0' }}>
              <ExportIcon/>
              <span>{getMessage('modals.main.addons.create.finish.download')}</span>
            </div>
          </div>
        </div>
        <br/>
        <button onClick={() => this.changeTab((this.state.addonMetadata.type === 'quote_api') ? 'quotes' : this.state.addonMetadata.type)} className='uploadbg' style={{ marginRight: '10px' }}>{getMessage('modals.welcome.buttons.previous')}</button>
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
        <h2>{getMessage('modals.main.addons.create.other_title')}</h2>
        {tabContent}
      </>
    );
  }
}
