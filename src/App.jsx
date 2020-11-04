import React from 'react';

import Background from './components/widgets/Background';
import Clock from './components/widgets/Clock';
import Greeting from './components/widgets/Greeting';
import Quote from './components/widgets/Quote';
import Search from './components/widgets/Search';
import Maximise from './components/widgets/Maximise';
import Favourite from './components/widgets/Favourite';
import PhotoInformation from './components/widgets/PhotoInformation';
import Date from './components/widgets/Date';

import Navbar from './components/Navbar';

import SettingsFunctions from './modules/helpers/settings';
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import merge from 'lodash.merge';

// Modals are lazy loaded as the user won't use them every time they open a tab
const MainModal = React.lazy(() => import('./components/modals/MainModal'));
const Update = React.lazy(() => import('./components/modals/Update'));
const Welcome = React.lazy(() => import('./components/modals/Welcome'));
const renderLoader = () => <div></div>;

export default class App extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      mainModal: false,
      updateModal: false,
      welcomeModal: false
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('firstRun')) SettingsFunctions.setDefaultSettings();
  }

  // Render all the components
  render() {
    let modalClassList = 'Modal'; // Modal features
    //  let tooltipClassList = 'tooltiptext';
    if ((localStorage.getItem('brightnessTime') && new Date().getHours() > 18) || localStorage.getItem('darkTheme') === 'true') {
      modalClassList = 'Modal dark';
     // tooltipClassList = 'tooltiptext dark';
    }
    const overlayClassList = (localStorage.getItem('animations') === 'true') ? 'Overlay modal-animation' : 'Overlay';

    const en = require('./translations/en.json'); // User language
    const language = merge(en, require(`./translations/${localStorage.getItem('language') || 'en'}.json`));

    return (
      <React.Fragment>
        <Background/>
        <ToastContainer position='bottom-right' autoClose={2500} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss />
        <div id='center'>
          <Search language={language.search} />
          <Navbar mainModalOpen={() => this.setState({ mainModal: true })} updateModalOpen={() => this.setState({ updateModal: true })} language={language} />
          <Greeting language={language.greeting} />
          <Clock/>
          <Date/>
          <Quote language={language.toasts} />
          <PhotoInformation language={language} />
          <div className='bottom-navbar'>
            <Maximise/>
            <Favourite/>
          </div>
          <React.Suspense fallback={renderLoader()}>
            <Modal id={'modal'} onRequestClose={() => this.setState({ mainModal: false })} isOpen={this.state.mainModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
              <MainModal
                language={language}
                modalClose={() => this.setState({ mainModal: false })} />
            </Modal>
            <Modal onRequestClose={() => this.setState({ updateModal: false })} isOpen={this.state.updateModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
              <Update
                language={language.update}
                modalClose={() => this.setState({ updateModal: false })} />
            </Modal>
            <Modal onRequestClose={() => this.setState({ welcomeModal: false })} isOpen={this.state.welcomeModal} className={modalClassList} overlayClassName='Overlay' ariaHideApp={false}>
              <Welcome modalClose={() => this.setState({ welcomeModal: false })} />
            </Modal>
          </React.Suspense>
        </div>
      </React.Fragment>
    );
  }
}
