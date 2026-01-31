import variables from 'config/variables';
import { useState } from 'react';
import Modal from 'react-modal';
import {
  MdUpload as ImportIcon,
  MdDownload as ExportIcon,
  MdRestartAlt as ResetIcon,
  MdDataUsage,
  MdError,
  MdCode,
  MdWidgets,
} from 'react-icons/md';

import '../customwidgets.scss';

import { exportSettings, importSettings } from 'utils/settings';
import { clearBackgroundQueues } from 'utils/queueOperations';

import { FileUpload, Text, Switch, Dropdown } from 'components/Form/Settings';
import { ResetModal, Button } from 'components/Elements';

import { Header, Section, Row, Content, Action } from 'components/Layout/Settings';

import time_zones from 'features/time/timezones.json';
import { AddWidgetModal, SortableWidgetList } from 'features/misc/components';
import { arrayMove } from '@dnd-kit/sortable';
import { isValidUrl } from 'utils/links';
import EventBus from 'utils/eventbus';

function AdvancedOptions({ currentSubSection, onSubSectionChange, sectionName }) {
  const [resetModal, setResetModal] = useState(false);
  const [widgets, setWidgets] = useState(
    JSON.parse(localStorage.getItem('customWidgets') || '[]')
  );
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const [widgetUrlError, setWidgetUrlError] = useState('');
  const [editWidget, setEditWidget] = useState(false);
  const [editWidgetData, setEditWidgetData] = useState('');
  const ADVANCED_SECTION = 'modals.main.settings.sections.advanced';

  const Data = () => {
    return localStorage.getItem('welcomePreview') !== 'true' ? (
      <Row final={true}>
        <Content
          title={variables.getMessage('modals.main.settings.sections.advanced.data')}
          subtitle={variables.getMessage('modals.main.settings.sections.advanced.data_description')}
        />
        <div className="resetDataButtonsLayout">
          <Button
            onClick={() => setResetModal(true)}
            icon={<ResetIcon />}
            label={variables.getMessage('modals.main.settings.buttons.reset')}
          />
          <Button
            onClick={() => exportSettings()}
            icon={<ExportIcon />}
            label={variables.getMessage('modals.main.settings.buttons.export')}
          />
          <Button
            onClick={() => document.getElementById('file-input').click()}
            icon={<ImportIcon />}
            label={variables.getMessage('modals.main.settings.buttons.import')}
          />
        </div>
        <FileUpload
          id="file-input"
          accept="application/json"
          type="settings"
          loadFunction={(e) => importSettings(e)}
        />
      </Row>
    ) : (
      <div className="emptyItems">
        <div className="emptyMessage">
          <div className="loaderHolder">
            <MdError />

            <span className="title">
              {variables.getMessage(
                'modals.main.settings.sections.advanced.preview_data_disabled.title',
              )}
            </span>
            <span className="subtitle">
              {variables.getMessage(
                'modals.main.settings.sections.advanced.preview_data_disabled.description',
              )}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const CustomCSS = () => {
    return (
      <Row final={true}>
        <Content
          title={variables.getMessage('modals.main.settings.sections.advanced.custom_css')}
          subtitle={variables.getMessage('modals.main.settings.sections.advanced.custom_css_subtitle')}
        />
        <Action>
          <Text name="customcss" textarea={true} category="other" customcss={true} />
        </Action>
      </Row>
    );
  };

  const generateUniqueId = (name) => {
    const baseName = (name || 'widget').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const existingIds = widgets.map((w) => w.id || '');

    let id = baseName;
    let counter = 1;

    while (existingIds.includes(id)) {
      id = `${baseName}-${counter}`;
      counter++;
    }

    return id;
  };

  const deleteWidget = (key, event) => {
    event.preventDefault();
    const data = widgets.filter((i) => i.key !== key);
    localStorage.setItem('customWidgets', JSON.stringify(data));
    setWidgets(data);
    EventBus.emit('refresh-widgets');
  };

  const addWidget = (name, url, position, renderAbove) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (url.length <= 0 || isValidUrl(url) === false) {
      setWidgetUrlError(variables.getMessage('widgets.quicklinks.url_error'));
      return;
    }

    const widgetName = name || 'Widget';
    const newItem = {
      name: widgetName,
      url,
      position: position || 'center',
      renderAbove: renderAbove || false,
      id: generateUniqueId(widgetName),
      key: Date.now().toString() + Math.random().toString(36).substring(2),
    };

    const data = [...widgets, newItem];
    localStorage.setItem('customWidgets', JSON.stringify(data));
    setWidgets(data);
    setShowAddWidgetModal(false);
    setWidgetUrlError('');
    EventBus.emit('refresh-widgets');
  };

  const startEditWidget = (data) => {
    setEditWidget(true);
    setEditWidgetData(data);
    setShowAddWidgetModal(true);
  };

  const updateWidget = (og, name, url, position, renderAbove) => {
    const widgetName = name || 'Widget';
    const data = widgets.map((item) => {
      if (item.key === og.key) {
        // Only regenerate ID if name changed
        const newId = item.name !== widgetName ? generateUniqueId(widgetName) : (item.id || generateUniqueId(widgetName));
        return {
          ...item,
          name: widgetName,
          url,
          position: position || 'center',
          renderAbove: renderAbove || false,
          id: newId,
        };
      }
      return item;
    });

    localStorage.setItem('customWidgets', JSON.stringify(data));
    setWidgets(data);
    setShowAddWidgetModal(false);
    setEditWidget(false);
    EventBus.emit('refresh-widgets');
  };

  const handleWidgetDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = widgets.findIndex((item) => item.key === active.id);
    const newIndex = widgets.findIndex((item) => item.key === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(widgets, oldIndex, newIndex);
    setWidgets(newItems);
    localStorage.setItem('customWidgets', JSON.stringify(newItems));
    EventBus.emit('refresh-widgets');
  };

  const CustomWidget = () => {
    return (
      <>
        <Row>
          <Content
            title={variables.getMessage('modals.main.settings.sections.advanced.custom_widget')}
            subtitle={variables.getMessage('modals.main.settings.sections.advanced.custom_widget_subtitle')}
          />
          <Action>
            <Button
              type="settings"
              onClick={() => setShowAddWidgetModal(true)}
              icon={<MdWidgets />}
              label={variables.getMessage('modals.main.settings.sections.advanced.custom_widget_add')}
            />
          </Action>
        </Row>
        {widgets.length === 0 ? (
          <div className="photosEmpty">
            <div className="emptyNewMessage">
              <MdWidgets />
              <span className="title">
                {variables.getMessage('modals.main.settings.sections.advanced.custom_widget_no_widgets')}
              </span>
              <span className="subtitle">
                {variables.getMessage('modals.main.settings.sections.advanced.custom_widget_add_some')}
              </span>
              <Button
                type="settings"
                onClick={() => setShowAddWidgetModal(true)}
                icon={<MdWidgets />}
                label={variables.getMessage('modals.main.settings.sections.advanced.custom_widget_add')}
              />
            </div>
          </div>
        ) : (
          <div className="widgets-container">
            <div className="messagesContainer">
              <SortableWidgetList
                items={widgets}
                onDragEnd={handleWidgetDragEnd}
                startEditWidget={(data) => startEditWidget(data)}
                deleteWidget={(key, e) => deleteWidget(key, e)}
              />
            </div>
          </div>
        )}
      </>
    );
  };

  const isDataSection = currentSubSection === 'data';
  const isCustomCSSSection = currentSubSection === 'customcss';
  const isCustomWidgetSection = currentSubSection === 'customwidget';

  let header;
  if (isDataSection) {
    header = (
      <Header
        title={variables.getMessage(`${ADVANCED_SECTION}.title`)}
        secondaryTitle={variables.getMessage(`${ADVANCED_SECTION}.data`)}
        goBack={() => onSubSectionChange(null, sectionName)}
        report={false}
      />
    );
  } else if (isCustomCSSSection) {
    header = (
      <Header
        title={variables.getMessage(`${ADVANCED_SECTION}.title`)}
        secondaryTitle={variables.getMessage(`${ADVANCED_SECTION}.custom_css`)}
        goBack={() => onSubSectionChange(null, sectionName)}
        report={false}
      />
    );
  } else if (isCustomWidgetSection) {
    header = (
      <Header
        title={variables.getMessage(`${ADVANCED_SECTION}.title`)}
        secondaryTitle={variables.getMessage(`${ADVANCED_SECTION}.custom_widget`)}
        goBack={() => onSubSectionChange(null, sectionName)}
        report={false}
      />
    );
  } else {
    header = <Header title={variables.getMessage(`${ADVANCED_SECTION}.title`)} report={false} />;
  }

  return (
    <>
      {header}
      {isDataSection ? (
        <>
          <Data />
          <Modal
            closeTimeoutMS={100}
            onRequestClose={() => setResetModal(false)}
            isOpen={resetModal}
            className="Modal resetmodal mainModal"
            overlayClassName="Overlay resetoverlay"
            ariaHideApp={false}
          >
            <ResetModal modalClose={() => setResetModal(false)} />
          </Modal>
        </>
      ) : isCustomCSSSection ? (
        <CustomCSS />
      ) : isCustomWidgetSection ? (
        <>
          <CustomWidget />
          <Modal
            closeTimeoutMS={100}
            onRequestClose={() => {
              setShowAddWidgetModal(false);
              setWidgetUrlError('');
            }}
            isOpen={showAddWidgetModal}
            className="Modal resetmodal mainModal"
            overlayClassName="Overlay resetoverlay"
            ariaHideApp={false}
          >
            <AddWidgetModal
              urlError={widgetUrlError}
              addWidget={(name, url) => addWidget(name, url)}
              editWidget={(og, name, url) => updateWidget(og, name, url)}
              edit={editWidget}
              editData={editWidgetData}
              closeModal={() => {
                setShowAddWidgetModal(false);
                setWidgetUrlError('');
                setEditWidget(false);
              }}
            />
          </Modal>
        </>
      ) : (
        <>
          <Section
            title={variables.getMessage(`${ADVANCED_SECTION}.data`)}
            subtitle={variables.getMessage(`${ADVANCED_SECTION}.data_subtitle`)}
            onClick={() => onSubSectionChange('data', sectionName)}
            icon={<MdDataUsage />}
          />
          <Section
            title={variables.getMessage(`${ADVANCED_SECTION}.custom_css`)}
            subtitle={variables.getMessage(`${ADVANCED_SECTION}.custom_css_subtitle`)}
            onClick={() => onSubSectionChange('customcss', sectionName)}
            icon={<MdCode />}
          />
          <Section
            title={variables.getMessage(`${ADVANCED_SECTION}.custom_widget`)}
            subtitle={variables.getMessage(`${ADVANCED_SECTION}.custom_widget_subtitle`)}
            onClick={() => onSubSectionChange('customwidget', sectionName)}
            icon={<MdWidgets />}
          />
          <Row>
            <Content
              title={variables.getMessage('modals.main.settings.sections.advanced.offline_mode')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.advanced.offline_subtitle',
              )}
            />
            <Action>
              <Switch name="offlineMode" element=".other" />
            </Action>
          </Row>

          <Row>
            <Content
              title={variables.getMessage('modals.main.settings.sections.advanced.marketplace_img_proxy')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.advanced.marketplace_img_proxy_subtitle',
              )}
            />
            <Action>
              <Switch
                name="marketplaceDDGProxy"
                element=".other"
                onChange={() => {
                  // Clear all prefetch queues when proxy setting changes
                  // so new images are fetched with correct proxy state
                  clearBackgroundQueues('all');
                }}
              />
            </Action>
          </Row>

          <Row>
            <Content
              title={variables.getMessage('modals.main.settings.sections.advanced.timezone.title')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.advanced.timezone.subtitle',
              )}
            />
            <Action>
              <Dropdown
                name="timezone"
                category="timezone"
                searchable={true}
                items={[
                  {
                    value: 'auto',
                    text: variables.getMessage(
                      'modals.main.settings.sections.advanced.timezone.automatic',
                    ),
                  },
                  ...time_zones.map((timezone) => ({ value: timezone, text: timezone })),
                ]}
              />
            </Action>
          </Row>
          <Row>
            <Content
              title={variables.getMessage('modals.main.settings.sections.advanced.tab_name')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.advanced.tab_name_subtitle',
              )}
            />
            <Action>
              <Text name="tabName" default={variables.getMessage('tabname')} category="other" />
            </Action>
          </Row>
          <Row final={true}>
            <Content
              title={variables.getMessage('modals.main.settings.sections.experimental.title')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.advanced.experimental_warning',
              )}
            />
            <Action>
              <Switch
                name="experimental"
                text={variables.getMessage('modals.main.settings.enabled')}
                element=".other"
              />
            </Action>
          </Row>
        </>
      )}
    </>
  );
}

export { AdvancedOptions as default, AdvancedOptions };
