import variables from 'config/variables';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';

import { MainModal } from 'components/Elements';
import Navbar from '../../navbar/Navbar';
import Preview from '../../helpers/preview/Preview';

import EventBus from 'utils/eventbus';
import { parseDeepLink, shouldAutoOpenModal, updateHash } from 'utils/deepLinking';
import { install } from 'utils/marketplace';

import Welcome from 'features/welcome/Welcome';

const DEFAULT_PACK_ID = '0c8a5bdebd13';

const isDefaultPackInstalled = () => {
  const installed = JSON.parse(localStorage.getItem('installed') || '[]');
  return installed.some((item) => item.id === DEFAULT_PACK_ID);
};

const isDefaultPackUninstalled = () => {
  const uninstalledPacks = JSON.parse(localStorage.getItem('uninstalledPacks') || '[]');
  return uninstalledPacks.includes(DEFAULT_PACK_ID);
};

const tryInstallDefaultPack = async () => {
  // Don't install if offline mode, already installed, or explicitly uninstalled
  if (
    localStorage.getItem('offlineMode') === 'true' ||
    isDefaultPackInstalled() ||
    isDefaultPackUninstalled()
  ) {
    return false;
  }

  try {
    const response = await fetch(
      `${variables.constants.API_URL}/marketplace/item/${DEFAULT_PACK_ID}`,
    );
    const { data } = await response.json();
    install(data.type, data, false, true);
    return true;
  } catch (e) {
    console.error('Failed to install default pack:', e);
    return false;
  }
};

const Modals = () => {
  const [mainModal, setMainModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [welcomeModal, setWelcomeModal] = useState(false);
  const [appsModal, setAppsModal] = useState(false);
  const [preview, setPreview] = useState(false);
  const [deepLinkData, setDeepLinkData] = useState(null);

  useEffect(() => {
    // Check for preview mode - block deep links and redirect to /
    const isPreviewMode = localStorage.getItem('showWelcome') === 'true';
    if (isPreviewMode && shouldAutoOpenModal()) {
      window.history.replaceState(null, null, '/');
      setWelcomeModal(true);
      setPreview(false);
      return;
    }

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

    // Only hide refresh reminder if user navigated naturally (not via deep link or forced intro skip)
    // This ensures the reminder shows after user refreshes when they've made changes
    if (!shouldAutoOpenModal() && window.location.search !== '?nointro=true') {
      localStorage.setItem('showReminder', false);
    }

    // Try to install default pack if it wasn't installed during welcome (e.g., no internet)
    if (localStorage.getItem('showWelcome') !== 'true') {
      tryInstallDefaultPack().then((installed) => {
        if (installed) {
          EventBus.emit('refresh', 'quote');
        }
      });
    }

    // Listen for EventBus modal open requests
    const handleModalOpen = (data) => {
      if (data === 'openMainModal') {
        const linkData = parseDeepLink();
        setDeepLinkData(linkData);
        setMainModal(true);
      }
    };

    EventBus.on('modal', handleModalOpen);

    return () => {
      EventBus.off('modal', handleModalOpen);
    };
  }, []);

  const closeWelcome = async () => {
    localStorage.setItem('showWelcome', false);
    setWelcomeModal(false);

    await tryInstallDefaultPack();

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
      // Set initial hash when opening main modal
      if (type === 'mainModal') {
        updateHash('#settings');
      }
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
