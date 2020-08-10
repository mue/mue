import React from 'react';
import Background from './components/Background';
import Clock from './components/Clock';
import Greeting from './components/Greeting';
import Quote from './components/Quote';
import Search from './components/Search';
import Credit from './components/Credit';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';

import './scss/index.scss';
import 'react-toastify/dist/ReactToastify.css';

const defaultSettings = require('./modules/defaultSettings.json');
const Settings = React.lazy(() => import('./components/Settings'));
const Update = React.lazy(() => import('./components/Update'));
const renderLoader = () => <div></div>;

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      settingsModal: false,
      updateModal: false
    };
  }

  setDefaultSettings() {
    localStorage.clear();
    defaultSettings.forEach(element => localStorage.setItem(element.name, element.value));

    // Set theme depending on user preferred
    // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) localStorage.setItem('darkTheme', true);
    //else localStorage.setItem('darkTheme', false);

    // Finally we set this to true so it doesn't run the function on every load
    localStorage.setItem('firstRun', true);
    window.location.reload();
  }

  // Render all the components
  render() {
    if (!localStorage.getItem('firstRun')) this.setDefaultSettings();

    let modalClassList = 'Modal';
    if (localStorage.getItem('darkTheme') === 'true') modalClassList = 'Modal dark';

    let overlayClassList = 'Overlay';
    if (localStorage.getItem('animations') === 'true') overlayClassList = 'Overlay modal-animation';

    let language = require(`./translations/${localStorage.getItem('language')}.json`);

    return (
      <React.Fragment>
        <div id='backgroundImage'></div>
        <Background/>
        <ToastContainer className='toast' position='bottom-right' autoClose={2500} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss />
        <div id='center'>
        <Search language={language.search} />
        <Navbar settingsModalOpen={() => this.setState({ settingsModal: true })} updateModalOpen={() => this.setState({ updateModal: true })} />
            <Greeting language={language.greeting} />
            <Clock/>
            <Quote/>
            <Credit language={language.credit} />
            <React.Suspense fallback={renderLoader()}>
              <Modal id={'modal'} onRequestClose={() => this.setState({ settingsModal: false })} isOpen={this.state.settingsModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
                <Settings language={language.settings} modalClose={() => this.setState({ settingsModal: false })} setDefaultSettings={() => this.setDefaultSettings()} />
              </Modal>
              <Modal onRequestClose={() => this.setState({ updateModal: false })} isOpen={this.state.updateModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
                <Update language={language.update} modalClose={() => this.setState({ updateModal: false })} />
              </Modal>
            </React.Suspense>
        </div>
      </React.Fragment>
    );
  }
}
