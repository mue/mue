//* Imports
import React from 'react';
import Background from './components/Background';
import Clock from './components/Clock';
import Greeting from './components/Greeting';
import Quote from './components/Quote';
import Search from './components/Search';
import Credit from './components/Credit';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import Update from './components/Update';
import Modal from 'react-modal';
import './scss/index.scss'; 

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

  // Render all the components
  render() {
    if (!localStorage.getItem('firstRun')) {
      localStorage.setItem('time', true);
      localStorage.setItem('greeting', true);
      localStorage.setItem('background', true);
      localStorage.setItem('quote', true);
      localStorage.setItem('firstRun', true);
    }

    let modalClassList = 'Modal';
    const darkTheme = localStorage.getItem('darkTheme');
    if (darkTheme === 'true') modalClassList = 'Modal dark';
  
    return (
      <React.Fragment>
        <div id='backgroundImage'></div>
        <Background/>
        <Search/>
        <div id='center'>
        <Navbar settingsModalOpen={() => this.setState({ settingsModal: true })} updateModalOpen={() => this.setState({ updateModal: true })} />
            <Greeting/>
            <Clock/> 
            <Quote/>
            <Credit/>
            <Modal isOpen={this.state.settingsModal} className={modalClassList} overlayClassName="Overlay" ariaHideApp={false}>
              <Settings modalClose={() => this.setState({ settingsModal: false })} />
            </Modal>
            <Modal isOpen={this.state.updateModal} className={modalClassList} overlayClassName="Overlay" ariaHideApp={false}>
              <Update modalClose={() => this.setState({ updateModal: false })} />
            </Modal>
        </div>
      </React.Fragment>
    );
  }
}
