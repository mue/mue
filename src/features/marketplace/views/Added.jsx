import variables from 'config/variables';
import { memo, useState, useEffect, useCallback } from 'react';
import { MdUpdate, MdOutlineExtensionOff, MdSendTimeExtension, MdExplore } from 'react-icons/md';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

import { SideloadFailedModal } from '../components/Elements/SideloadFailedModal/SideloadFailedModal';
import ItemPage from './ItemPage';
import Items from '../components/Items/Items';
import { Dropdown, FileUpload } from 'components/Form/Settings';
import { Header, CustomActions } from 'components/Layout/Settings';
import { Button } from 'components/Elements';
import InstallButton from '../components/Elements/InstallButton';

import { install, uninstall, urlParser } from 'utils/marketplace';
import { updateHash } from 'utils/deepLinking';

const Added = memo(() => {
  const [installed, setInstalled] = useState(JSON.parse(localStorage.getItem('installed')));
  const [item, setItem] = useState({});
  const [showFailed, setShowFailed] = useState(false);
  const [failedReason, setFailedReason] = useState('');

  const uninstallItem = useCallback(() => {
    uninstall(item.type, item.display_name);
    toast(variables.getMessage('toasts.uninstalled'));

    setItem({});
    setInstalled(JSON.parse(localStorage.getItem('installed')));

    variables.stats.postEvent('marketplace', 'Uninstall');
  }, [item.type, item.display_name]);

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
      const installedItems = JSON.parse(localStorage.getItem('installed'));
      const info = { data: installedItems.find((i) => i.name === data.name) };

      setItem({
        type: info.data.type,
        display_name: info.data.name,
        author: info.data.author,
        description: urlParser(info.data.description.replace(/\n/g, '<br>')),
        version: info.data.version,
        icon: info.data.screenshot_url,
        data: info.data,
      });
      
      variables.stats.postEvent('marketplace', 'ItemPage viewed');
    } else {
      setItem({});
    }
  }, []);

  const sortAddons = useCallback((value, sendEvent) => {
    const installedItems = JSON.parse(localStorage.getItem('installed'));
    
    switch (value) {
      case 'newest':
        installedItems.reverse();
        break;
      case 'oldest':
        break;
      case 'a-z':
        installedItems.sort((a, b) => {
          if (a.display_name < b.display_name) {
            return -1;
          }
          if (a.display_name > b.display_name) {
            return 1;
          }
          return 0;
        });
        break;
      case 'z-a':
        installedItems.sort();
        installedItems.reverse();
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
      const data = await (
        await fetch(variables.constants.API_URL + 'marketplace/item/' + item.name)
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

  useEffect(() => {
    sortAddons(localStorage.getItem('sortAddons'), false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const button = item.display_name ? (
    <InstallButton
      onClick={uninstallItem}
      isInstalled={true}
      label={variables.getMessage('modals.main.marketplace.product.buttons.remove')}
    />
  ) : '';

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

  if (item.display_name) {
    return (
      <ItemPage
        data={item}
        button={button}
        addons={true}
        toggleFunction={() => toggle()}
      />
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
          { value: 'oldest', text: variables.getMessage('modals.main.addons.sort.oldest') },
          { value: 'a-z', text: variables.getMessage('modals.main.addons.sort.a_z') },
          { value: 'z-a', text: variables.getMessage('modals.main.addons.sort.z_a') },
        ]}
      />
      <Items
        items={installed}
        isAdded={true}
        filter=""
        toggleFunction={(input) => toggle('item', input)}
        showCreateYourOwn={false}
      />
    </>
  );
});

Added.displayName = 'Added';

export default Added;
