import variables from 'modules/variables';
import { PureComponent } from 'react';

import EventBus from 'modules/helpers/eventbus';

import WelcomeSections from './WelcomeSections';
import ProgressBar from './ProgressBar';

import './welcome.scss';

export default class WelcomeModal extends PureComponent {
  getMessage = (languagecode, text) => variables.language.getMessage(languagecode, text);
  languagecode = variables.languagecode;

  constructor() {
    super();
    this.state = {
      image: './././icons/undraw_celebration.svg',
      currentTab: 0,
      finalTab: 4,
      buttonText: this.getMessage(this.languagecode, 'modals.welcome.buttons.next')
    };
    this.images = [
      './././icons/undraw_celebration.svg', 
      './././icons/undraw_around_the_world_modified.svg', 
      './././icons/undraw_add_files_modified.svg', 
      './././icons/undraw_dark_mode.svg',
      './././icons/undraw_private_data_modified.svg', 
      './././icons/undraw_upgrade_modified.svg'
    ];
  }

  changeTab(minus) {
    localStorage.setItem('bgtransition', true);
    localStorage.removeItem('welcomeTab');

    if (minus) {
      return this.setState({
        currentTab: this.state.currentTab - 1,
        image: this.images[this.state.currentTab - 1],
        buttonText: this.getMessage(this.languagecode, 'modals.welcome.buttons.next')
      });
    }

    if (this.state.buttonText === this.getMessage(this.languagecode, 'modals.welcome.buttons.close')) {
      return this.props.modalClose();
    }

    this.setState({
      currentTab: this.state.currentTab + 1,
      image: this.images[this.state.currentTab + 1],
      buttonText: (this.state.currentTab !== this.state.finalTab) ? this.getMessage(this.languagecode, 'modals.welcome.buttons.next') : this.getMessage(this.languagecode, 'modals.welcome.buttons.close')
    });
  }

  // specific
  switchTab(tab) {
    this.setState({
      currentTab: tab,
      image: this.images[tab],
      buttonText: (tab !== this.state.finalTab + 1) ? this.getMessage(this.languagecode, 'modals.welcome.buttons.next') : this.getMessage(this.languagecode, 'modals.welcome.buttons.close')
    });

    localStorage.setItem('bgtransition', true);
    localStorage.removeItem('welcomeTab');
  }

  componentDidMount() {
    const welcomeTab = localStorage.getItem('welcomeTab');
    if (welcomeTab) {
      this.setState({
        currentTab: Number(welcomeTab),
        image: this.images[Number(welcomeTab)],
        buttonText: (Number(welcomeTab) !== this.state.finalTab + 1) ? this.getMessage(this.languagecode, 'modals.welcome.buttons.next') : this.getMessage(this.languagecode, 'modals.welcome.buttons.close')
      });
    }

    EventBus.on('refresh', (data) => {
      if (data === 'welcomeLanguage') {
        localStorage.setItem('welcomeTab', this.state.currentTab);
        localStorage.setItem('bgtransition', false);
        window.location.reload();
      }
    });
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    return (
      <div className='welcomeContent'>
        <section>
          <img className='showcaseimg' alt='celebration' draggable={false} src={this.state.image} />
          <ProgressBar count={this.images} currentTab={this.state.currentTab} switchTab={(tab) => this.switchTab(tab)}/>  
        </section>
        <section>
          <div className='content'>
            <WelcomeSections currentTab={this.state.currentTab} switchTab={(tab) => this.switchTab(tab)}/>
          </div>
          <div className='buttons'>
            {(this.state.currentTab !== 0) ? <button className='close' style={{ marginRight: '20px' }} onClick={() => this.changeTab(true)}>{this.getMessage(this.languagecode, 'modals.welcome.buttons.previous')}</button> : null}
            <button className='close' onClick={() => this.changeTab()}>{this.state.buttonText}</button>
          </div>
        </section>
      </div>
    );
  }
}
