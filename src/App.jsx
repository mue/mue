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
import Modal from 'react-modal';
import './scss/index.scss'; 

//* App
export default class App extends React.Component {
  // Modal stuff
  constructor(props) {
    super(props);

    this.state = { modal: false };
    this.openModal = this.onOpenModal.bind(this);
  }

  onOpenModal() {
    this.setState({ modal: true });
  }

  onCloseModal() {
    this.setState({ modal: false });
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
    return (
      <React.Fragment>
        <Background/>
        <Search/>
        <div id='center'>
        <Navbar modalOpen={() => this.onOpenModal()}/>
            <Greeting/>
            <Clock/> 
            <Quote/>
            <Credit/>
            <Modal isOpen={this.state.modal} className='Modal' overlayClassName="Overlay" ariaHideApp={false}>
              <Settings modalClose={() => this.onCloseModal()} />
            </Modal>
        </div>
      </React.Fragment>
    );
  }
}
