import variables from 'config/variables';

import { useState } from 'react';

import Modal from 'react-modal';
import { MdAddLink } from 'react-icons/md';

import { AddModal } from 'components/Elements/AddModal';
import { Button } from 'components/Elements';

import { Row, Content, Action } from 'components/Layout/Settings/Item';

import { getTitleFromUrl, isValidUrl } from 'utils/links';
import { QuickLink } from 'features/quicklinks/options/QuickLink';

function AppsOptions({ appsEnabled }) {
  const [appsModalInfo, setAppsModalInfo] = useState({
    newLink: false,
    edit: false,
    items: JSON.parse(localStorage.getItem('applinks')),
    urlError: '',
    iconError: '',
    editData: null,
  });

  const addLink = async (name, url, icon) => {
    const data = JSON.parse(localStorage.getItem('applinks'));

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (url.length <= 0 || isValidUrl(url) === false) {
      return setAppsModalInfo((oldState) => ({
        ...oldState,
        urlError: variables.getMessage('widgets.quicklinks.url_error'),
      }));
    }

    if (icon.length > 0 && isValidUrl(icon) === false) {
      return setAppsModalInfo((oldState) => ({
        ...oldState,
        iconError: variables.getMessage('widgets.quicklinks.icon_error'),
      }));
    }

    data.push({
      name: name || (await getTitleFromUrl(url)),
      url,
      icon: icon || '',
      key: Math.random().toString(36).substring(7) + 1,
    });

    localStorage.setItem('applinks', JSON.stringify(data));

    setAppsModalInfo({
      newLink: false,
      edit: false,
      items: data,
      urlError: '',
      iconError: '',
    });

    variables.stats.postEvent('feature', 'App link add');
  };

  const startEditLink = (data) => {
    setAppsModalInfo((oldState) => ({
      ...oldState,
      edit: true,
      editData: data,
    }));
  };

  const editLink = async (og, name, url, icon) => {
    const data = JSON.parse(localStorage.getItem('applinks'));
    const dataobj = data.find((i) => i.key === og.key);
    dataobj.name = name || (await getTitleFromUrl(url));
    dataobj.url = url;
    dataobj.icon = icon || '';

    localStorage.setItem('applinks', JSON.stringify(data));

    setAppsModalInfo((oldState) => ({
      ...oldState,
      items: data,
      edit: false,
      newLink: false,
    }));
  };

  const deleteLink = (key, event) => {
    event.preventDefault();

    // remove link from array
    const data = JSON.parse(localStorage.getItem('applinks')).filter((i) => i.key !== key);

    localStorage.setItem('applinks', JSON.stringify(data));

    setAppsModalInfo((oldState) => ({
      ...oldState,
      items: data,
    }));

    variables.stats.postEvent('feature', 'App link delete');
  };

  return (
    <>
      <Row final={true} inactive={!appsEnabled}>
        <Content
          title={variables.getMessage('widgets.navbar.apps.title')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.appearance.navbar.apps_subtitle',
          )}
        />
        <Action>
          <Button
            type="settings"
            onClick={() => setAppsModalInfo((oldState) => ({ ...oldState, newLink: true }))}
            icon={<MdAddLink />}
            label={variables.getMessage('modals.main.settings.sections.quicklinks.add_link')}
          />
        </Action>
      </Row>

      <div className="messagesContainer">
        {appsModalInfo.items.map((item, i) => (
          <QuickLink
            key={i}
            item={item}
            startEditLink={() => startEditLink(item)}
            deleteLink={(key, e) => deleteLink(key, e)}
          />
        ))}
      </div>

      <Modal
        closeTimeoutMS={100}
        onRequestClose={() =>
          setAppsModalInfo((oldState) => ({ ...oldState, newLink: false, edit: false }))
        }
        isOpen={appsModalInfo.edit || appsModalInfo.newLink}
        className="Modal resetmodal mainModal"
        overlayClassName="Overlay resetoverlay"
        ariaHideApp={false}
      >
        <AddModal
          urlError={appsModalInfo.urlError}
          addLink={(name, url, icon) => addLink(name, url, icon)}
          editLink={(og, name, url, icon) => editLink(og, name, url, icon)}
          edit={appsModalInfo.edit}
          editData={appsModalInfo.editData}
          closeModal={() =>
            setAppsModalInfo((oldState) => ({ ...oldState, newLink: false, edit: false }))
          }
        />
      </Modal>
    </>
  );
}

export { AppsOptions as default, AppsOptions };
