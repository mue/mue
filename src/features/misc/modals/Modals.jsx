import variables from 'config/variables';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Modal from 'react-modal';

import { MainModal } from 'components/Elements';
import Navbar from '../../navbar/Navbar';
import Preview from '../../helpers/preview/Preview';

import EventBus from 'utils/eventbus';
import { parseDeepLink, shouldAutoOpenModal, updateHash } from 'utils/deepLinking';
import { install } from 'utils/marketplace';
import { useRouterBridge } from '../../../router/RouterBridge';

const Welcome = lazy(() => import('features/welcome/Welcome'));

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
    window.dispatchEvent(new Event('installedAddonsChanged'));
    return true;
  } catch (e) {
    console.error('Failed to install default pack:', e);
    return false;
  }
};

const Modals = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { deepLinkData } = useRouterBridge();

  const [mainModal, setMainModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [welcomeModal, setWelcomeModal] = useState(false);
  const [appsModal, setAppsModal] = useState(false);
  const [preview, setPreview] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);

  // Sync modal open state with router location
  useEffect(() => {
    const hasRoute = location.pathname !== '/';
    // Skip sync if modal is in the middle of closing to avoid race conditions
    if (isModalClosing) {
      return;
    }

    const timer = setTimeout(() => {
      if (hasRoute && !mainModal) {
        setMainModal(true);
        if (deepLinkData?.tab) {
          variables.stats.postEvent('modal', `Opened via deep link: ${deepLinkData.tab}`);
        }
      } else if (!hasRoute && mainModal && !isModalClosing) {
        setMainModal(false);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname, mainModal, deepLinkData, isModalClosing]);

  useEffect(() => {
    const isPreviewMode = localStorage.getItem('showWelcome') === 'true';
    if (isPreviewMode && shouldAutoOpenModal()) {
      navigate('/');
      setWelcomeModal(true);
      setPreview(false);
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

    if (!shouldAutoOpenModal() && window.location.search !== '?nointro=true') {
      localStorage.setItem('showReminder', false);
    }

    if (localStorage.getItem('showWelcome') !== 'true') {
      tryInstallDefaultPack().then((installed) => {
        if (installed) {
          EventBus.emit('refresh', 'quote');
        }
      });
    }

    const handleModalOpen = (data) => {
      if (data === 'openMainModal') {
        navigate('/settings');
        setMainModal(true);
      }
    };

    EventBus.on('modal', handleModalOpen);

    return () => {
      EventBus.off('modal', handleModalOpen);
    };
  }, [navigate]);

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
      if (type === 'mainModal') {
        navigate('/settings');
      }
    } else if (action === false && type === 'mainModal') {
      // Mark modal as closing to prevent sync logic from interfering
      setIsModalClosing(true);
      // Wait for close animation and cleanup to complete, then navigate
      setTimeout(() => {
        navigate('/');
        // Reset the closing flag after navigation
        setTimeout(() => {
          setIsModalClosing(false);
        }, 100);
      }, 350);
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
        <Suspense fallback={<div />}>
          <Welcome modalClose={() => closeWelcome()} modalSkip={() => previewWelcome()} />
        </Suspense>
      </Modal>
      {preview && <Preview setup={() => window.location.reload()} />}
    </>
  );
};

export { Modals as default, Modals };
