import { PureComponent, Suspense, lazy } from 'react';
import Modal from 'react-modal';

import Main from './main/Main';
import Feedback from './feedback/Feedback';
import Navbar from '../widgets/navbar/Navbar';

import EventBus from '../../modules/helpers/eventbus';

// Welcome modal is lazy loaded as the user won't use it every time they open a tab
// We used to lazy load the main and feedback modals, but doing so broke the modal open animation on first click
const Welcome = lazy(() => import('./welcome/Welcome'));
const renderLoader = () => <></>;

export default class Modals extends PureComponent {
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
      window.stats.postEvent('modal', 'Opened welcome');
    }

    // hide refresh reminder once the user has refreshed the page
    localStorage.setItem('showReminder', false);
  }

  closeWelcome() {
    localStorage.setItem('showWelcome', false);
    this.setState({
      welcomeModal: false
    });
    EventBus.dispatch('refresh', 'widgets');
    EventBus.dispatch('refresh', 'backgroundwelcome');
  }

  toggleModal(type, action) {
    this.setState({
      [type]: action
    });

    if (action !== false) {
      window.stats.postEvent('modal', `Opened ${type.replace('Modal', '')}`);
    }
  }

  render() {
    return (
      <>
        {this.state.welcomeModal === false ? <Navbar openModal={(modal) => this.toggleModal(modal, true)}/> : null}
        <Modal closeTimeoutMS={300} id='modal' onRequestClose={() => this.toggleModal('mainModal', false)} isOpen={this.state.mainModal} className='Modal mainModal' overlayClassName='Overlay' ariaHideApp={false}>
          <Main modalClose={() => this.toggleModal('mainModal', false)}/>
        </Modal>
        <Suspense fallback={renderLoader()}>
          <Modal closeTimeoutMS={300} onRequestClose={() => this.closeWelcome()} isOpen={this.state.welcomeModal} className='Modal welcomemodal mainModal' overlayClassName='Overlay welcomeoverlay' shouldCloseOnOverlayClick={false} ariaHideApp={false}>
            <Welcome modalClose={() => this.closeWelcome()}/>
          </Modal>
          <Modal closeTimeoutMS={300} onRequestClose={() => this.toggleModal('feedbackModal', false)} isOpen={this.state.feedbackModal} className='Modal mainModal' overlayClassName='Overlay' ariaHideApp={false}>
            <Feedback modalClose={() => this.toggleModal('feedbackModal', false)}/>
          </Modal>
        </Suspense>
      </>
    );
  }
}
