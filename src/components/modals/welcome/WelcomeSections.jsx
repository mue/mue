import { PureComponent } from 'react';
import { CloudUpload, AutoAwesome, LightMode, DarkMode } from '@material-ui/icons';

import Radio from '../main/settings/Radio';
import Checkbox from '../main/settings/Checkbox';
import FileUpload from '../main/settings/FileUpload';

import { loadSettings } from '../../../modules/helpers/settings';
import { importSettings } from '../../../modules/helpers/settings/modals';

const languages = require('../../../modules/languages.json');
const default_settings = require('../../../modules/default_settings.json');

export default class WelcomeSections extends PureComponent {
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
    const language = window.language.modals.welcome;
    let tabContent;
  
    const intro = (
      <>
        <h1>{language.sections.intro.title}</h1>
        <p>{language.sections.intro.description}</p>
        <h3 className='quicktip'>#shareyourmue</h3>
        <div className='examples'>
          <img src={this.welcomeImages[this.state.welcomeImage]} alt='Example Mue setup' draggable={false}/>
        </div>
      </>
    );
  
    const chooseLanguage = (
      <>
        <h1>{language.sections.language.title}</h1>
        <p>{language.sections.language.description}</p>
        <Radio name='language' options={languages} category='welcomeLanguage'/>
      </>
    );
  
    const { appearance, advanced, background, quicklinks, stats } = window.language.modals.main.settings.sections;
    const languageSettings = window.language.modals.main.settings.sections.language;

    const theme = (
      <>
        <h1>{language.sections.theme.title}</h1>
        <p>{language.sections.theme.description}</p>
        <div className='themesToggleArea'>
          <div className={this.state.autoClass} onClick={() => this.changeTheme('auto')}>
            <AutoAwesome/>
            <span>{appearance.theme.auto}</span>
          </div>
          <div className='options'>
            <div className={this.state.lightClass} onClick={() => this.changeTheme('light')}>
              <LightMode/>
              <span>{appearance.theme.light}</span>
            </div>
            <div className={this.state.darkClass} onClick={() => this.changeTheme('dark')}>
              <DarkMode/>
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
          <CloudUpload/>
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
        <Checkbox name='quicklinksddgProxy' text={background.ddg_image_proxy + ' (' + quicklinks.title + ')'}/>
        <Checkbox name='ddgProxy' text={background.ddg_image_proxy + ' (' + background.title + ')'}/>
        <p>{language.sections.privacy.ddg_proxy_description}</p>
        <Checkbox name='stats' text={stats.usage}/>
        <p>{language.sections.privacy.stats_description}</p>
        <h3 className='quicktip'>{language.sections.privacy.links.title}</h3>
        <a className='privacy' href={window.constants.PRIVACY_URL} target='_blank' rel='noopener noreferrer'>{language.sections.privacy.links.privacy_policy}</a>
        <br/><br/>
        <a className='privacy' href={'https://github.com/' + window.constants.ORG_NAME} target='_blank' rel='noopener noreferrer'>{language.sections.privacy.links.source_code}</a>
      </>
    );

    const final = (
      <>
        <h1>{language.sections.final.title}</h1>
        <p>{language.sections.final.description}</p>
        <h3 className='quicktip'>{language.sections.final.changes}</h3>
        <p>{language.sections.final.changes_description}</p>
        <div className='themesToggleArea'>
          <div className='toggle' onClick={() => this.props.switchTab(1)}><span>{languageSettings.title}: {languages.find((i) => i.value === localStorage.getItem('language')).name}</span></div>
          <div className='toggle' onClick={() => this.props.switchTab(3)}><span>{appearance.theme.title}: {this.getSetting('theme')}</span></div>
          {(this.state.importedSettings.length !== 0) ? <div className='toggle' onClick={() => this.props.switchTab(2)}>{language.sections.final.imported} {this.state.importedSettings.length} {language.sections.final.settings}</div> : null}
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
