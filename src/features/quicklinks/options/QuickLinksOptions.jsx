import variables from 'config/variables';
import { useState, useEffect, useRef } from 'react';
import {
  MdAddLink,
  MdLinkOff,
  MdSync,
  MdOutlineStyle,
  MdOutlineVisibility,
  MdOutlineFolderOpen,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import { arrayMove } from '@dnd-kit/sortable';
import { Header, Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { Checkbox, Dropdown } from 'components/Form/Settings';
import { Button } from 'components/Elements';
import Modal from 'react-modal';

import { AddModal } from 'components/Elements/AddModal';
import { SortableList } from './components';
import { readQuicklinks } from './utils/quicklinksUtils';
import { BookmarkService } from 'utils/quicklinks';

import EventBus from 'utils/eventbus';
import { getTitleFromUrl, isValidUrl } from 'utils/links';

const NavigationCard = ({ icon: Icon, title, subtitle, onClick }) => {
  return (
    <div className="moreSettings" onClick={onClick}>
      <div className="left">
        <Icon />
        <div className="content">
          <span className="title">{title}</span>
          <span className="subtitle">{subtitle}</span>
        </div>
      </div>
      <div className="action">
        <MdOutlineKeyboardArrowRight />
      </div>
    </div>
  );
};

const QuickLinksOptions = ({ currentSubSection, onSubSectionChange, sectionName }) => {
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

  const addLink = async (name, url, icon, iconType = 'auto', iconData = null) => {
    const data = readQuicklinks();

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (url.length <= 0 || isValidUrl(url) === false) {
      setUrlError(variables.getMessage('widgets.quicklinks.url_error'));
      return;
    }

    if (iconType === 'custom_url' && icon.length > 0 && isValidUrl(icon) === false) {
      setIconError(variables.getMessage('widgets.quicklinks.url_error'));
      return;
    }

    const newItem = {
      name: name || (await getTitleFromUrl(url)),
      url,
      icon: icon || '',
      iconType: iconType || 'auto',
      iconData: iconData || null,
      iconFallbacks: [],
      groupId: null,
      order: data.length,
      bookmarkId: null,
      bookmarkSource: null,
      lastSynced: null,
      syncEnabled: false,
      customColor: null,
      hideLabel: false,
      key: Date.now().toString() + Math.random().toString(36).substring(2),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      accessCount: 0,
      lastAccessed: null,
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

  const editLink = async (og, name, url, icon, iconType = 'auto', iconData = null) => {
    const data = readQuicklinks();
    const dataobj = data.find((i) => i.key === og.key);
    if (!dataobj) return;

    dataobj.name = name || (await getTitleFromUrl(url));
    dataobj.url = url;
    dataobj.icon = icon || '';
    dataobj.iconType = iconType || 'auto';
    dataobj.iconData = iconData || null;
    dataobj.updatedAt = Date.now();

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

  // Subsection: Appearance (Style + Layout)
  const AppearanceSection = () => {
    const handleLayoutChange = (key, value) => {
      const config = JSON.parse(localStorage.getItem('quicklinks_config') || '{}');
      config[key] = value;
      localStorage.setItem('quicklinks_config', JSON.stringify(config));
      EventBus.emit('refresh', 'quicklinks');
    };

    return (
      <>
        <Row>
          <Content
            title={variables.getMessage(`${QUICKLINKS_SECTION}.styling`)}
            subtitle={variables.getMessage(`${QUICKLINKS_SECTION}.styling_description`)}
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
                {
                  value: 'metro',
                  text: variables.getMessage(`${QUICKLINKS_SECTION}.options.metro`),
                },
              ]}
            />
          </Action>
        </Row>

        <Row>
          <Content title="Layout" subtitle="Configure grid layout and organization" />
          <Action>
            <Dropdown
              label="Layout Mode"
              name="quicklinks_layoutMode"
              category="quicklinks"
              onChange={(value) => handleLayoutChange('layoutMode', value)}
              items={[
                { value: 'flex', text: 'Flexible' },
                { value: 'grid', text: 'Grid' },
                { value: 'compact', text: 'Compact' },
              ]}
            />
            <Dropdown
              label="Grid Columns"
              name="quicklinks_gridColumns"
              category="quicklinks"
              onChange={(value) => handleLayoutChange('gridColumns', value)}
              items={[
                { value: 'auto', text: 'Auto' },
                { value: '2', text: '2' },
                { value: '3', text: '3' },
                { value: '4', text: '4' },
                { value: '5', text: '5' },
                { value: '6', text: '6' },
              ]}
            />
            <Dropdown
              label="Grid Rows"
              name="quicklinks_gridRows"
              category="quicklinks"
              onChange={(value) => handleLayoutChange('gridRows', value)}
              items={[
                { value: 'auto', text: 'Auto' },
                { value: '2', text: '2' },
                { value: '3', text: '3' },
                { value: '4', text: '4' },
              ]}
            />
          </Action>
        </Row>
      </>
    );
  };

  // Subsection: Display
  const DisplaySection = () => (
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

  // Subsection: Organization
  const OrganizationSection = () => {
    const handleGroupingToggle = (value) => {
      const config = JSON.parse(localStorage.getItem('quicklinks_config') || '{}');
      config.groupingEnabled = value;
      config.showGroupHeaders = value;
      localStorage.setItem('quicklinks_config', JSON.stringify(config));
      EventBus.emit('refresh', 'quicklinks');
    };

    return (
      <Row>
        <Content title="Groups" subtitle="Organize quick links into groups" />
        <Action>
          <Checkbox
            name="quicklinks_groupingEnabled"
            text="Enable Grouping"
            category="quicklinks"
            onChange={handleGroupingToggle}
          />
        </Action>
      </Row>
    );
  };

  // Subsection: Sync
  const SyncSection = () => {
    const [syncStatus, setSyncStatus] = useState('');
    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
      setSyncing(true);
      setSyncStatus('Syncing...');
      try {
        const hasPermission = await BookmarkService.checkPermissions();
        if (!hasPermission) {
          const granted = await BookmarkService.requestPermissions();
          if (!granted) {
            setSyncStatus('Permission denied');
            setSyncing(false);
            return;
          }
        }

        const result = await BookmarkService.syncBookmarks();
        setSyncStatus(
          `Synced: ${result.imported} imported, ${result.updated} updated, ${result.removed} removed`,
        );
        EventBus.emit('refresh', 'quicklinks');
      } catch (e) {
        setSyncStatus(`Error: ${e.message}`);
      }
      setSyncing(false);
    };

    return (
      <Row>
        <Content
          title="Bookmark Sync"
          subtitle="Import and sync browser bookmarks to quick links"
        />
        <Action>
          <Button
            type="settings"
            onClick={handleSync}
            icon={<MdSync />}
            label="Sync Bookmarks"
            disabled={syncing}
          />
          {syncStatus && <p style={{ marginTop: '8px', fontSize: '14px' }}>{syncStatus}</p>}
        </Action>
      </Row>
    );
  };

  const getHeader = () => {
    if (currentSubSection === 'appearance') {
      return (
        <Header
          title={variables.getMessage(`${QUICKLINKS_SECTION}.title`)}
          secondaryTitle="Appearance"
          goBack={() => onSubSectionChange(null, sectionName)}
          zoomSetting="zoomQuicklinks"
        />
      );
    }

    if (currentSubSection === 'display') {
      return (
        <Header
          title={variables.getMessage(`${QUICKLINKS_SECTION}.title`)}
          secondaryTitle="Display"
          goBack={() => onSubSectionChange(null, sectionName)}
        />
      );
    }

    if (currentSubSection === 'organization') {
      return (
        <Header
          title={variables.getMessage(`${QUICKLINKS_SECTION}.title`)}
          secondaryTitle="Organization"
          goBack={() => onSubSectionChange(null, sectionName)}
        />
      );
    }

    if (currentSubSection === 'sync') {
      return (
        <Header
          title={variables.getMessage(`${QUICKLINKS_SECTION}.title`)}
          secondaryTitle="Bookmark Sync"
          goBack={() => onSubSectionChange(null, sectionName)}
        />
      );
    }

    return (
      <Header
        title={variables.getMessage(`${QUICKLINKS_SECTION}.title`)}
        setting="quicklinksenabled"
        category="quicklinks"
        element=".quicklinks-container"
        visibilityToggle={true}
      />
    );
  };

  return (
    <>
      {getHeader()}

      {!currentSubSection && (
        <>
          <NavigationCard
            icon={MdOutlineStyle}
            title="Appearance"
            subtitle="Customize style and layout of quick links"
            onClick={() => onSubSectionChange('appearance', sectionName)}
          />

          <NavigationCard
            icon={MdOutlineVisibility}
            title="Display"
            subtitle="Configure tooltips and tab behavior"
            onClick={() => onSubSectionChange('display', sectionName)}
          />

          <NavigationCard
            icon={MdOutlineFolderOpen}
            title="Organization"
            subtitle="Organize links into groups"
            onClick={() => onSubSectionChange('organization', sectionName)}
          />

          <NavigationCard
            icon={MdSync}
            title="Bookmark Sync"
            subtitle="Import and sync browser bookmarks"
            onClick={() => onSubSectionChange('sync', sectionName)}
          />
        </>
      )}

      {currentSubSection === 'appearance' && (
        <PreferencesWrapper
          setting="quicklinksenabled"
          category="quicklinks"
          visibilityToggle={false}
          zoomSetting="zoomQuicklinks"
        >
          <AppearanceSection />
        </PreferencesWrapper>
      )}

      {currentSubSection === 'display' && (
        <PreferencesWrapper
          setting="quicklinksenabled"
          category="quicklinks"
          visibilityToggle={false}
        >
          <DisplaySection />
        </PreferencesWrapper>
      )}

      {currentSubSection === 'organization' && (
        <PreferencesWrapper
          setting="quicklinksenabled"
          category="quicklinks"
          visibilityToggle={false}
        >
          <OrganizationSection />
        </PreferencesWrapper>
      )}

      {currentSubSection === 'sync' && (
        <PreferencesWrapper
          setting="quicklinksenabled"
          category="quicklinks"
          visibilityToggle={false}
        >
          <SyncSection />
        </PreferencesWrapper>
      )}

      {!currentSubSection && (
        <>
          <PreferencesWrapper
            setting="quicklinksenabled"
            category="quicklinks"
            visibilityToggle={true}
          >
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
        </>
      )}

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
          addLink={(name, url, icon, iconType, iconData) =>
            addLink(name, url, icon, iconType, iconData)
          }
          editLink={(og, name, url, icon, iconType, iconData) =>
            editLink(og, name, url, icon, iconType, iconData)
          }
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
