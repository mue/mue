import variables from 'modules/variables';

import { useState, memo } from 'react';

import Modal from 'react-modal';
import { MdAddLink } from 'react-icons/md';

import AddModal from './quicklinks/AddModal';

import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Button from '../Button';

import { Row, Content, Action } from '../SettingsItem';
import Header from '../Header';
import { getTitleFromUrl, isValidUrl } from 'modules/helpers/settings/modals';
import QuickLink from './quicklinks/QuickLink';
import Apps from '../../../../widgets/navbar/Apps';

function Navbar() {
  const [showRefreshOptions, setShowRefreshOptions] = useState(
    localStorage.getItem('refresh') === 'true',
  );
  const [appsEnabled, setAppsEnabled] = useState(localStorage.getItem('appsEnabled') === 'true');
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
      return this.setState((oldState) => ({
        ...oldState,
        iconError: variables.getMessage('widgets.quicklinks.url_error'),
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

  const NAVBAR_SECTION = 'modals.main.settings.sections.appearance.navbar';

  const AdditionalSettings = () => {
    return (
      <Row final={false}>
        <Content
          title={variables.getMessage('modals.main.settings.additional_settings')}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.appearance.navbar.additional',
          )}
        />
        <Action>
          <Checkbox
            name="navbarHover"
            text={variables.getMessage(`${NAVBAR_SECTION}.hover`)}
            category="navbar"
          />
          <Checkbox
            name="notesEnabled"
            text={variables.getMessage(`${NAVBAR_SECTION}.notes`)}
            category="navbar"
          />
          <Checkbox
            name="view"
            text={variables.getMessage('modals.main.settings.sections.background.buttons.view')}
            category="navbar"
          />
          <Checkbox
            name="refresh"
            text={variables.getMessage(`${NAVBAR_SECTION}.refresh`)}
            category="navbar"
            onChange={setShowRefreshOptions}
          />
          <Checkbox
            name="todoEnabled"
            text={variables.getMessage('widgets.navbar.todo.title')}
            category="navbar"
          />

          <Checkbox
            name="appsEnabled"
            text={variables.getMessage('widgets.navbar.apps.title')}
            category="navbar"
            onChange={setAppsEnabled}
          />
        </Action>
      </Row>
    );
  };

  const RefreshOptions = () => {
    return (
      <Row final={false} inactive={!showRefreshOptions}>
        <Content
          title={variables.getMessage(`${NAVBAR_SECTION}.refresh`)}
          subtitle={variables.getMessage(
            'modals.main.settings.sections.appearance.navbar.refresh_subtitle',
          )}
        />
        <Action>
          <Dropdown name="refreshOption" category="navbar">
            <option value="page">
              {variables.getMessage(
                'modals.main.settings.sections.appearance.navbar.refresh_options.page',
              )}
            </option>
            <option value="background">
              {variables.getMessage('modals.main.settings.sections.background.title')}
            </option>
            <option value="quote">
              {variables.getMessage('modals.main.settings.sections.quote.title')}
            </option>
            <option value="quotebackground">
              {variables.getMessage('modals.main.settings.sections.quote.title')} +{' '}
              {variables.getMessage('modals.main.settings.sections.background.title')}
            </option>
          </Dropdown>
        </Action>
      </Row>
    );
  };

  const AppsOptions = () => {
    return (
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
    );
  };

  return (
    <>
      <Header
        title={variables.getMessage(`${NAVBAR_SECTION}.title`)}
        setting="navbar"
        category="widgets"
        zoomSetting="zoomNavbar"
        zoomCategory="navbar"
      />
      <AdditionalSettings />
      <RefreshOptions />
      <AppsOptions />

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

export default memo(Navbar);
