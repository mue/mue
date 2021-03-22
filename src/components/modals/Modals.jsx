import React from 'react';

import Navbar from '../widgets/navbar/Navbar';

import Modal from 'react-modal';

// Modals are lazy loaded as the user won't use them every time they open a tab
const Main = React.lazy(() => import('./main/Main'));
const Update = React.lazy(() => import('./update/Update'));
const Welcome = React.lazy(() => import('./welcome/Welcome'));
//const Feedback = React.lazy(() => import('./components/modals/Feedback'));
const renderLoader = () => <></>;

export default class Modals extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      mainModal: false,
      updateModal: false,
      welcomeModal: false,
      feedbackModal: false,
      overlayClassList: (localStorage.getItem('animations') === 'true') ? 'Overlay modal-animation' : 'Overlay',
    };
  }

  componentDidMount() {
    if (localStorage.getItem('showWelcome') === 'true') {
      this.setState({
        welcomeModal: true
      });
    }
  }

  closeWelcome() {
    localStorage.setItem('showWelcome', false);
    this.setState({
      welcomeModal: false
    });
  }

  render() {
    return (
      <>
        <Navbar openModal={(modal) => this.setState({ [modal]: true })}/>
        <React.Suspense fallback={renderLoader()}>
          <Modal closeTimeoutMS={300} id={'modal'} onRequestClose={() => this.setState({ mainModal: false })} isOpen={this.state.mainModal} className='Modal' overlayClassName={this.state.overlayClassList} ariaHideApp={false}>
            <Main modalClose={() => this.setState({ mainModal: false })} />
          </Modal>
          <Modal onRequestClose={() => this.setState({ updateModal: false })} isOpen={this.state.updateModal} className='Modal' overlayClassName={this.state.overlayClassList} ariaHideApp={false}>
            <Update modalClose={() => this.setState({ updateModal: false })} />
         </Modal>
         <Modal onRequestClose={() => this.closeWelcome()} isOpen={this.state.welcomeModal} className='Modal' overlayClassName={this.state.overlayClassList} ariaHideApp={false}>
            <Welcome modalClose={() => this.closeWelcome()} />
          </Modal>
          {/* <Modal onRequestClose={() => this.setState({ feedbackModal: false })} isOpen={this.state.feedbackModal} className={modalClassList} overlayClassName={overlayClassList} ariaHideApp={false}>
              <Feedback modalClose={() => this.setState({ feedbackModal: false })} />
            </Modal> */}
        </React.Suspense>
      </>
    );
  }
}