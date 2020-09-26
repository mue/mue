import React from 'react';

import Background from './components/widgets/Background';
import Clock from './components/widgets/Clock';
import Greeting from './components/widgets/Greeting';
import Quote from './components/widgets/Quote';
import Search from './components/widgets/Search';
import Maximise from './components/widgets/Maximise';
import Favourite from './components/widgets/Favourite';

import Navbar from './components/Navbar';

import SettingsFunctions from './modules/settingsFunctions';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import { merge } from './modules/merge';
import RoomIcon from '@material-ui/icons/Room';

// Modals are lazy loaded as a user won't use them every time they open a tab
const Settings = React.lazy(() => import('./components/modals/Settings'));
const Update = React.lazy(() => import('./components/modals/Update'));
const Marketplace = React.lazy(() => import('./components/modals/Marketplace'));
const Addons = React.lazy(() => import('./components/modals/Addons'));
//const Welcome = React.lazy(() => import('./components/modals/Welcome'));
const renderLoader = () => <div></div>;

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      settingsModal: false,
      updateModal: false,
      marketplaceModal: false,
      addonsModal: false,
      quickAccessmodal: false,
      welcomeModal: false
    };
  }

  // Render all the components
  render() {
    if (!localStorage.getItem('firstRun')) SettingsFunctions.setDefaultSettings();

    let modalClassList = 'Modal';
    if (localStorage.getItem('darkTheme') === 'true') modalClassList = 'Modal dark';

    let overlayClassList = 'Overlay';
    if (localStorage.getItem('animations') === 'true') overlayClassList = 'Overlay modal-animation';

    let language = require(`./translations/${localStorage.getItem('language') || 'en'}.json`);
    const en = require('./translations/en.json');
    language = merge(en, language);

    const theme = localStorage.getItem('theme');
    if (theme) {
      const style = document.createElement('link');
      style.href = theme;
      style.rel = 'stylesheet';
      document.head.appendChild(style);
    }

    return (
      <React.Fragment>
        <Background/>
        <ToastContainer className='toast' position='bottom-right' autoClose={2500} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss />
        <div id='center'>
          <Search language={language.search} />
          <Navbar settingsModalOpen={() => this.setState({ settingsModal: true })} updateModalOpen={() => this.setState({ updateModal: true })} />
          <Greeting language={language.greeting} />
          <Clock/>
          <Quote language={language.toasts}/>
          <div className='credits' id='credits'>
            <h1 id='photographer'>{language.credit}</h1>
            <span id='credit' style={{'display': 'none'}}></span>
            <div id='backgroundCredits' className='tooltip'>
              <RoomIcon className='locationicon'/>
              <span className='tooltiptext' id='location'/>
            </div>
          </div>
          <Maximise/>
          <Favourite/>
          <React.Suspense fallback={renderLoader()}>
            <Modal id={'modal'} onRequestClose={() => this.setState({ settingsModal: false })} isOpen={this.state.settingsModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
              <Settings
                language={language.settings}
                modalLanguage={language.modals}
                modalClose={() => this.setState({ settingsModal: false })}
                setDefaultSettings={() => SettingsFunctions.setDefaultSettings()}
                openMarketplace={() => this.setState({ marketplaceModal: true, settingsModal: false })}
                openAddons={() => this.setState({ settingsModal: false, addonsModal: true })}
                toastLanguage={language.toasts} />
            </Modal>
            <Modal onRequestClose={() => this.setState({ updateModal: false })} isOpen={this.state.updateModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
              <Update
                language={language.update}
                modalClose={() => this.setState({ updateModal: false })} />
            </Modal>
            <Modal onRequestClose={() => this.setState({ marketplaceModal: false })} isOpen={this.state.marketplaceModal} className={modalClassList} overlayClassName='Overlay' ariaHideApp={false}>
              <Marketplace
                language={language.marketplace}
                modalLanguage={language.modals}
                modalClose={() => this.setState({ marketplaceModal: false })}
                openSettings={() => this.setState({ marketplaceModal: false, settingsModal: true })}
                openAddons={() => this.setState({ marketplaceModal: false, addonsModal: true })}
                toastLanguage={language.toasts} />
            </Modal>
            <Modal onRequestClose={() => this.setState({ addonsModal: false })} isOpen={this.state.addonsModal} className={modalClassList} overlayClassName='Overlay' ariaHideApp={false}>
              <Addons
                language={language.addons}
                marketplaceLanguage={language.marketplace}
                modalLanguage={language.modals}
                modalClose={() => this.setState({ addonsModal: false })}
                openSettings={() => this.setState({ addonsModal: false, settingsModal: true })}
                openMarketplace={() => this.setState({ addonsModal: false, marketplaceModal: true })}
                toastLanguage={language.toasts} />
            </Modal>
            {/* <Modal onRequestClose={() => this.setState({ welcomeModal: false })} isOpen={this.state.welcomeModal} className={modalClassList} overlayClassName='Overlay' ariaHideApp={false}>
              <Welcome modalClose={() => this.setState({ welcomeModal: false })} />
             </Modal> */ }
          </React.Suspense>
        </div>
      </React.Fragment>
    );
  }
}
