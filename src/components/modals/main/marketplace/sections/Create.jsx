import variables from 'modules/variables';
import { PureComponent } from 'react';
import {
  MdSettings as Settings,
  MdOutlineInsertPhoto as Photos,
  MdOutlineFormatQuote as Quotes,
  MdUpload as ImportIcon,
  MdDownload as ExportIcon,
  MdArrowBack,
  MdDownload,
  MdOpenInNew,
} from 'react-icons/md';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import SettingsItem from '../../../main/settings/SettingsItem';

import { saveFile } from 'modules/helpers/settings/modals';
import InfoTooltip from '../../../../helpers/tooltip/InfoTooltip';

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
        screenshot_url: '',
      },
      addonData: '',
      settingsClasses: {
        current: 'toggle lightTheme',
        json: 'toggle lightTheme',
      },
    };
  }

  changeTab(tab, type) {
    if (type) {
      return this.setState({
        currentTab: tab,
        addonMetadata: {
          type,
        },
      });
    } else {
      this.setState({
        currentTab: tab,
      });
    }
  }

  importSettings(input) {
    const data = input || localStorage;
    let settings = {};
    Object.keys(data).forEach((key) => {
      if (
        key === 'statsData' ||
        key === 'firstRun' ||
        key === 'showWelcome' ||
        key === 'language' ||
        key === 'installed' ||
        key === 'stats' ||
        key === 'backup_settings' ||
        key === 'showReminder' ||
        key === 'experimental' ||
        key === 'debugtimeout' ||
        key === 'quotelanguage'
      ) {
        return;
      }
      settings[key] = localStorage.getItem(key);
    });

    this.setState({
      addonData: settings,
      settingsClasses: {
        current: input ? 'toggle lightTheme active' : 'toggle lightTheme',
        json: input ? 'toggle lightTheme active' : 'toggle lightTheme',
      },
    });

    toast(variables.language.getMessage(variables.languagecode, 'toasts.imported'));
  }

  importQuotes() {
    this.setState({
      addonData: JSON.parse(localStorage.getItem('customQuote')) || [],
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
            default: item,
          },
        };
      });
      toast(variables.language.getMessage(variables.languagecode, 'toasts.imported'));
    } catch (e) {
      console.log(e);
      toast(variables.language.getMessage(variables.languagecode, 'toasts.error'));
    }

    this.setState({
      addonData: data,
    });
  }

  downloadAddon() {
    saveFile(
      {
        name: this.state.addonMetadata.name,
        description: this.state.addonMetadata.description,
        type: this.state.addonMetadata.type,
        version: this.state.addonMetadata.version,
        author: this.state.addonMetadata.author,
        icon_url: this.state.addonMetadata.icon_url,
        screenshot_url: this.state.addonMetadata.screenshot_url,
        [this.state.addonMetadata.type]: this.state.addonData,
      },
      this.state.addonMetadata.name + '.json',
    );
  }

  render() {
    let tabContent;
    const getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

    const chooseType = (
      <>
        <div className="smallBanner">
          <div className="content">
            <span className="title">Help Centre</span>
            <span className="subtitle">
              Home of all docs and guides on creating addons for Mue's marketplace
            </span>
          </div>
          <button>
            Open Site
            <MdOpenInNew />
          </button>
        </div>
        <div className="themesToggleArea">
          <div className="options">
            <div className="toggle lightTheme" onClick={() => this.changeTab(2, 'photos')}>
              <Photos />
              <span>{getMessage('modals.main.marketplace.photo_packs')}</span>
            </div>
            <div className="toggle lightTheme" onClick={() => this.changeTab(2, 'quotes')}>
              <Quotes />
              <span>{getMessage('modals.main.marketplace.quote_packs')}</span>
            </div>
            <div className="toggle lightTheme" onClick={() => this.changeTab(2, 'settings')}>
              <Settings />
              <span>{getMessage('modals.main.marketplace.preset_settings')}</span>
            </div>
          </div>
        </div>
      </>
    );

    // todo: find a better way to do all this
    const nextDescriptionDisabled = !(
      this.state.addonMetadata.name !== undefined &&
      this.state.addonMetadata.description !== undefined &&
      this.state.addonMetadata.version !== undefined &&
      this.state.addonMetadata.author !== undefined &&
      this.state.addonMetadata.icon_url !== undefined &&
      this.state.addonMetadata.screenshot_url !== undefined
    );

    const setMetadata = (data, type) => {
      this.setState({
        addonMetadata: {
          name: type === 'name' ? data : this.state.addonMetadata.name,
          description: type === 'description' ? data : this.state.addonMetadata.description,
          version: type === 'version' ? data : this.state.addonMetadata.version,
          author: type === 'author' ? data : this.state.addonMetadata.author,
          icon_url: type === 'icon_url' ? data : this.state.addonMetadata.icon_url,
          screenshot_url:
            type === 'screenshot_url' ? data : this.state.addonMetadata.screenshot_url,
          type: this.state.addonMetadata.type,
        },
      });
    };

    const writeDescription = (
      <>
        <div className="smallBanner">
          <div className="content">
            <span className="title" style={{ textTransform: 'capitalize' }}>
              Create {this.state.addonMetadata.type} Pack
            </span>
            <span className="subtitle">Description of what is being made</span>
          </div>
          <button>
            Example
            <MdDownload />
          </button>
        </div>
        <SettingsItem title={getMessage('modals.main.addons.create.metadata.name')}>
          <TextField
            varient="outlined"
            InputLabelProps={{ shrink: true }}
            value={this.state.addonMetadata.name}
            onInput={(e) => setMetadata(e.target.value, 'name')}
          />
        </SettingsItem>
        {/*<SettingsItem title={getMessage('modals.main.marketplace.product.version')}>
          <TextField
            varient="outlined"
            InputLabelProps={{ shrink: true }}
            value={this.state.addonMetadata.version}
            onInput={(e) => setMetadata(e.target.value, 'version')}
          />
    </SettingsItem>*/}
        <div className="settingsRow">
          <div className="content">
            <span className="title">{getMessage('modals.main.marketplace.product.version')}</span>
            <span className="subtitle">
              <InfoTooltip
                title="Information"
                subtitle="Running away is easy It's the leaving that's hard Running away is easy It's the leaving that's hard"
              />
            </span>
          </div>
          <div className="action">
            <TextField
              varient="outlined"
              InputLabelProps={{ shrink: true }}
              value={this.state.addonMetadata.version}
              onInput={(e) => setMetadata(e.target.value, 'version')}
            />
          </div>
        </div>
        <SettingsItem title={getMessage('modals.main.marketplace.product.author')}>
          <TextField
            varient="outlined"
            InputLabelProps={{ shrink: true }}
            value={this.state.addonMetadata.author}
            onInput={(e) => setMetadata(e.target.value, 'author')}
          />
        </SettingsItem>
        <SettingsItem title={getMessage('modals.main.addons.create.metadata.icon_url')}>
          <TextField
            varient="outlined"
            InputLabelProps={{ shrink: true }}
            value={this.state.addonMetadata.icon_url}
            onInput={(e) => setMetadata(e.target.value, 'icon_url')}
          />
        </SettingsItem>
        <SettingsItem title={getMessage('modals.main.addons.create.metadata.screenshot_url')}>
          <TextField
            varient="outlined"
            InputLabelProps={{ shrink: true }}
            value={this.state.addonMetadata.screenshot_url}
            onInput={(e) => setMetadata(e.target.value, 'screenshot_url')}
          />
        </SettingsItem>
        <SettingsItem
          title={getMessage('modals.main.addons.create.metadata.description')}
          final={true}
        >
          <TextField
            varient="outlined"
            InputLabelProps={{ shrink: true }}
            multiline
            spellCheck={false}
            rows={4}
            value={this.state.addonMetadata.description}
            onInput={(e) => setMetadata(e.target.value, 'description')}
          />
        </SettingsItem>
        <div className="createButtons">
          <button onClick={() => this.changeTab(1)}>
            {getMessage('modals.welcome.buttons.previous')}
          </button>
          <button
            onClick={() => this.changeTab(this.state.addonMetadata.type)}
            disabled={nextDescriptionDisabled}
          >
            {getMessage('modals.welcome.buttons.next')}
          </button>
        </div>
      </>
    );

    // settings
    const nextSettingsDisabled = this.state.addonData === '';
    const importSettings = (
      <>
        <SettingsItem final={true} title={getMessage('modals.welcome.sections.settings.title')}>
          <div className="themesToggleArea">
            <div className="options" style={{ maxWidth: '512px' }}>
              <div
                className={this.state.settingsClasses.current}
                onClick={() => this.importSettings()}
              >
                <ExportIcon />
                <span>{getMessage('modals.main.addons.create.settings.current')}</span>
              </div>
              <div
                className={this.state.settingsClasses.json}
                onClick={() => document.getElementById('file-input').click()}
              >
                <ImportIcon />
                <span>{getMessage('modals.main.addons.create.settings.json')}</span>
              </div>
            </div>
          </div>
        </SettingsItem>
        <SettingsItem final={true}>
          <FileUpload
            id="file-input"
            type="settings"
            accept="application/json"
            loadFunction={(e) => this.importSettings(JSON.parse(e.target.result))}
          />
        </SettingsItem>
        <div className="createButtons">
          <button onClick={() => this.changeTab(2)}>
            {getMessage('modals.welcome.buttons.previous')}
          </button>
          <button onClick={() => this.changeTab(3)} disabled={nextSettingsDisabled}>
            {getMessage('modals.welcome.buttons.next')}
          </button>
        </div>
      </>
    );

    // quotes
    const nextQuotesDisabled = !(
      this.state.addonMetadata.type === 'quotes' && this.state.addonData.quotes !== ''
    );
    const addQuotes = (
      <>
        <SettingsItem final={true} title={getMessage('modals.main.addons.create.quotes.title')} />
        <SettingsItem final={true} title={getMessage('modals.main.addons.create.settings.current')}>
          <div className="themesToggleArea">
            <div className="options">
              <div
                onClick={() => this.importQuotes()}
                className="toggle lightTheme"
                style={{ width: '60%', margin: '10px 0 10px 0' }}
              >
                <ExportIcon />
                <span>{getMessage('modals.main.addons.create.settings.current')}</span>
              </div>
            </div>
          </div>
        </SettingsItem>
        <div className="createButtons">
          <button onClick={() => this.changeTab(2)}>
            {getMessage('modals.welcome.buttons.previous')}
          </button>
          <button onClick={() => this.changeTab(3)} disabled={nextQuotesDisabled}>
            {getMessage('modals.welcome.buttons.next')}
          </button>
        </div>
      </>
    );

    // photos
    const nextPhotosDisabled = !(
      this.state.addonData.photos !== '' && this.state.addonData.photos !== []
    );
    const addPhotos = (
      <>
        <SettingsItem
          final={true}
          title={getMessage('modals.main.addons.create.photos.title')}
          subtitle={'Import from custom settings.'}
        >
          <div className="themesToggleArea">
            <div className="options">
              <div
                onClick={() => this.importPhotos()}
                className="toggle lightTheme"
                style={{ width: '60%', margin: '10px 0 10px 0' }}
              >
                <ExportIcon />
                <span>{getMessage('modals.main.addons.create.settings.current')}</span>
              </div>
            </div>
          </div>
        </SettingsItem>
        <br />
        <div className="createButtons">
          <button onClick={() => this.changeTab(2)}>
            {getMessage('modals.welcome.buttons.previous')}
          </button>
          <button onClick={() => this.changeTab(3)} disabled={nextPhotosDisabled}>
            {getMessage('modals.welcome.buttons.next')}
          </button>
        </div>
      </>
    );

    const downloadAddon = (
      <>
        <div className="smallBanner">
          <div className="content">
            <span className="title" style={{ textTransform: 'capitalize' }}>
              Next step, Publishing...
            </span>
            <span className="subtitle">
              Visit the Mue Knowledgebase on information on how to publish your newly created addon.
            </span>
          </div>
          <button>
            Learn More
            <MdOpenInNew />
          </button>
        </div>
        <SettingsItem final={true}>
          <div className="themesToggleArea">
            <div className="options">
              <div
                onClick={() => this.downloadAddon()}
                className="toggle lightTheme"
                style={{ width: '60%', margin: '10px 0 10px 0' }}
              >
                <ExportIcon />
                <span>{getMessage('modals.main.addons.create.finish.download')}</span>
              </div>
            </div>
          </div>
        </SettingsItem>
        <div className="createButtons">
          <button
            onClick={() => this.changeTab(this.state.addonMetadata.type)}
            disabled={nextDescriptionDisabled}
          >
            {getMessage('modals.welcome.buttons.previous')}
          </button>
        </div>
      </>
    );

    switch (this.state.currentTab) {
      case 2:
        tabContent = writeDescription;
        break;
      case 'settings':
        tabContent = importSettings;
        break;
      case 'quotes':
        tabContent = addQuotes;
        break;
      case 'photos':
        tabContent = addPhotos;
        break;
      case 3:
        tabContent = downloadAddon;
        break;
      default:
        tabContent = chooseType;
    }

    return (
      <>
        <div className="flexTopMarketplace">
          {this.state.currentTab !== 1 && (
            <div className="returnButton">
              <Tooltip title="Go back" key="backArrow">
                <MdArrowBack
                  className="backArrow"
                  onClick={() => this.changeTab(this.state.currentTab - 1)}
                />
              </Tooltip>
            </div>
          )}
          <span className="mainTitle">{getMessage('modals.main.addons.create.other_title')}</span>
        </div>
        {tabContent}
      </>
    );
  }
}
