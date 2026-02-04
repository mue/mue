import { useT } from 'contexts';
import variables from 'config/variables';
import { memo, useState, useEffect, useCallback } from 'react';
import {
  MdUpdate,
  MdOutlineExtensionOff,
  MdSendTimeExtension,
  MdExplore,
  MdViewModule,
  MdViewList,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import { SideloadFailedModal } from '../components/Elements/SideloadFailedModal/SideloadFailedModal';
import Items from '../components/Items/Items';
import { Dropdown, FileUpload } from 'components/Form/Settings';
import { Header, CustomActions } from 'components/Layout/Settings';
import { Button } from 'components/Elements';

import { install, uninstall } from 'utils/marketplace';
import { updateHash } from 'utils/deepLinking';

const Added = memo(() => {
  const t = useT();
  const [installed, setInstalled] = useState(JSON.parse(localStorage.getItem('installed')));
  const [showFailed, setShowFailed] = useState(false);
  const [failedReason, setFailedReason] = useState('');
  const [viewType, setViewType] = useState(localStorage.getItem('addonsViewType') || 'grid');

  const installAddon = useCallback((input) => {
    let failedReasonText = '';
    if (!input.name) {
      failedReasonText = t('modals.main.addons.sideload.errors.no_name');
    } else if (!input.author) {
      failedReasonText = t('modals.main.addons.sideload.errors.no_author');
    } else if (!input.type) {
      failedReasonText = t('modals.main.addons.sideload.errors.no_type');
    } else if (!input.version) {
      failedReasonText = t('modals.main.addons.sideload.errors.no_version');
    } else if (
      input.type === 'photos' &&
      (!input.photos ||
        !input.photos.length ||
        !input.photos[0].url ||
        !input.photos[0].url.default ||
        !input.photos[0].photographer ||
        !input.photos[0].location)
    ) {
      failedReasonText = t('modals.main.addons.sideload.errors.invalid_photos');
    } else if (
      input.type === 'quotes' &&
      (!input.quotes || !input.quotes.length || !input.quotes[0].quote || !input.quotes[0].author)
    ) {
      failedReasonText = t('modals.main.addons.sideload.errors.invalid_quotes');
    }

    if (failedReasonText !== '') {
      setFailedReason(failedReasonText);
      setShowFailed(true);
      return;
    }

    install(input.type, input, true, false);
    toast(t('toasts.installed'));
    variables.stats.postEvent('marketplace', 'Sideload');
    setInstalled(JSON.parse(localStorage.getItem('installed')));
    window.dispatchEvent(new window.Event('installedAddonsChanged'));
  }, []);

  const getSideloadButton = useCallback(() => {
    return (
      <Button
        type="settings"
        onClick={() => document.getElementById('file-input').click()}
        icon={<MdSendTimeExtension />}
        label={t('modals.main.addons.sideload.title')}
      />
    );
  }, []);

  const toggle = useCallback((type, data) => {
    if (type === 'item') {
      const itemId = data.name;
      updateHash(`#discover/all?item=${itemId}`);

      const event = new window.Event('popstate');
      window.dispatchEvent(event);

      variables.stats.postEvent('marketplace', 'ItemPage viewed');
    }
  }, []);

  const sortAddons = useCallback((value, sendEvent) => {
    const installedItems = JSON.parse(localStorage.getItem('installed'));

    switch (value) {
      case 'newest':
        installedItems.reverse();
        break;
      case 'a-z':
        installedItems.sort((a, b) => {
          const nameA = (a.display_name || a.name || '').toLowerCase();
          const nameB = (b.display_name || b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
        break;
      case 'recently-updated':
        installedItems.sort((a, b) => {
          const dateA = a.updated_at ? new Date(a.updated_at) : new Date(0);
          const dateB = b.updated_at ? new Date(b.updated_at) : new Date(0);
          return dateB - dateA;
        });
        break;
      default:
        break;
    }

    setInstalled(installedItems);

    if (sendEvent) {
      variables.stats.postEvent('marketplace', 'Sort');
    }
  }, []);

  const updateCheck = useCallback(() => {
    let updates = 0;
    installed.forEach(async (item) => {
      if (!item.id) {
        return;
      }

      const data = await (
        await fetch(variables.constants.API_URL + '/marketplace/item/' + item.id)
      ).json();

      if (data.version !== item.version) {
        updates++;
      }
    });

    if (updates > 0) {
      toast(t('modals.main.addons.updates_available', { amount: updates }));
    } else {
      toast(t('modals.main.addons.no_updates'));
    }
  }, [installed]);

  const removeAll = useCallback(() => {
    try {
      installed.forEach((item) => {
        uninstall(item.type, item.name);
      });
    } catch {}

    localStorage.setItem('installed', JSON.stringify([]));
    toast(t('toasts.uninstalled_all'));
    setInstalled([]);
    window.dispatchEvent(new window.Event('installedAddonsChanged'));
  }, [installed]);

  const handleUninstall = useCallback((type, name) => {
    uninstall(type, name);
    toast(t('toasts.uninstalled'));
    setInstalled(JSON.parse(localStorage.getItem('installed')));
    window.dispatchEvent(new window.Event('installedAddonsChanged'));
  }, []);

  const handleTogglePack = useCallback((packId, newState) => {
    const message = newState ? t('toasts.enabled') : t('toasts.disabled');
    toast(message);
  }, []);

  useEffect(() => {
    sortAddons(localStorage.getItem('sortAddons'), false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sideLoadBackendElements = () => (
    <>
      <Modal
        closeTimeoutMS={100}
        onRequestClose={() => setShowFailed(false)}
        isOpen={showFailed}
        className="Modal resetmodal mainModal resetmodal"
        overlayClassName="Overlay resetoverlay"
        ariaHideApp={false}
      >
        <SideloadFailedModal modalClose={() => setShowFailed(false)} reason={failedReason} />
      </Modal>
      <FileUpload
        id="file-input"
        type="settings"
        accept="application/json"
        loadFunction={(e) => installAddon(JSON.parse(e))}
      />
    </>
  );

  const goToDiscover = useCallback(() => {
    updateHash('#discover/all');
    const event = new window.Event('popstate');
    window.dispatchEvent(event);
  }, []);

  const toggleViewType = useCallback((type) => {
    setViewType(type);
    localStorage.setItem('addonsViewType', type);
  }, []);

  if (installed.length === 0) {
    return (
      <>
        <Header title={t('modals.main.navbar.addons')} report={false}>
          <CustomActions>{getSideloadButton()}</CustomActions>
        </Header>
        {sideLoadBackendElements()}
        <div className="emptyItems">
          <div className="emptyNewMessage">
            <MdOutlineExtensionOff />
            <span className="title">{t('modals.main.addons.empty.title')}</span>
            <span className="subtitle">{t('modals.main.addons.empty.description')}</span>
            <Button
              type="collection"
              onClick={goToDiscover}
              icon={<MdExplore />}
              label={t('modals.main.marketplace.addons.get_some')}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={t('modals.main.addons.added')} report={false}>
        <CustomActions>
          {getSideloadButton()}
          {sideLoadBackendElements()}
          <Button
            type="settings"
            onClick={updateCheck}
            icon={<MdUpdate />}
            label={t('modals.main.addons.check_updates')}
          />
          <Button
            type="settings"
            onClick={removeAll}
            icon={<MdOutlineExtensionOff />}
            label={t('modals.main.marketplace.addons.remove_all')}
          />
        </CustomActions>
      </Header>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '15px',
        }}
      >
        <Dropdown
          label={t('modals.main.addons.sort.title')}
          name="sortAddons"
          onChange={(value) => sortAddons(value)}
          items={[
            { value: 'newest', text: t('modals.main.addons.sort.newest') },
            { value: 'a-z', text: t('modals.main.addons.sort.a_z') },
            {
              value: 'recently-updated',
              text: t('modals.main.marketplace.addons.recently_updated'),
            },
          ]}
        />
        <div className="view-toggle-buttons">
          <button
            className={`view-toggle-btn ${viewType === 'grid' ? 'active' : ''}`}
            onClick={() => toggleViewType('grid')}
            aria-label={t('common.view_mode.grid')}
          >
            <MdViewModule />
          </button>
          <button
            className={`view-toggle-btn ${viewType === 'list' ? 'active' : ''}`}
            onClick={() => toggleViewType('list')}
            aria-label={t('common.view_mode.list')}
          >
            <MdViewList />
          </button>
        </div>
      </div>
      <Items
        items={installed}
        isAdded={true}
        filter=""
        toggleFunction={(input) => toggle('item', input)}
        showCreateYourOwn={false}
        onUninstall={handleUninstall}
        onTogglePack={handleTogglePack}
        viewType={viewType}
      />
    </>
  );
});

Added.displayName = 'Added';

export default Added;
