import variables from 'modules/variables';
import { PureComponent } from 'react';
import { MdArrowBackIosNew, MdArrowForwardIos, MdOutlinePreview } from 'react-icons/md';

import EventBus from 'modules/helpers/eventbus';

import WelcomeSections from './WelcomeSections';
import ProgressBar from './ProgressBar';
import Button from '../main/settings/Button';

import './welcome.scss';

class WelcomeModal extends PureComponent {
  constructor() {
    super();
    this.state = {
      image: './././icons/undraw_celebration.svg',
      currentTab: 0,
      finalTab: 5,
      buttonText: variables.getMessage('modals.welcome.buttons.next'),
    };
    this.images = [
      './././icons/undraw_celebration.svg',
      './././icons/undraw_around_the_world_modified.svg',
      './././icons/undraw_add_files_modified.svg',
      './././icons/undraw_dark_mode.svg',
      './././icons/undraw_making_art.svg',
      './././icons/undraw_private_data_modified.svg',
      './././icons/undraw_upgrade_modified.svg',
    ];
  }

  changeTab(minus) {
    localStorage.setItem('bgtransition', true);
    localStorage.removeItem('welcomeTab');

    if (minus) {
      return this.setState({
        currentTab: this.state.currentTab - 1,
        image: this.images[this.state.currentTab - 1],
        buttonText: variables.getMessage('modals.welcome.buttons.next'),
      });
    }

    if (this.state.buttonText === variables.getMessage('modals.welcome.buttons.finish')) {
      return this.props.modalClose();
    }

    this.setState({
      currentTab: this.state.currentTab + 1,
      image: this.images[this.state.currentTab + 1],
      buttonText:
        this.state.currentTab !== this.state.finalTab
          ? variables.getMessage('modals.welcome.buttons.next')
          : variables.getMessage('modals.welcome.buttons.finish'),
    });
  }

  // specific
  switchTab(tab) {
    this.setState({
      currentTab: tab,
      image: this.images[tab],
      buttonText:
        tab !== this.state.finalTab + 1
          ? variables.getMessage('modals.welcome.buttons.next')
          : variables.getMessage('modals.welcome.buttons.finish'),
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
        buttonText:
          Number(welcomeTab) !== this.state.finalTab + 1
            ? variables.getMessage('modals.welcome.buttons.next')
            : variables.getMessage('modals.welcome.buttons.finish'),
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
      <div className="welcomeContent">
        <section>
          <img
            className="showcaseimg"
            alt="sidebar icon"
            draggable={false}
            src={this.state.image}
          />
          <ProgressBar
            count={this.images}
            currentTab={this.state.currentTab}
            switchTab={(tab) => this.switchTab(tab)}
          />
        </section>
        <section>
          <div className="content">
            <WelcomeSections
              currentTab={this.state.currentTab}
              switchTab={(tab) => this.switchTab(tab)}
            />
          </div>
          <div className="welcomeButtons">
            {this.state.currentTab !== 0 ? (
              <Button
                type="settings"
                onClick={() => this.changeTab(true)}
                icon={<MdArrowBackIosNew />}
                label={variables.getMessage('modals.welcome.buttons.previous')}
              />
            ) : (
              <Button
                type="settings"
                onClick={() => this.props.modalSkip()}
                icon={<MdOutlinePreview />}
                label={variables.getMessage('modals.welcome.buttons.preview')}
              />
            )}
            <Button
              type="settings"
              onClick={() => this.changeTab()}
              icon={<MdArrowForwardIos />}
              label={this.state.buttonText}
              iconPlacement={'right'}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default WelcomeModal;
