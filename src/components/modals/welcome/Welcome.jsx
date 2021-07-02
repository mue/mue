import React from 'react';

import WelcomeSections from './WelcomeSections';
import ProgressBar from './ProgressBar';

import './welcome.scss';

export default class WelcomeModal extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      image: './././icons/undraw_celebration.svg',
      currentTab: 0,
      finalTab: 4,
      buttonText: 'Next'
    };
    this.language = window.language.modals.welcome;
    this.images = ['./././icons/undraw_celebration.svg', './././icons/undraw_around_the_world_modified.svg', './././icons/undraw_add_files_modified.svg', './././icons/undraw_dark_mode.svg', './././icons/undraw_private_data_modified.svg', './././icons/undraw_upgrade_modified.svg']
  }

  changeTab(minus) {
    if (minus) {
      return this.setState({
        currentTab: this.state.currentTab - 1,
        image: this.images[this.state.currentTab - 1],
        buttonText: 'Next'
      });
    }

    if (this.state.buttonText === 'Close') {
      return this.props.modalClose();
    }

    this.setState({
      currentTab: this.state.currentTab + 1,
      image: this.images[this.state.currentTab + 1],
      buttonText: (this.state.currentTab !== this.state.finalTab) ? 'Next' : 'Close'
    });
  }

  // specific
  switchTab(tab) {
    this.setState({
      currentTab: tab,
      image: this.images[tab],
      buttonText: 'Next'
    });
  }

  render() {
    return (
      <div className='welcomeContent'>
        <section>
          <img alt='celebration' draggable={false} src={this.state.image} />
          <ProgressBar count={this.images} currentTab={this.state.currentTab} switchTab={(tab) => this.switchTab(tab)}/>  
        </section>
        <section>
          <div className='content'>
            <WelcomeSections currentTab={this.state.currentTab} switchTab={(tab) => this.switchTab(tab)}/>
          </div>
          <div className='buttons'>
            {(this.state.currentTab !== 0) ? <button className='close' style={{ marginRight: '20px' }} onClick={() => this.changeTab(true)}>Previous</button> : null}
            <button className='close' onClick={() => this.changeTab()}>{this.state.buttonText}</button>
          </div>
        </section>
      </div>
    );
  }
}
