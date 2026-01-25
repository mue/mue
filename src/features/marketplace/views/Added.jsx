import variables from 'config/variables';
import { memo, useState, useEffect, useCallback } from 'react';
import { MdUpdate, MdOutlineExtensionOff, MdSendTimeExtension, MdExplore } from 'react-icons/md';
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
  const [installed, setInstalled] = useState(JSON.parse(localStorage.getItem('installed')));
  const [showFailed, setShowFailed] = useState(false);
  const [failedReason, setFailedReason] = useState('');

  const installAddon = useCallback((input) => {
    let failedReasonText = '';
    if (!input.name) {
      failedReasonText = variables.getMessage('modals.main.addons.sideload.errors.no_name');
    } else if (!input.author) {
      failedReasonText = variables.getMessage('modals.main.addons.sideload.errors.no_author');
    } else if (!input.type) {
      failedReasonText = variables.getMessage('modals.main.addons.sideload.errors.no_type');
    } else if (!input.version) {
      failedReasonText = variables.getMessage('modals.main.addons.sideload.errors.no_version');
    } else if (
      input.type === 'photos' &&
      (!input.photos ||
        !input.photos.length ||
        !input.photos[0].url ||
        !input.photos[0].url.default ||
        !input.photos[0].photographer ||
        !input.photos[0].location)
    ) {
      failedReasonText = variables.getMessage('modals.main.addons.sideload.errors.invalid_photos');
    } else if (
      input.type === 'quotes' &&
      (!input.quotes || !input.quotes.length || !input.quotes[0].quote || !input.quotes[0].author)
    ) {
      failedReasonText = variables.getMessage('modals.main.addons.sideload.errors.invalid_quotes');
    }

    if (failedReasonText !== '') {
      setFailedReason(failedReasonText);
      setShowFailed(true);
      return;
    }

    install(input.type, input, true, false);
    toast(variables.getMessage('toasts.installed'));
    variables.stats.postEvent('marketplace', 'Sideload');
    setInstalled(JSON.parse(localStorage.getItem('installed')));
  }, []);

  const getSideloadButton = useCallback(() => {
    return (
      <Button
        type="settings"
        onClick={() => document.getElementById('file-input').click()}
        icon={<MdSendTimeExtension />}
        label={variables.getMessage('modals.main.addons.sideload.title')}
      />
    );
  }, []);

  const toggle = useCallback((type, data) => {
    if (type === 'item') {
      // Navigate to discover tab with the item
      const itemId = data.name;
      updateHash(`#discover/all?item=${itemId}`);
      
      // Trigger navigation
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
      toast(variables.getMessage('modals.main.addons.updates_available', { amount: updates }));
    } else {
      toast(variables.getMessage('modals.main.addons.no_updates'));
    }
  }, [installed]);

  const removeAll = useCallback(() => {
    try {
      installed.forEach((item) => {
        uninstall(item.type, item.name);
      });
    } catch {
      // Ignore errors during bulk uninstall
    }

    localStorage.setItem('installed', JSON.stringify([]));
    toast(variables.getMessage('toasts.uninstalled_all'));
    setInstalled([]);
  }, [installed]);

  const handleUninstall = useCallback((type, name) => {
    uninstall(type, name);
    toast(variables.getMessage('toasts.uninstalled'));
    setInstalled(JSON.parse(localStorage.getItem('installed')));
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
        <SideloadFailedModal
          modalClose={() => setShowFailed(false)}
          reason={failedReason}
        />
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
    // Trigger a popstate event to update the UI
    const event = new window.Event('popstate');
    window.dispatchEvent(event);
  }, []);

  if (installed.length === 0) {
    return (
      <>
        <Header title={variables.getMessage('modals.main.navbar.addons')} report={false}>
          <CustomActions>{getSideloadButton()}</CustomActions>
        </Header>
        {sideLoadBackendElements()}
        <div className="emptyItems">
          <div className="emptyNewMessage">
            <MdOutlineExtensionOff />
            <span className="title">
              {variables.getMessage('modals.main.addons.empty.title')}
            </span>
            <span className="subtitle">
              {variables.getMessage('modals.main.addons.empty.description')}
            </span>
            <Button
              type="collection"
              onClick={goToDiscover}
              icon={<MdExplore />}
              label="Get Some"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={variables.getMessage('modals.main.addons.added')} report={false}>
        <CustomActions>
          {getSideloadButton()}
          {sideLoadBackendElements()}
          <Button
            type="settings"
            onClick={updateCheck}
            icon={<MdUpdate />}
            label={variables.getMessage('modals.main.addons.check_updates')}
          />
          <Button
            type="settings"
            onClick={removeAll}
            icon={<MdOutlineExtensionOff />}
            label="Remove all addons"
          />
        </CustomActions>
      </Header>
      <Dropdown
        label={variables.getMessage('modals.main.addons.sort.title')}
        name="sortAddons"
        onChange={(value) => sortAddons(value)}
        items={[
          { value: 'newest', text: variables.getMessage('modals.main.addons.sort.newest') },
          { value: 'a-z', text: variables.getMessage('modals.main.addons.sort.a_z') },
          { value: 'recently-updated', text: 'Recently Updated' },
        ]}
      />
      <Items
        items={installed}
        isAdded={true}
        filter=""
        toggleFunction={(input) => toggle('item', input)}
        showCreateYourOwn={false}
        onUninstall={handleUninstall}
      />
    </>
  );
});

Added.displayName = 'Added';

export default Added;
