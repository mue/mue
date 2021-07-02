import React from 'react';

import Radio from '../main/settings/Radio';
//import Checkbox from '../main/settings/Checkbox';
import FileUpload from '../main/settings/FileUpload';
import UploadIcon from '@material-ui/icons/CloudUpload';
import AutoIcon from '@material-ui/icons/AutoAwesome';
import LightModeIcon from '@material-ui/icons/LightMode';
import DarkModeIcon from '@material-ui/icons/DarkMode';

import SettingsFunctions from '../../../modules/helpers/settings';

const languages = require('../../../modules/languages.json');

export default class WelcomeSections extends React.Component {
  constructor() {
    super();
    this.state = {
      autoClass: 'toggle auto active',
      lightClass: 'toggle lightTheme',
      darkClass: 'toggle darkTheme',
      welcomeImage: 0
    };
    this.changeWelcomeImg = this.changeWelcomeImg.bind(this);
    this.welcomeImages = ['https://external-content.duckduckgo.com/iu/?u=example.com/example.png'];
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
    SettingsFunctions.importSettings(e);
    this.props.switchTab(4);
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

  render() {
    const language = window.language.modals.welcome;
    let tabContent;
  
    const intro = (
      <>
        <h1>{language.title} Mue Tab</h1>
        <p>{language.thankyoumessage1} {language.thankyoumessage2}</p>
        <h3 className='quicktip'>to be added</h3>
        <div className='examples'>
          <img src={this.welcomeImages[this.state.welcomeImage]} alt='example mue setup' draggable={false}/>
        </div>
      </>
    );
  
    const chooseLanguage = (
      <>
        <h1>Choose your language</h1>
        <p>to be added</p>
        <Radio name='language' options={languages}/>
      </>
    );
  
    const theme = (
      <>
        <h1>Select a theme</h1>
        <p>Mue is available in both light and dark theme, or this can be automatically set depending on your system theme.</p>
        <div className='themesToggleArea'>
          <div className={this.state.autoClass} onClick={() => this.changeTheme('auto')}>
            <AutoIcon/>
            <span>Auto</span>
          </div>
          <div className='options'>
            <div className={this.state.lightClass} onClick={() => this.changeTheme('light')}>
                <LightModeIcon/>
                <span>Light</span>
            </div>
            <div className={this.state.darkClass} onClick={() => this.changeTheme('dark')}>
                <DarkModeIcon/>
                <span>Dark</span>
            </div>
          </div>
          <h3 className='quicktip'>Quick Tip</h3>
          <p>Using the Auto settings will use the theme on your computer. This setting will impact the modals and some of the widgets displayed on the screen, such as weather and notes.</p>
        </div>
      </>
    );
  
    const settings = (
      <>
        <h1>Import Settings</h1>
        <p>Installing Mue on a new device? Feel free to import your old settings!</p>
        <button className='upload' onClick={() => document.getElementById('file-input').click()}>
          <UploadIcon/>
          <br/>
          <span>{window.language.modals.main.settings.buttons.import}</span>
        </button>
        <FileUpload id='file-input' accept='application/json' type='settings' loadFunction={(e) => this.importSettings(e)}/>
        <h3 className='quicktip'>Quick Tip</h3>
        <p>You can export your old settings by navigating to the Advanced tab in your old Mue setup. Then you need to click the export button which will download the JSON file. You can upload this file here to carry across your settings and preferences from your previous Mue installation.</p>
      </>
    );

    const privacy = (
      <>
        <h1>Privacy Options</h1>
        <p>to be added</p>
      </>
    );

    const final = (
      <>
        <h1>Final step</h1>
        <p>Your Mue Tab experience is finally about to begin.</p>
        <h3 className='quicktip'>Changes</h3>
        <p>To change settings later click on the settings icon in the top right corner of your tab.</p>
        <div className='themesToggleArea'>
          <div className='toggle' onClick={() => this.props.switchTab(1)}>Language: {languages.find((i) => i.value === localStorage.getItem('language')).name}</div>
          <div className='toggle' onClick={() => this.props.switchTab(3)}>Theme: {this.getSetting('theme')}</div>
        </div>
      </>
    )
  
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