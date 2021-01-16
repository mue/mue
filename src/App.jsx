import React from 'react';

import Background from './components/widgets/background/Background';
import Widgets from './components/widgets/Widgets';
import PhotoInformation from './components/widgets/background/PhotoInformation';
import Navbar from './components/widgets/navbar/Navbar';

import SettingsFunctions from './modules/helpers/settings';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import merge from 'deepmerge';

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
    if (!localStorage.getItem('firstRun')) SettingsFunctions.setDefaultSettings();
    if (localStorage.getItem('showWelcome') === 'true') this.setState({ welcomeModal: true });
    
    const css = localStorage.getItem('customcss');
    if (css) document.head.insertAdjacentHTML('beforeend', '<style>' + css + '</style>');

    if (localStorage.getItem('darkTheme') === 'true') document.getElementsByClassName('Toastify')[0].classList.add('dark');
  }

  closeWelcome() {
    localStorage.setItem('showWelcome', false);
    this.setState({ welcomeModal: false });
  }

  // Render all the components
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
    const languagecode = localStorage.getItem('language') || 'en';
    const language = merge(require('./translations/en.json'), require(`./translations/${languagecode}.json`));

    return (
      <React.Fragment>
        <Background/>
        <ToastContainer position='bottom-right' autoClose={2500} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss />
        <div id='center'>
          <Navbar mainModalOpen={() => this.setState({ mainModal: true })} updateModalOpen={() => this.setState({ updateModal: true })} feedbackModalOpen={() => this.setState({ feedbackModal: true })} language={language} />
          <Widgets language={language} languagecode={languagecode} />
          <PhotoInformation language={language} className={tooltipClassList} />
          <React.Suspense fallback={renderLoader()}>
            <Modal id={'modal'} onRequestClose={() => this.setState({ mainModal: false })} isOpen={this.state.mainModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
              <Main language={language} modalClose={() => this.setState({ mainModal: false })} />
            </Modal>
            <Modal onRequestClose={() => this.setState({ updateModal: false })} isOpen={this.state.updateModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
              <Update language={language.update} modalClose={() => this.setState({ updateModal: false })} />
            </Modal>
            <Modal onRequestClose={() => this.closeWelcome()} isOpen={this.state.welcomeModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
              <Welcome modalClose={() => this.closeWelcome()} language={language.welcome} />
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
