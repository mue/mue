import React from 'react';

import Background from './components/widgets/background/Background';
import Widgets from './components/widgets/Widgets';
import PhotoInformation from './components/widgets/background/PhotoInformation';
import Navbar from './components/widgets/navbar/Navbar';

import SettingsFunctions from './modules/helpers/settings';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import merge from './modules/helpers/merge';

// Modals are lazy loaded as the user won't use them every time they open a tab
const Main = React.lazy(() => import('./components/modals/Main'));
const Update = React.lazy(() => import('./components/modals/Update'));
const Welcome = React.lazy(() => import('./components/modals/Welcome'));
//const Feedback = React.lazy(() => import('./components/modals/Feedback'));
const renderLoader = () => <div></div>;

export default class App extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      mainModal: false,
      updateModal: false,
      welcomeModal: false,
      feedbackModal: false
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('firstRun')) {
      SettingsFunctions.setDefaultSettings();
    }
    
    if (localStorage.getItem('showWelcome') === 'true') {
      this.setState({ 
        welcomeModal: true 
      });
    }

    SettingsFunctions.loadSettings();
    
    // These lines of code prevent double clicking the page or pressing CTRL + A from highlighting the page
    document.addEventListener('mousedown', (event) => {
      if (event.detail > 1) {
        event.preventDefault();
      }
    }, false);

    document.onkeydown = (e) => {
      e = e || window.event; 
      if (!e.ctrlKey) return;
      let code = e.which || e.keyCode;

      switch (code) {
          case 65:
            e.preventDefault();
            e.stopPropagation();
            break;
      }
    };
  }

  closeWelcome() {
    localStorage.setItem('showWelcome', false);
    this.setState({ 
      welcomeModal: false 
    });
  }

  render() {
    // dark theme support for modals and info card
    let modalClassList = 'Modal';
    let tooltipClassList = 'infoCard';

    if ((localStorage.getItem('brightnessTime') && new Date().getHours() > 18) || localStorage.getItem('darkTheme') === 'true') {
      modalClassList += ' dark';
      tooltipClassList += ' dark';
    }
    
    const overlayClassList = (localStorage.getItem('animations') === 'true') ? 'Overlay modal-animation' : 'Overlay';

    /// language
    const languagecode = localStorage.getItem('language') || 'en-GB';
    const language = merge(require('./translations/en-GB.json'), require(`./translations/${languagecode}.json`));

    const toastDisplayTime = localStorage.getItem('toastDisplayTime') || 2500;

    return (
      <React.Fragment>
        <Background/>
        <ToastContainer position='bottom-right' autoClose={toastDisplayTime} newestOnTop={true} closeOnClick pauseOnFocusLoss />
        <div id='center'>
          <Navbar openModal={(modal) => this.setState({ [modal]: true })} language={language} />
          <Widgets language={language} languagecode={languagecode} />
          <PhotoInformation language={language.widgets.background} className={tooltipClassList} />
          <React.Suspense fallback={renderLoader()}>
            <Modal closeTimeoutMS={300} id={'modal'} onRequestClose={() => this.setState({ mainModal: false })} isOpen={this.state.mainModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
              <Main language={language} modalClose={() => this.setState({ mainModal: false })} />
            </Modal>
            <Modal onRequestClose={() => this.setState({ updateModal: false })} isOpen={this.state.updateModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
              <Update language={language.update} modalClose={() => this.setState({ updateModal: false })} />
            </Modal>
            <Modal onRequestClose={() => this.closeWelcome()} isOpen={this.state.welcomeModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
              <Welcome modalClose={() => this.closeWelcome()} language={language.modals.welcome} />
            </Modal>
            {/* <Modal onRequestClose={() => this.setState({ feedbackModal: false })} isOpen={this.state.feedbackModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
              <Feedback modalClose={() => this.setState({ feedbackModal: false })} />
            </Modal> */}
          </React.Suspense>
        </div>
      </React.Fragment>
    );
  }
}
