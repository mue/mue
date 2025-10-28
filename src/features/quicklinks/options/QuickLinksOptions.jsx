import variables from 'config/variables';
import { useState, useEffect, useRef } from 'react';
import { MdAddLink, MdLinkOff } from 'react-icons/md';
import { arrayMove } from '@dnd-kit/sortable';
import { Header, Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { Checkbox, Dropdown } from 'components/Form/Settings';
import { Button } from 'components/Elements';
import Modal from 'react-modal';

import { AddModal } from 'components/Elements/AddModal';
import { SortableList } from './components';
import { readQuicklinks } from './utils/quicklinksUtils';

import EventBus from 'utils/eventbus';
import { getTitleFromUrl, isValidUrl } from 'utils/links';

const QuickLinksOptions = () => {
  const [items, setItems] = useState(readQuicklinks());
  const [showAddModal, setShowAddModal] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [iconError, setIconError] = useState('');
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState('');
  const [enabled, setEnabled] = useState(localStorage.getItem('quicklinksenabled') !== 'false');

  const quicklinksContainer = useRef();
  const silenceEventRef = useRef(false);

  const setContainerDisplay = (enabled) => {
    if (!quicklinksContainer || !quicklinksContainer.current) return;
    const el = quicklinksContainer.current;
    el.classList.toggle('disabled', !enabled);
    if (!enabled) {
      el.setAttribute('aria-hidden', 'true');
    } else {
      el.removeAttribute('aria-hidden');
    }
  };

  const deleteLink = (key, event) => {
    event.preventDefault();

    const stored = readQuicklinks();
    const data = stored.filter((i) => i.key !== key);
    silenceEventRef.current = true;
    localStorage.setItem('quicklinks', JSON.stringify(data));
    setItems(data);
    variables.stats.postEvent('feature', 'Quicklink delete');
    EventBus.emit('refresh', 'quicklinks');
    setTimeout(() => {
      silenceEventRef.current = false;
    }, 0);
  };

  const addLink = async (name, url, icon) => {
    const data = readQuicklinks();

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (url.length <= 0 || isValidUrl(url) === false) {
      setUrlError(variables.getMessage('widgets.quicklinks.url_error'));
      return;
    }

    if (icon.length > 0 && isValidUrl(icon) === false) {
      setIconError(variables.getMessage('widgets.quicklinks.url_error'));
      return;
    }

    const newItem = {
      name: name || (await getTitleFromUrl(url)),
      url,
      icon: icon || '',
      key: Date.now().toString() + Math.random().toString(36).substring(2),
    };

    data.push(newItem);

    silenceEventRef.current = true;
    localStorage.setItem('quicklinks', JSON.stringify(data));
    setItems(data);
    setShowAddModal(false);
    setUrlError('');
    setIconError('');
    variables.stats.postEvent('feature', 'Quicklink add');
    EventBus.emit('refresh', 'quicklinks');
    setTimeout(() => {
      silenceEventRef.current = false;
    }, 0);
  };

  const startEditLink = (data) => {
    setEdit(true);
    setEditData(data);
    setShowAddModal(true);
  };

  const editLink = async (og, name, url, icon) => {
    const data = readQuicklinks();
    const dataobj = data.find((i) => i.key === og.key);
    if (!dataobj) return;

    dataobj.name = name || (await getTitleFromUrl(url));
    dataobj.url = url;
    dataobj.icon = icon || '';

    silenceEventRef.current = true;
    localStorage.setItem('quicklinks', JSON.stringify(data));
    setItems(data);
    setShowAddModal(false);
    setEdit(false);
    EventBus.emit('refresh', 'quicklinks');
    setTimeout(() => {
      silenceEventRef.current = false;
    }, 0);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || !enabled) return;
    if (active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.key === active.id);
    const newIndex = items.findIndex((item) => item.key === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(items, oldIndex, newIndex);

    silenceEventRef.current = true;
    setItems(newItems);
    localStorage.setItem('quicklinks', JSON.stringify(newItems));
    EventBus.emit('refresh', 'quicklinks');
    setTimeout(() => {
      silenceEventRef.current = false;
    }, 0);
  };

  useEffect(() => {
    setContainerDisplay(enabled);
  }, [enabled]);

  useEffect(() => {
    setContainerDisplay(enabled);

    const handleRefresh = (data) => {
      if (data !== 'quicklinks') return;
      if (silenceEventRef.current) return;

      const newEnabled = localStorage.getItem('quicklinksenabled') !== 'false';
      const newItems = readQuicklinks();
      const oldItems = items || [];

      const keysEqual =
        oldItems.length === newItems.length &&
        oldItems.every((i) => newItems.some((n) => n.key === i.key));

      if (newEnabled !== enabled || !keysEqual) {
        setContainerDisplay(newEnabled);
        setItems(newItems);
        setEnabled(newEnabled);
      }
    };

    EventBus.on('refresh', handleRefresh);
    return () => {
      EventBus.off('refresh', handleRefresh);
    };
  }, [enabled, items]);

  const QUICKLINKS_SECTION = 'modals.main.settings.sections.quicklinks';

  const AdditionalSettings = () => (
    <Row>
      <Content
        title={variables.getMessage('modals.main.settings.additional_settings')}
        subtitle={variables.getMessage(`${QUICKLINKS_SECTION}.additional`)}
      />
      <Action>
        <Checkbox
          name="quicklinksnewtab"
          text={variables.getMessage(`${QUICKLINKS_SECTION}.open_new`)}
          category="quicklinks"
        />
        <Checkbox
          name="quicklinkstooltip"
          text={variables.getMessage(`${QUICKLINKS_SECTION}.tooltip`)}
          category="quicklinks"
        />
      </Action>
    </Row>
  );

  const StylingOptions = () => (
    <Row>
      <Content
        title={variables.getMessage(`${QUICKLINKS_SECTION}.styling`)}
        subtitle={variables.getMessage(
          'modals.main.settings.sections.quicklinks.styling_description',
        )}
      />
      <Action>
        <Dropdown
          label={variables.getMessage(`${QUICKLINKS_SECTION}.style`)}
          name="quickLinksStyle"
          category="quicklinks"
          items={[
            { value: 'icon', text: variables.getMessage(`${QUICKLINKS_SECTION}.options.icon`) },
            {
              value: 'text_only',
              text: variables.getMessage(`${QUICKLINKS_SECTION}.options.text_only`),
            },
            { value: 'metro', text: variables.getMessage(`${QUICKLINKS_SECTION}.options.metro`) },
          ]}
        />
      </Action>
    </Row>
  );

  const AddLink = () => (
    <Row final={true}>
      <Content title={variables.getMessage(`${QUICKLINKS_SECTION}.title`)} />
      <Action>
        <Button
          type="settings"
          onClick={() => enabled && setShowAddModal(true)}
          icon={<MdAddLink />}
          label={variables.getMessage(`${QUICKLINKS_SECTION}.add_link`)}
          disabled={!enabled}
        />
      </Action>
    </Row>
  );

  return (
    <>
      <Header
        title={variables.getMessage(`${QUICKLINKS_SECTION}.title`)}
        setting="quicklinksenabled"
        category="quicklinks"
        element=".quicklinks-container"
        zoomSetting="zoomQuicklinks"
        visibilityToggle={true}
      />

      <PreferencesWrapper
        setting="quicklinksenabled"
        category="quicklinks"
        visibilityToggle={true}
        zoomSetting="zoomQuicklinks"
      >
        <AdditionalSettings />
        <StylingOptions />
        <AddLink />

        {items.length === 0 && (
          <div className="photosEmpty">
            <div className="emptyNewMessage">
              <MdLinkOff />
              <span className="title">
                {variables.getMessage(`${QUICKLINKS_SECTION}.no_quicklinks`)}
              </span>
              <span className="subtitle">
                {variables.getMessage('modals.main.settings.sections.message.add_some')}
              </span>
              <Button
                type="settings"
                onClick={() => setShowAddModal(true)}
                icon={<MdAddLink />}
                label={variables.getMessage(`${QUICKLINKS_SECTION}.add_link`)}
              />
            </div>
          </div>
        )}
      </PreferencesWrapper>
      <div
        className={`quicklinks-container ${!enabled ? 'disabled' : ''}`}
        ref={quicklinksContainer}
        aria-hidden={!enabled}
      >
        <div className={`messagesContainer ${!enabled ? 'disabled' : ''}`}>
          <SortableList
            items={items}
            enabled={enabled}
            onDragEnd={handleDragEnd}
            startEditLink={(data) => startEditLink(data)}
            deleteLink={(key, e) => deleteLink(key, e)}
          />
        </div>
      </div>

      <Modal
        closeTimeoutMS={100}
        onRequestClose={() => {
          setShowAddModal(false);
          setUrlError('');
          setIconError('');
        }}
        isOpen={showAddModal}
        className="Modal resetmodal mainModal"
        overlayClassName="Overlay resetoverlay"
        ariaHideApp={false}
      >
        <AddModal
          urlError={urlError}
          addLink={(name, url, icon) => addLink(name, url, icon)}
          editLink={(og, name, url, icon) => editLink(og, name, url, icon)}
          edit={edit}
          editData={editData}
          closeModal={() => {
            setShowAddModal(false);
            setUrlError('');
            setIconError('');
            setEdit(false);
          }}
        />
      </Modal>
    </>
  );
};

export { QuickLinksOptions as default, QuickLinksOptions };
