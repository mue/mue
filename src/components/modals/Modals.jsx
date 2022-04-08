import variables from 'modules/variables';
import { PureComponent, Suspense, lazy } from 'react';
import Modal from 'react-modal';
//import Hotkeys from 'react-hot-keys';

import Main from './main/Main';
import Navbar from '../widgets/navbar/Navbar';
import Preview from '../helpers/preview/Preview';

import EventBus from 'modules/helpers/eventbus';

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
      feedbackModal: false,
      preview: false,
    };
  }

  componentDidMount() {
    if (
      localStorage.getItem('showWelcome') === 'true' &&
      window.location.search !== '?nointro=true'
    ) {
      this.setState({
        welcomeModal: true,
      });
      variables.stats.postEvent('modal', 'Opened welcome');
    }

    if (window.location.search === '?nointro=true') {
      if (localStorage.getItem('showWelcome') === 'true') {
        localStorage.setItem('showWelcome', false);
        EventBus.dispatch('refresh', 'widgets');
        EventBus.dispatch('refresh', 'backgroundwelcome');
      }
    }

    // hide refresh reminder once the user has refreshed the page
    localStorage.setItem('showReminder', false);
  }

  closeWelcome() {
    localStorage.setItem('showWelcome', false);
    this.setState({
      welcomeModal: false,
    });
    EventBus.dispatch('refresh', 'widgetsWelcomeDone');
    EventBus.dispatch('refresh', 'widgets');
    EventBus.dispatch('refresh', 'backgroundwelcome');
  }

  previewWelcome() {
    localStorage.setItem('showWelcome', false);
    localStorage.setItem('welcomePreview', true);
    this.setState({
      welcomeModal: false,
      preview: true,
    });
    EventBus.dispatch('refresh', 'widgetsWelcome');
  }

  toggleModal(type, action) {
    this.setState({
      [type]: action,
    });

    if (action !== false) {
      variables.stats.postEvent('modal', `Opened ${type.replace('Modal', '')}`);
    }
  }

  render() {
    return (
      <>
        {this.state.welcomeModal === false ? (
          <Navbar openModal={(modal) => this.toggleModal(modal, true)} />
        ) : null}
        <Modal
          closeTimeoutMS={300}
          id="modal"
          onRequestClose={() => this.toggleModal('mainModal', false)}
          isOpen={this.state.mainModal}
          className="Modal mainModal"
          overlayClassName="Overlay"
          ariaHideApp={false}
        >
          <Main modalClose={() => this.toggleModal('mainModal', false)} />
        </Modal>
        <Suspense fallback={renderLoader()}>
          <Modal
            closeTimeoutMS={300}
            onRequestClose={() => this.closeWelcome()}
            isOpen={this.state.welcomeModal}
            className="Modal welcomemodal mainModal"
            overlayClassName="Overlay welcomeoverlay"
            shouldCloseOnOverlayClick={false}
            ariaHideApp={false}
          >
            <Welcome
              modalClose={() => this.closeWelcome()}
              modalSkip={() => this.previewWelcome()}
            />
          </Modal>
        </Suspense>
        {this.state.preview ? <Preview setup={() => window.location.reload()} /> : null}
        {/*variables.keybinds.toggleModal && variables.keybinds.toggleModal !== '' ? <Hotkeys keyName={variables.keybinds.toggleModal} onKeyDown={() => this.toggleModal('mainModal', (this.state.mainModal === true ? false : true))}/> : null*/}
      </>
    );
  }
}
