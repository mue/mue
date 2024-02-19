import variables from 'config/variables';
import { PureComponent } from 'react';
import { MdArrowBackIosNew, MdArrowForwardIos, MdOutlinePreview } from 'react-icons/md';

import EventBus from 'utils/eventbus';

import { ProgressBar, AsideImage } from './components/Elements';
import { Button } from 'components/Elements';
import { Wrapper, Panel } from './components/Layout';

import './welcome.scss';

import {
  Intro,
  ChooseLanguage,
  ImportSettings,
  ThemeSelection,
  StyleSelection,
  PrivacyOptions,
  Final,
} from './Sections';

class WelcomeModal extends PureComponent {
  constructor() {
    super();
    this.state = {
      currentTab: 0,
      finalTab: 5,
      buttonText: variables.getMessage('modals.welcome.buttons.next'),
    };
  }

  changeTab(minus) {
    localStorage.setItem('bgtransition', true);
    localStorage.removeItem('welcomeTab');

    if (minus) {
      return this.setState({
        currentTab: this.state.currentTab - 1,
        buttonText: variables.getMessage('modals.welcome.buttons.next'),
      });
    }

    if (this.state.buttonText === variables.getMessage('modals.welcome.buttons.finish')) {
      return this.props.modalClose();
    }

    this.setState({
      currentTab: this.state.currentTab + 1,
      image: [this.state.currentTab + 1],
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

  renderButtons() {
    const { currentTab, buttonText } = this.state;
    const { modalSkip } = this.props;

    return (
      <div className="welcomeButtons">
        {currentTab !== 0 ? (
          <Button
            type="settings"
            onClick={() => this.changeTab(true)}
            icon={<MdArrowBackIosNew />}
            label={variables.getMessage('modals.welcome.buttons.previous')}
          />
        ) : (
          <Button
            type="settings"
            onClick={() => modalSkip()}
            icon={<MdOutlinePreview />}
            label={variables.getMessage('modals.welcome.buttons.preview')}
          />
        )}
        <Button
          type="settings"
          onClick={() => this.changeTab()}
          icon={<MdArrowForwardIos />}
          label={buttonText}
          iconPlacement={'right'}
        />
      </div>
    );
  }

  render() {
    const tabComponents = {
      0: <Intro />,
      1: <ChooseLanguage />,
      2: <ImportSettings switchTab={(tab) => this.switchTab(tab)} />,
      3: <ThemeSelection />,
      4: <StyleSelection />,
      5: <PrivacyOptions />,
      6: <Final currentTab={this.state.currentTab} switchTab={(tab) => this.switchTab(tab)} />,
    };

    let CurrentSection = tabComponents[this.state.currentTab] || <Intro />;
    return (
      <Wrapper>
        <Panel type="aside">
          <AsideImage currentTab={this.state.currentTab} />
          <ProgressBar
            numberOfTabs={this.state.finalTab + 2}
            currentTab={this.state.currentTab}
            switchTab={(tab) => this.switchTab(tab)}
          />
        </Panel>
        <Panel type="content">
          {CurrentSection}
          {this.renderButtons()}
        </Panel>
      </Wrapper>
    );
  }
}

export default WelcomeModal;
