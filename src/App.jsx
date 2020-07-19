//* Imports
import React from 'react';
import Background from './components/Background';
import Clock from './components/Clock';
import Greeting from './components/Greeting';
import Quote from './components/Quote';
import Search from './components/Search';
import Credit from './components/Credit';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Modal from 'react-modal';
import './scss/index.scss'; 

const Settings = React.lazy(() => import('./components/Settings'));
const Update = React.lazy(() => import('./components/Update'));
const renderLoader = () => <div></div>;

//* App
export default class App extends React.Component {
  // Modal stuff
  constructor(props) {
    super(props);

    this.state = { 
      settingsModal: false, 
      updateModal: false
    };
  }

  setDefaultSettings() {
    localStorage.clear();

    localStorage.setItem('time', true);
    localStorage.setItem('greeting', true);
    localStorage.setItem('background', true);
    localStorage.setItem('quote', true);
    localStorage.setItem('searchBar', true);
    localStorage.setItem('blur', 0);
    localStorage.setItem('copyButton', false);
    localStorage.setItem('seconds', false);
    localStorage.setItem('24hour', false);
    localStorage.setItem('offlineMode', false);
    localStorage.setItem('webp', false);
    localStorage.setItem('events', true);
    localStorage.setItem('customBackgroundColour', '');
    localStorage.setItem('customBackground', '');
    localStorage.setItem('greetingName', '');

    // Set theme depending on user preferred
    //if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) localStorage.setItem('darkTheme', true);
    //else localStorage.setItem('darkTheme', false);
    localStorage.setItem('darkTheme', false);

    // Finally we set this to true so it doesn't run the function on every load
    localStorage.setItem('firstRun', true);
    window.location.reload();
  }

  // Render all the components
  render() {
    if (!localStorage.getItem('firstRun')) this.setDefaultSettings();

    let modalClassList = 'Modal';
    const darkTheme = localStorage.getItem('darkTheme');
    if (darkTheme === 'true') modalClassList = 'Modal dark';
  
    return (
      <React.Fragment>
        <div id='backgroundImage'></div>
        <Background/>
        <div id='center'>
        <Search/>
        <Navbar settingsModalOpen={() => this.setState({ settingsModal: true })} updateModalOpen={() => this.setState({ updateModal: true })} />
            <Greeting/>
            <Clock/> 
            <Quote />
            <Credit/>
            <Toast/>
            <React.Suspense fallback={renderLoader()}>
              <Modal isOpen={this.state.settingsModal} className={modalClassList} overlayClassName="Overlay" ariaHideApp={false}>
                <Settings modalClose={() => this.setState({ settingsModal: false })} setDefaultSettings={() => this.setDefaultSettings()} />
              </Modal>
              <Modal isOpen={this.state.updateModal} className={modalClassList} overlayClassName="Overlay" ariaHideApp={false}>
                <Update modalClose={() => this.setState({ updateModal: false })} />
              </Modal>
            </React.Suspense>
        </div>
      </React.Fragment>
    );
  }
}
