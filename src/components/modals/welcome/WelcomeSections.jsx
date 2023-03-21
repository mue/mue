import variables from 'modules/variables';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  MdCloudUpload,
  MdAutoAwesome,
  MdLightMode,
  MdDarkMode,
  MdOutlineWavingHand,
  MdOpenInNew,
  MdOutlineWhatshot,
  MdArchive,
} from 'react-icons/md';
import { FaDiscord, FaGithub } from 'react-icons/fa';

import Radio from '../main/settings/Radio';
import Checkbox from '../main/settings/Checkbox';
import FileUpload from '../main/settings/FileUpload';

import { loadSettings } from 'modules/helpers/settings';
import { importSettings } from 'modules/helpers/settings/modals';

import default_settings from 'modules/default_settings.json';
import languages from 'modules/languages.json';

class WelcomeSections extends PureComponent {
  constructor() {
    super();
    this.state = {
      // themes
      autoClass: 'toggle auto active',
      lightClass: 'toggle lightTheme',
      darkClass: 'toggle darkTheme',
      // styles
      newStyle: 'toggle newStyle active',
      legacyStyle: 'toggle legacyStyle',
      // welcome
      welcomeImage: 0,
      // final
      importedSettings: [],
    };
    this.changeWelcomeImg = this.changeWelcomeImg.bind(this);
    this.welcomeImages = 3;
  }

  changeTheme(type) {
    this.setState({
      autoClass: type === 'auto' ? 'toggle auto active' : 'toggle auto',
      lightClass: type === 'light' ? 'toggle lightTheme active' : 'toggle lightTheme',
      darkClass: type === 'dark' ? 'toggle darkTheme active' : 'toggle darkTheme',
    });

    localStorage.setItem('theme', type);
    loadSettings(true);
  }

  changeStyle(type) {
    this.setState({
      newStyle: type === 'new' ? 'toggle newStyle active' : 'toggle newStyle',
      legacyStyle: type === 'legacy' ? 'toggle legacyStyle active' : 'toggle legacyStyle',
    });
    localStorage.setItem('widgetStyle', type);
  }

  getSetting(name) {
    const value = localStorage.getItem(name).replace('false', 'Off').replace('true', 'On');
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  importSettings(e) {
    importSettings(e);

    const settings = [];
    const data = JSON.parse(e.target.result);
    Object.keys(data).forEach((setting) => {
      // language and theme already shown, the others are only used internally
      if (
        setting === 'language' ||
        setting === 'theme' ||
        setting === 'firstRun' ||
        setting === 'showWelcome' ||
        setting === 'showReminder'
      ) {
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
        value: data[setting],
      });
    });

    this.setState({
      importedSettings: settings,
    });

    this.props.switchTab(5);
  }

  changeWelcomeImg() {
    let welcomeImage = this.state.welcomeImage;

    this.setState({
      welcomeImage: welcomeImage < 3 ? ++welcomeImage : 0,
    });

    this.timeout = setTimeout(this.changeWelcomeImg, 3000);
  }

  componentDidMount() {
    this.timeout = setTimeout(this.changeWelcomeImg, 3000);
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
    } else if (!this.timeout) {
      this.timeout = setTimeout(this.changeWelcomeImg, 3000);
    }
  }

  render() {
    const intro = (
      <>
        <span className="mainTitle">
          {variables.getMessage('modals.welcome.sections.intro.title')}
        </span>
        <div className="examples">
          <img
            src={`./welcome-images/example${this.state.welcomeImage + 1}.webp`}
            alt="Example Mue setup"
            draggable={false}
          />
        </div>

        <span className="link">#shareyourmue</span>
        <div className="welcomeNotice">
          <div className="icon">
            <MdOutlineWavingHand />
          </div>
          <div className="text">
            <span className="title">
              {variables.getMessage('modals.welcome.sections.intro.title')}
            </span>
            <span className="subtitle">
              {variables.getMessage('modals.welcome.sections.intro.description')}
            </span>
          </div>
        </div>
        <div className="welcomeNotice">
          <div className="icon">
            <FaDiscord />
          </div>
          <div className="text">
            <span className="title">
              {variables.getMessage('modals.welcome.sections.intro.notices.discord_title')}
            </span>
            <span className="subtitle">
              {variables.getMessage('modals.welcome.sections.intro.notices.discord_description')}
            </span>
          </div>
          <a href="https://discord.gg/zv8C9F8" target="_blank" rel="noopener noreferrer">
            <MdOpenInNew />{' '}
            {variables.getMessage('modals.welcome.sections.intro.notices.discord_join')}
          </a>
        </div>
        <div className="welcomeNotice">
          <div className="icon">
            <FaGithub />
          </div>
          <div className="text">
            <span className="title">
              {variables.getMessage('modals.welcome.sections.intro.notices.github_title')}
            </span>
            <span className="subtitle">
              {variables.getMessage('modals.welcome.sections.intro.notices.github_description')}
            </span>
          </div>
          <a href="https://github.com/mue/mue" target="_blank" rel="noopener noreferrer">
            <MdOpenInNew />{' '}
            {variables.getMessage('modals.welcome.sections.intro.notices.github_open')}
          </a>
        </div>
      </>
    );

    const chooseLanguage = (
      <>
        <span className="mainTitle">
          {variables.getMessage('modals.welcome.sections.language.title')}
        </span>
        <span className="subtitle">
          {variables.getMessage('modals.welcome.sections.language.description')}{' '}
          <a
            href={variables.constants.TRANSLATIONS_URL}
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          !
        </span>
        <div className="languageSettings">
          <Radio name="language" options={languages} category="welcomeLanguage" />
        </div>
      </>
    );

    const theme = (
      <>
        <span className="mainTitle">
          {variables.getMessage('modals.welcome.sections.theme.title')}
        </span>
        <span className="subtitle">
          {variables.getMessage('modals.welcome.sections.theme.description')}
        </span>
        <div className="themesToggleArea">
          <div className={this.state.autoClass} onClick={() => this.changeTheme('auto')}>
            <MdAutoAwesome />
            <span>
              {variables.getMessage('modals.main.settings.sections.appearance.theme.auto')}
            </span>
          </div>
          <div className="options">
            <div className={this.state.lightClass} onClick={() => this.changeTheme('light')}>
              <MdLightMode />
              <span>
                {variables.getMessage('modals.main.settings.sections.appearance.theme.light')}
              </span>
            </div>
            <div className={this.state.darkClass} onClick={() => this.changeTheme('dark')}>
              <MdDarkMode />
              <span>
                {variables.getMessage('modals.main.settings.sections.appearance.theme.dark')}
              </span>
            </div>
          </div>
        </div>
        <span className="title">{variables.getMessage('modals.welcome.tip')}</span>
        <span className="subtitle">
          {variables.getMessage('modals.welcome.sections.theme.tip')}
        </span>
      </>
    );

    const style = (
      <>
        <span className="mainTitle">
          {variables.getMessage('modals.welcome.sections.style.title')}
        </span>
        <span className="subtitle">
          {variables.getMessage('modals.welcome.sections.style.description')}
        </span>
        <div className="themesToggleArea">
          <div className="options">
            <div className={this.state.legacyStyle} onClick={() => this.changeStyle('legacy')}>
              <MdArchive />
              <span>{variables.getMessage('modals.welcome.sections.style.legacy')}</span>
            </div>
            <div className={this.state.newStyle} onClick={() => this.changeStyle('new')}>
              <MdOutlineWhatshot />
              <span>{variables.getMessage('modals.welcome.sections.style.modern')}</span>
            </div>
          </div>
        </div>
      </>
    );

    const settings = (
      <>
        <span className="mainTitle">
          {variables.getMessage('modals.welcome.sections.settings.title')}
        </span>
        <span className="subtitle">
          {variables.getMessage('modals.welcome.sections.settings.description')}
        </span>
        <button className="upload" onClick={() => document.getElementById('file-input').click()}>
          <MdCloudUpload />
          <span>{variables.getMessage('modals.main.settings.buttons.import')}</span>
        </button>
        <FileUpload
          id="file-input"
          accept="application/json"
          type="settings"
          loadFunction={(e) => this.importSettings(e)}
        />
        <span className="title">{variables.getMessage('modals.welcome.tip')}</span>
        <span className="subtitle">
          {variables.getMessage('modals.welcome.sections.settings.tip')}
        </span>
      </>
    );

    const privacy = (
      <>
        <span className="mainTitle">
          {variables.getMessage('modals.welcome.sections.privacy.title')}
        </span>
        <span className="subtitle">
          {variables.getMessage('modals.welcome.sections.privacy.description')}
        </span>
        <Checkbox
          name="offlineMode"
          text={variables.getMessage('modals.main.settings.sections.advanced.offline_mode')}
          element=".other"
        />
        <span className="subtitle">
          {variables.getMessage('modals.welcome.sections.privacy.offline_mode_description')}
        </span>
        <Checkbox
          name="ddgProxy"
          text={
            variables.getMessage('modals.main.settings.sections.background.ddg_image_proxy') +
            ' (' +
            variables.getMessage('modals.main.settings.sections.background.title') +
            ')'
          }
        />
        <span className="subtitle">
          {variables.getMessage('modals.welcome.sections.privacy.ddg_proxy_description')}
        </span>
        <span className="title">
          {variables.getMessage('modals.welcome.sections.privacy.links.title')}
        </span>
        <a
          className="link"
          href={variables.constants.PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {variables.getMessage('modals.welcome.sections.privacy.links.privacy_policy')}
        </a>

        <a
          className="link"
          href={'https://github.com/' + variables.constants.ORG_NAME}
          target="_blank"
          rel="noopener noreferrer"
        >
          {variables.getMessage('modals.welcome.sections.privacy.links.source_code')}
        </a>
      </>
    );

    const final = (
      <>
        <span className="mainTitle">
          {variables.getMessage('modals.welcome.sections.final.title')}
        </span>
        <span className="subtitle">
          {variables.getMessage('modals.welcome.sections.final.description')}
        </span>
        <span className="title">
          {variables.getMessage('modals.welcome.sections.final.changes')}
        </span>
        <span className="subtitle">
          {variables.getMessage('modals.welcome.sections.final.changes_description')}
        </span>
        <div className="themesToggleArea themesToggleAreaWelcome">
          <div className="toggle" onClick={() => this.props.switchTab(1)}>
            <span>
              {variables.getMessage('modals.main.settings.sections.language.title')}:{' '}
              {languages.find((i) => i.value === localStorage.getItem('language')).name}
            </span>
          </div>
          <div className="toggle" onClick={() => this.props.switchTab(3)}>
            <span>
              {variables.getMessage('modals.main.settings.sections.appearance.theme.title')}:{' '}
              {variables.getMessage(
                'modals.main.settings.sections.appearance.theme.' + localStorage.getItem('theme'),
              )}
            </span>
          </div>
          {this.state.importedSettings.length !== 0 ? (
            <div className="toggle" onClick={() => this.props.switchTab(2)}>
              {variables.getMessage('modals.main.settings.sections.final.imported', {
                amount: this.state.importedSettings.length,
              })}{' '}
              {this.state.importedSettings.length}
            </div>
          ) : null}
        </div>
      </>
    );

    switch (this.props.currentTab) {
      case 1:
        return chooseLanguage;
      case 2:
        return settings;
      case 3:
        return theme;
      case 4:
        return style;
      case 5:
        return privacy;
      case 6:
        return final;
      // 0
      default:
        return intro;
    }
  }
}

WelcomeSections.propTypes = {
  currentTab: PropTypes.number.isRequired,
  switchTab: PropTypes.func.isRequired,
};

export default WelcomeSections;
