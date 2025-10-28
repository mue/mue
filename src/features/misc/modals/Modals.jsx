import variables from 'config/variables';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';

import { MainModal } from 'components/Elements';
import Navbar from '../../navbar/Navbar';
import Preview from '../../helpers/preview/Preview';

import EventBus from 'utils/eventbus';
import { parseDeepLink, shouldAutoOpenModal } from 'utils/deepLinking';

import Welcome from 'features/welcome/Welcome';

const Modals = () => {
  const [mainModal, setMainModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [welcomeModal, setWelcomeModal] = useState(false);
  const [appsModal, setAppsModal] = useState(false);
  const [preview, setPreview] = useState(false);
  const [deepLinkData, setDeepLinkData] = useState(null);

  useEffect(() => {
    // Check for deep link first (has priority)
    if (shouldAutoOpenModal()) {
      const linkData = parseDeepLink();
      setMainModal(true);
      setDeepLinkData(linkData);
      variables.stats.postEvent('modal', `Opened via deep link: ${linkData.tab}`);
      return;
    }

    if (
      localStorage.getItem('showWelcome') === 'true' &&
      window.location.search !== '?nointro=true'
    ) {
      setWelcomeModal(true);
      variables.stats.postEvent('modal', 'Opened welcome');
    }

    if (window.location.search === '?nointro=true') {
      if (localStorage.getItem('showWelcome') === 'true') {
        localStorage.setItem('showWelcome', false);
        EventBus.emit('refresh', 'widgets');
        EventBus.emit('refresh', 'backgroundwelcome');
      }
    }

    // hide refresh reminder once the user has refreshed the page
    localStorage.setItem('showReminder', false);
  }, []);

  const closeWelcome = () => {
    localStorage.setItem('showWelcome', false);
    setWelcomeModal(false);
    EventBus.emit('refresh', 'widgetsWelcomeDone');
    EventBus.emit('refresh', 'widgets');
    EventBus.emit('refresh', 'backgroundwelcome');
  };

  const previewWelcome = () => {
    localStorage.setItem('showWelcome', false);
    localStorage.setItem('welcomePreview', true);
    setWelcomeModal(false);
    setPreview(true);
    EventBus.emit('refresh', 'widgetsWelcome');
  };

  const toggleModal = (type, action) => {
    const modalSetters = {
      mainModal: setMainModal,
      updateModal: setUpdateModal,
      welcomeModal: setWelcomeModal,
      appsModal: setAppsModal,
    };

    if (modalSetters[type]) {
      modalSetters[type](action);
    }

    if (action !== false) {
      variables.stats.postEvent('modal', `Opened ${type.replace('Modal', '')}`);
    }
  };

  return (
    <>
      {welcomeModal === false && <Navbar openModal={(modal) => toggleModal(modal, true)} />}
      <Modal
        closeTimeoutMS={300}
        id="modal"
        onRequestClose={() => toggleModal('mainModal', false)}
        isOpen={mainModal}
        className="Modal mainModal"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        <MainModal modalClose={() => toggleModal('mainModal', false)} deepLinkData={deepLinkData} />
      </Modal>
      <Modal
        closeTimeoutMS={300}
        onRequestClose={() => closeWelcome()}
        isOpen={welcomeModal}
        className="Modal welcomemodal mainModal"
        overlayClassName="Overlay mainModal"
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
      >
        <Welcome modalClose={() => closeWelcome()} modalSkip={() => previewWelcome()} />
      </Modal>
      {preview && <Preview setup={() => window.location.reload()} />}
    </>
  );
};

export { Modals as default, Modals };
