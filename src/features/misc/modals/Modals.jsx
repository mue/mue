import variables from 'config/variables';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';

import { MainModal } from 'components/Elements';
import Navbar from '../../navbar/Navbar';

import EventBus from 'utils/eventbus';

function Modals() {
  const [main, setMainVisible] = useState(false);
  const [welcome, setWelcomeVisible] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem('showWelcome') !== 'false' &&
      window.location.search !== '?nointro=true'
    ) {
      setWelcomeVisible(true);
      variables.stats.postEvent('modal', 'Opened welcome');
    }

    if (window.location.search === '?nointro=true') {
      if (localStorage.getItem('showWelcome') !== 'false') {
        localStorage.setItem('showWelcome', false);
        EventBus.emit('refresh', 'widgets');
        EventBus.emit('refresh', 'backgroundwelcome');
      }
    }

    // hide refresh reminder once the user has refreshed the page
    localStorage.setItem('showReminder', false);
  }, []);

  const toggleModal = (type, action) => {
    switch (type) {
      case 'main':
        setMainVisible(action);
        break;
      case 'welcome':
        setWelcomeVisible(action);
        break;
      default:
        break;
    }

    if (action !== false) {
      variables.stats.postEvent('modal', `Opened ${type.replace('Modal', '')}`);
    }
  };

  return (
    <>
      {welcome === false && <Navbar openModal={(modal) => toggleModal('main', true)} />}
      <Modal
        closeTimeoutMS={300}
        onRequestClose={() => toggleModal('main', false)}
        isOpen={main}
        id="#modal"
        className="z-[100] h-[80vh] w-modal border-3 border-modal ease-in-out duration-800 transition-all backdrop-blur-3xl bg-modal-light dark:bg-modal-dark text-black dark:text-white overflow-y-auto shadow-xl rounded"
        overlayClassName="grid place-content-center absolute top-0 left-0 h-screen w-screen"
        ariaHideApp={false}
      >
        <MainModal modalClose={() => toggleModal('main', false)} />
      </Modal>
    </>
  );
}

export default Modals;
