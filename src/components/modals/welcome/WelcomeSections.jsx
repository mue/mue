import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdCloudUpload, MdAutoAwesome, MdLightMode, MdDarkMode } from 'react-icons/md';

import Radio from '../main/settings/Radio';
import Checkbox from '../main/settings/Checkbox';
import FileUpload from '../main/settings/FileUpload';

import { loadSettings } from 'modules/helpers/settings';
import { importSettings } from 'modules/helpers/settings/modals';

const languages = require('modules/languages.json');
const default_settings = require('modules/default_settings.json');

export default class WelcomeSections extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      // themes
      autoClass: 'toggle auto active',
      lightClass: 'toggle lightTheme',
      darkClass: 'toggle darkTheme',
      // welcome
      welcomeImage: 0,
      // final
      importedSettings: []
    };
    this.changeWelcomeImg = this.changeWelcomeImg.bind(this);
    this.welcomeImages = ['./welcome-images/example1.webp', './welcome-images/example2.webp', './welcome-images/example3.webp', './welcome-images/example4.webp'];
  }

  changeTheme(type) {
    this.setState({
      autoClass: (type === 'auto') ? 'toggle auto active' : 'toggle auto',
      lightClass: (type === 'light') ? 'toggle lightTheme active' : 'toggle lightTheme',
      darkClass: (type === 'dark') ? 'toggle darkTheme active': 'toggle darkTheme'
    });

    localStorage.setItem('theme', type);
    loadSettings(true);
  }

  getSetting(name) {
    const value = localStorage.getItem(name).replace('false', 'Off').replace('true', 'On');
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  importSettings(e) {
    importSettings(e);

    let settings = [];
    const data = JSON.parse(e.target.result);
    Object.keys(data).forEach((setting) => {
      // language and theme already shown, the others are only used internally
      if (setting === 'language' || setting === 'theme'|| setting === 'firstRun' || setting === 'showWelcome' || setting === 'showReminder') {
        return;
      }

      const defaultSetting = default_settings.find((i) => i.name === setting);
      if (defaultSetting !== undefined) {
        if (data[setting] === String(defaultSetting.value)) {
          return;
        }
      }

      settings.push({
        name: setting,
        value: data[setting]
      });
    });

    this.setState({
      importedSettings: settings
    });

    this.props.switchTab(5);
  }

  changeWelcomeImg() {
    let welcomeImage = this.state.welcomeImage;

    this.setState({
      welcomeImage: ++welcomeImage % this.welcomeImages.length
    });

    this.timeout = setTimeout(this.changeWelcomeImg, 3 * 1000);
  }

  componentDidMount() {
    this.timeout = setTimeout(this.changeWelcomeImg, 3 * 1000);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  // cancel welcome image timer if not on welcome tab
  componentDidUpdate() {
    if (this.props.currentTab !== 0) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
    } else {
      if (!this.timeout) {
        this.timeout = setTimeout(this.changeWelcomeImg, 3 * 1000);
      }
    }
  }

  render() {
    let tabContent;
  
    const intro = (
      <>
        <h1>{this.getMessage('modals.welcome.sections.intro.title')}</h1>
        <p>{this.getMessage('modals.welcome.sections.intro.description')}</p>
        <h3 className='quicktip'>#shareyourmue</h3>
        <div className='examples'>
          <img src={this.welcomeImages[this.state.welcomeImage]} alt='Example Mue setup' draggable={false}/>
        </div>
      </>
    );
  
    const chooseLanguage = (
      <>
        <h1>{this.getMessage('modals.welcome.sections.language.title')}</h1>
        <p>{this.getMessage('modals.welcome.sections.language.description')} <a href={variables.constants.TRANSLATIONS_URL} className='resetLink' target='_blank' rel='noopener noreferrer'>GitHub</a>!</p>
        <Radio name='language' options={languages} category='welcomeLanguage'/>
      </>
    );

    const theme = (
      <>
        <h1>{this.getMessage('modals.welcome.sections.theme.title')}</h1>
        <p>{this.getMessage('modals.welcome.sections.theme.description')}</p>
        <div className='themesToggleArea'>
          <div className={this.state.autoClass} onClick={() => this.changeTheme('auto')}>
            <MdAutoAwesome/>
            <span>{this.getMessage('modals.main.settings.sections.appearance.theme.auto')}</span>
          </div>
          <div className='options'>
            <div className={this.state.lightClass} onClick={() => this.changeTheme('light')}>
              <MdLightMode/>
              <span>{this.getMessage('modals.main.settings.sections.appearance.theme.light')}</span>
            </div>
            <div className={this.state.darkClass} onClick={() => this.changeTheme('dark')}>
              <MdDarkMode/>
              <span>{this.getMessage('modals.main.settings.sections.appearance.theme.dark')}</span>
            </div>
          </div>
          <h3 className='quicktip'>{this.getMessage('modals.welcome.tip')}</h3>
          <p>{this.getMessage('modals.welcome.sections.theme.tip')}</p>
        </div>
      </>
    );
  
    const settings = (
      <>
        <h1>{this.getMessage('modals.welcome.sections.settings.title')}</h1>
        <p>{this.getMessage('modals.welcome.sections.settings.description')}</p>
        <button className='upload' onClick={() => document.getElementById('file-input').click()}>
          <MdCloudUpload/>
          <br/>
          <span>{this.getMessage('modals.main.settings.buttons.import')}</span>
        </button>
        <FileUpload id='file-input' accept='application/json' type='settings' loadFunction={(e) => this.importSettings(e)}/>
        <h3 className='quicktip'>{this.getMessage('modals.welcome.tip')}</h3>
        <p>{this.getMessage('modals.welcome.sections.settings.tip')}</p>
      </>
    );

    const privacy = (
      <>
        <h1>{this.getMessage('modals.welcome.sections.privacy.title')}</h1>
        <p>{this.getMessage('modals.welcome.sections.privacy.description')}</p>
        <Checkbox name='offlineMode' text={this.getMessage('modals.main.settings.sections.advanced.offline_mode')} element='.other' />
        <p>{this.getMessage('modals.welcome.sections.privacy.offline_mode_description')}</p>
        <Checkbox name='quicklinksddgProxy' text={this.getMessage('modals.main.settings.sections.background.ddg_image_proxy') + ' (' + this.getMessage('modals.main.settings.sections.quicklinks.title') + ')'}/>
        <Checkbox name='ddgProxy' text={this.getMessage('modals.main.settings.sections.background.ddg_image_proxy') + ' (' +this.getMessage('modals.main.settings.sections.background.title') + ')'}/>
        <p>{this.getMessage('modals.welcome.sections.privacy.ddg_proxy_description')}</p>
        <h3 className='quicktip'>{this.getMessage('modals.welcome.sections.privacy.links.title')}</h3>
        <a className='privacy' href={variables.constants.PRIVACY_URL} target='_blank' rel='noopener noreferrer'>{this.getMessage('modals.welcome.sections.privacy.links.privacy_policy')}</a>
        <br/><br/>
        <a className='privacy' href={'https://github.com/' + variables.constants.ORG_NAME} target='_blank' rel='noopener noreferrer'>{this.getMessage('modals.welcome.sections.privacy.links.source_code')}</a>
      </>
    );

    const final = (
      <>
        <h1>{this.getMessage('modals.welcome.sections.final.title')}</h1>
        <p>{this.getMessage('modals.welcome.sections.final.description')}</p>
        <h3 className='quicktip'>{this.getMessage('modals.welcome.sections.final.changes')}</h3>
        <p>{this.getMessage('modals.welcome.sections.final.changes_description')}</p>
        <div className='themesToggleArea'>
          <div className='toggle' onClick={() => this.props.switchTab(1)}><span>{this.getMessage('modals.main.settings.sections.language.title')}: {languages.find((i) => i.value === localStorage.getItem('language')).name}</span></div>
          <div className='toggle' onClick={() => this.props.switchTab(3)}><span>{this.getMessage('modals.main.settings.sections.appearance.theme.title')}: {this.getSetting('theme')}</span></div>
          {(this.state.importedSettings.length !== 0) ? <div className='toggle' onClick={() => this.props.switchTab(2)}>{this.getMessage('modals.main.settings.sections.final.imported', { amount: this.state.importedSettings.length })} {this.state.importedSettings.length}</div> : null}
        </div>
      </>
    );
  
    switch (this.props.currentTab) {
      case 1: tabContent = chooseLanguage; break;
      case 2: tabContent = settings; break;
      case 3: tabContent = theme; break;
      case 4: tabContent = privacy; break;
      case 5: tabContent = final; break;
      // 0
      default: tabContent = intro;
    }
  
    return tabContent;
  }
}
