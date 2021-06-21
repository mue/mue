import React from 'react';

import Main from './main/Main';
import Navbar from '../widgets/navbar/Navbar';

import Modal from 'react-modal';

// These modals are lazy loaded as the user won't use them every time they open a tab
// We used to lazy load the main modal, but doing so broke the main modal open animation on first click
const Welcome = React.lazy(() => import('./welcome/Welcome'));
const Feedback = React.lazy(() => import('./feedback/Feedback'));
const renderLoader = () => <></>;

export default class Modals extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      mainModal: false,
      updateModal: false,
      welcomeModal: false,
      feedbackModal: false
    };
  }

  componentDidMount() {
    if (localStorage.getItem('showWelcome') === 'true' && window.location.search !== '?nointro=true') {
      this.setState({
        welcomeModal: true
      });
      window.analytics.postEvent('modalUpdate', 'Opened welcome modal');
    }

    // hide refresh reminder once the user has refreshed the page
    localStorage.setItem('showReminder', false);
  }

  closeWelcome() {
    localStorage.setItem('showWelcome', false);
    this.setState({
      welcomeModal: false
    });
    window.analytics.postEvent('modalUpdate', 'Closed welcome modal');
  }

  toggleModal(type, action) {
    this.setState({
      [type]: action
    });
    window.analytics.postEvent('modalUpdate', `${(action === false) ? 'Closed' : 'Opened'} ${type.replace('Modal', '')} modal`);
  }

  render() {
    return (
      <>
        <Navbar openModal={(modal) => this.toggleModal(modal, true)}/>
        <Modal closeTimeoutMS={300} id='modal' onRequestClose={() => this.toggleModal('mainModal', false)} isOpen={this.state.mainModal} className='Modal mainModal' overlayClassName='Overlay' ariaHideApp={false}>
          <Main modalClose={() => this.toggleModal('mainModal', false)}/>
        </Modal>
        <React.Suspense fallback={renderLoader()}>
          <Modal closeTimeoutMS={300} onRequestClose={() => this.closeWelcome()} isOpen={this.state.welcomeModal} className='Modal welcomemodal mainModal' overlayClassName='Overlay' ariaHideApp={false}>
            <Welcome modalClose={() => this.closeWelcome()}/>
          </Modal>
          <Modal closeTimeoutMS={300} onRequestClose={() => this.toggleModal('feedbackModal', false)} isOpen={this.state.feedbackModal} className='Modal mainModal' overlayClassName='Overlay' ariaHideApp={false}>
            <Feedback modalClose={() => this.toggleModal('feedbackModal', false)}/>
          </Modal>
        </React.Suspense>
      </>
    );
  }
}