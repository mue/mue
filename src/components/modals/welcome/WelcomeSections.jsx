import React from 'react';

import Radio from '../main/settings/Radio';
import Checkbox from '../main/settings/Checkbox';
import FileUpload from '../main/settings/FileUpload';

import UploadIcon from '@material-ui/icons/CloudUpload';
import AutoIcon from '@material-ui/icons/AutoAwesome';
import LightModeIcon from '@material-ui/icons/LightMode';
import DarkModeIcon from '@material-ui/icons/DarkMode';

import SettingsFunctions from '../../../modules/helpers/settings';
import SettingsFunctionsModal from '../../../modules/helpers/settings/modals';

const languages = require('../../../modules/languages.json');
const default_settings = require('../../../modules/default_settings.json');

export default class WelcomeSections extends React.Component {
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
    SettingsFunctions.loadSettings(true);
  }

  getSetting(name) {
    const value = localStorage.getItem(name).replace('false', 'Off').replace('true', 'On');
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  importSettings(e) {
    SettingsFunctionsModal.importSettings(e);

    let settings = [];
    const data = JSON.parse(e.target.result);
    Object.keys(data).forEach((setting) => {
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

  // cancel welcome image timer if not on welcome tab
  componentDidUpdate() {
  	if (this.props.currentTab !== 0) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    } else {
      if (!this.timeout) {
        this.timeout = setTimeout(this.changeWelcomeImg, 3 * 1000);
      }
    }
  }

  render() {
    const language = window.language.modals.welcome;
    let tabContent;
  
    const intro = (
      <>
        <h1>{language.sections.intro.title}</h1>
        <p>{language.sections.intro.description}</p>
        <h3 className='quicktip'>#shareyourmue</h3>
        <div className='examples'>
          <img src={this.welcomeImages[this.state.welcomeImage]} alt='example mue setup' draggable={false}/>
        </div>
      </>
    );
  
    const chooseLanguage = (
      <>
        <h1>{language.sections.language.title}</h1>
        <p>{language.sections.language.description}</p>
        <Radio name='language' options={languages}/>
      </>
    );
  
    const { appearance, advanced } = window.language.modals.main.settings.sections;
    const languageSettings = window.language.modals.main.settings.sections.language;

    const theme = (
      <>
        <h1>{language.sections.theme.title}</h1>
        <p>{language.sections.theme.description}</p>
        <div className='themesToggleArea'>
          <div className={this.state.autoClass} onClick={() => this.changeTheme('auto')}>
            <AutoIcon/>
            <span>{appearance.theme.auto}</span>
          </div>
          <div className='options'>
            <div className={this.state.lightClass} onClick={() => this.changeTheme('light')}>
              <LightModeIcon/>
              <span>{appearance.theme.light}</span>
            </div>
            <div className={this.state.darkClass} onClick={() => this.changeTheme('dark')}>
              <DarkModeIcon/>
              <span>{appearance.theme.dark}</span>
            </div>
          </div>
          <h3 className='quicktip'>{language.tip}</h3>
          <p>{language.sections.theme.tip}</p>
        </div>
      </>
    );
  
    const settings = (
      <>
        <h1>{language.sections.settings.title}</h1>
        <p>{language.sections.settings.description}</p>
        <button className='upload' onClick={() => document.getElementById('file-input').click()}>
          <UploadIcon/>
          <br/>
          <span>{window.language.modals.main.settings.buttons.import}</span>
        </button>
        <FileUpload id='file-input' accept='application/json' type='settings' loadFunction={(e) => this.importSettings(e)}/>
        <h3 className='quicktip'>{language.tip}</h3>
        <p>{language.sections.settings.tip}</p>
      </>
    );

    const privacy = (
      <>
        <h1>{language.sections.privacy.title}</h1>
        <p>{language.sections.privacy.description}</p>
        <Checkbox name='offlineMode' text={advanced.offline_mode} element='.other' />
        <p>{language.sections.privacy.offline_mode_description}</p>
        <h3 className='quicktip'>{language.sections.privacy.links.title}</h3>
        <a className='privacy' href='https://muetab.com/privacy' target='_blank' rel='noopener noreferrer'>{language.sections.privacy.links.privacy_policy}</a>
      </>
    );

    const final = (
      <>
        <h1>{language.sections.final.title}</h1>
        <p>{language.sections.final.description}</p>
        <h3 className='quicktip'>{language.sections.final.changes}</h3>
        <p>{language.sections.final.changes_description}</p>
        <div className='themesToggleArea'>
          <div className='toggle' onClick={() => this.props.switchTab(1)}>{languageSettings.title}: {languages.find((i) => i.value === localStorage.getItem('language')).name}</div>
          <div className='toggle' onClick={() => this.props.switchTab(3)}>{appearance.theme.title}: {this.getSetting('theme')}</div>
          {(this.state.importedSettings.length !== 0) ? <div className='toggle' onClick={() => this.props.switchTab(2)}>Imported {this.state.importedSettings.length} settings</div> : null}
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