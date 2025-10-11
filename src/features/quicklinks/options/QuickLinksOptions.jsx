import variables from 'config/variables';
import { PureComponent, createRef } from 'react';
import { MdAddLink, MdLinkOff, MdOutlineDragIndicator, MdEdit, MdDelete } from 'react-icons/md';
import { sortableContainer, sortableElement } from '@muetab/react-sortable-hoc';
import { Header, Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { Checkbox, Dropdown } from 'components/Form/Settings';
import { Button } from 'components/Elements';
import Modal from 'react-modal';

import { AddModal } from 'components/Elements/AddModal';

import EventBus from 'utils/eventbus';
import { getTitleFromUrl, isValidUrl } from 'utils/links';

// Drag handle shown only when enabled
const DragHandle = () => (
  <div className="quicklink-drag-handle" aria-hidden="true">
    <MdOutlineDragIndicator />
  </div>
);

const SortableItem = sortableElement(({ value, enabled, startEditLink, deleteLink }) => {
  const getIconUrl = (item) => {
    return item.icon || 'https://icon.horse/icon/' + item.url.replace('https://', '').replace('http://', '');
  };

  return (
    <div className={`quicklink-item ${!enabled ? 'disabled' : ''}`} role="listitem" aria-disabled={!enabled}>
      <DragHandle />
      <div className="quicklink-icon">
        <img src={getIconUrl(value)} alt={value.name} draggable={false} />
      </div>
      <div className="quicklink-content">
        <div className="quicklink-name">{value.name}</div>
        <div className="quicklink-url">{value.url}</div>
      </div>
      <div className="quicklink-actions">
        <button
          className="quicklink-action-btn"
          onClick={(e) => {
            if (!enabled) return;
            e.stopPropagation();
            startEditLink(value);
          }}
          title="Edit"
          disabled={!enabled}
          aria-disabled={!enabled}
        >
          <MdEdit />
          <span>Edit</span>
        </button>
        <button
          className="quicklink-action-btn quicklink-remove-btn"
          onClick={(e) => {
            if (!enabled) return;
            e.stopPropagation();
            deleteLink(value.key, e);
          }}
          title="Remove"
          disabled={!enabled}
          aria-disabled={!enabled}
        >
          <MdDelete />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
});

const SortableContainer = sortableContainer(({ children }) => (
  <div className="quicklinks-list" role="list">{children}</div>
));

class QuickLinksOptions extends PureComponent {
  constructor() {
    super();
    this.state = {
      items: JSON.parse(localStorage.getItem('quicklinks')) || [],
      showAddModal: false,
      urlError: '',
      iconError: '',
      edit: false,
      editData: '',
      enabled: localStorage.getItem('quicklinksenabled') !== 'false',
    };
    this.quicklinksContainer = createRef();
  }

  setContainerDisplay(enabled) {
  if (!this.quicklinksContainer || !this.quicklinksContainer.current) return;
  const el = this.quicklinksContainer.current;
  el.classList.toggle('disabled', !enabled);
  if (!enabled) {
    el.setAttribute('aria-hidden', 'true');
  } else {
    el.removeAttribute('aria-hidden');
  }
}
  deleteLink(key, event) {
    event.preventDefault();

    const stored = JSON.parse(localStorage.getItem('quicklinks')) || [];
    const data = stored.filter((i) => i.key !== key);

    localStorage.setItem('quicklinks', JSON.stringify(data));
    this.setState({ items: data });

    variables.stats.postEvent('feature', 'Quicklink delete');

    EventBus.emit('refresh', 'quicklinks');
  }

  async addLink(name, url, icon) {
    const data = JSON.parse(localStorage.getItem('quicklinks')) || [];

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (url.length <= 0 || isValidUrl(url) === false) {
      return this.setState({ urlError: variables.getMessage('widgets.quicklinks.url_error') });
    }

    if (icon.length > 0 && isValidUrl(icon) === false) {
      return this.setState({ iconError: variables.getMessage('widgets.quicklinks.url_error') });
    }

    data.push({
      name: name || (await getTitleFromUrl(url)),
      url,
      icon: icon || '',
      key: Math.random().toString(36).substring(7) + 1,
    });

    localStorage.setItem('quicklinks', JSON.stringify(data));

    this.setState({ items: data, showAddModal: false, urlError: '', iconError: '' });

    variables.stats.postEvent('feature', 'Quicklink add');

    EventBus.emit('refresh', 'quicklinks');
  }

  startEditLink(data) {
    this.setState({ edit: true, editData: data, showAddModal: true });
  }

  async editLink(og, name, url, icon) {
    const data = JSON.parse(localStorage.getItem('quicklinks')) || [];
    const dataobj = data.find((i) => i.key === og.key);
    if (!dataobj) return;
    dataobj.name = name || (await getTitleFromUrl(url));
    dataobj.url = url;
    dataobj.icon = icon || '';

    localStorage.setItem('quicklinks', JSON.stringify(data));

    this.setState({ items: data, showAddModal: false, edit: false });

    EventBus.emit('refresh', 'quicklinks');
  }

  arrayMove = (array, oldIndex, newIndex) => {
    const result = Array.from(array);
    const [removed] = result.splice(oldIndex, 1);
    result.splice(newIndex, 0, removed);
    return result;
  };

onSortStart = () => {
  if (this.quicklinksContainer && this.quicklinksContainer.current) {
    this.quicklinksContainer.current.classList.add('dragging');
    setTimeout(() => {
      if (this.quicklinksContainer && this.quicklinksContainer.current) {
        this.quicklinksContainer.current.classList.add('dragging-active');
      }
    }, 10);
  }
};

onSortEnd = ({ oldIndex, newIndex }) => {
  if (!this.state.enabled) {
    // ensure we always remove dragging class if disabled mid-drag
    if (this.quicklinksContainer && this.quicklinksContainer.current) {
      this.quicklinksContainer.current.classList.remove('dragging');
    }
    return;
  }
  if (oldIndex === newIndex) {
    // remove dragging class and exit early
    if (this.quicklinksContainer && this.quicklinksContainer.current) {
      this.quicklinksContainer.current.classList.remove('dragging');
    }
    return;
  }

  const newItems = this.arrayMove(this.state.items, oldIndex, newIndex);
  localStorage.setItem('quicklinks', JSON.stringify(newItems));
  this.setState({ items: newItems });

  variables.stats.postEvent('feature', 'Quicklink reorder');

  if (this.quicklinksContainer && this.quicklinksContainer.current) {
    this.quicklinksContainer.current.classList.remove('dragging');
  }

  setTimeout(() => {
    EventBus.emit('refresh', 'quicklinks');
  }, 120);
};

  componentDidMount() {
    this.setContainerDisplay(this.state.enabled);
    this.setState({ items: JSON.parse(localStorage.getItem('quicklinks')) || [] });

    EventBus.on('refresh', (data) => {
      if (data === 'quicklinks') {
        const enabled = localStorage.getItem('quicklinksenabled') !== 'false';
        this.setContainerDisplay(enabled);
        this.setState({ items: JSON.parse(localStorage.getItem('quicklinks')) || [], enabled });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.enabled !== this.state.enabled) {
      this.setContainerDisplay(this.state.enabled);
    }
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    const QUICKLINKS_SECTION = 'modals.main.settings.sections.quicklinks';
    const { enabled } = this.state;

    const AdditionalSettings = () => (
      <Row>
        <Content
          title={variables.getMessage('modals.main.settings.additional_settings')}
          subtitle={variables.getMessage(`${QUICKLINKS_SECTION}.additional`)}
        />
        <Action>
          <Checkbox name="quicklinksnewtab" text={variables.getMessage(`${QUICKLINKS_SECTION}.open_new`)} category="quicklinks" />
          <Checkbox name="quicklinkstooltip" text={variables.getMessage(`${QUICKLINKS_SECTION}.tooltip`)} category="quicklinks" />
        </Action>
      </Row>
    );

    const StylingOptions = () => (
      <Row>
        <Content
          title={variables.getMessage(`${QUICKLINKS_SECTION}.styling`)}
          subtitle={variables.getMessage('modals.main.settings.sections.quicklinks.styling_description')}
        />
        <Action>
          <Dropdown
            label={variables.getMessage(`${QUICKLINKS_SECTION}.style`)}
            name="quickLinksStyle"
            category="quicklinks"
            items={[
              { value: 'icon', text: variables.getMessage(`${QUICKLINKS_SECTION}.options.icon`) },
              { value: 'text_only', text: variables.getMessage(`${QUICKLINKS_SECTION}.options.text_only`) },
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
            onClick={() => enabled && this.setState({ showAddModal: true })}
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

          {this.state.items.length === 0 && (
            <div className="photosEmpty">
              <div className="emptyNewMessage">
                <MdLinkOff />
                <span className="title">{variables.getMessage(`${QUICKLINKS_SECTION}.no_quicklinks`)}</span>
                <span className="subtitle">{variables.getMessage('modals.main.settings.sections.message.add_some')}</span>
                <Button type="settings" onClick={() => this.setState({ showAddModal: true })} icon={<MdAddLink />} label={variables.getMessage(`${QUICKLINKS_SECTION}.add_link`)} />
              </div>
            </div>
          )}
        </PreferencesWrapper>
        <div
          className={`quicklinks-container ${!enabled ? 'disabled' : ''}`}
          ref={this.quicklinksContainer}
          aria-hidden={!enabled}
        >
          <div className={`messagesContainer ${!enabled ? 'disabled' : ''}`}>
            <SortableContainer
              onSortStart={this.onSortStart}
              onSortEnd={this.onSortEnd}
              lockAxis="y"
              lockToContainerEdges
              disableAutoscroll
              helperClass="sortable-helper"
              distance={6}
              disabled={!enabled}
            >
              {this.state.items.map((item, index) => (
                <SortableItem
                  key={`item-${item.key}`}
                  index={index}
                  value={item}
                  enabled={enabled}
                  startEditLink={(data) => this.startEditLink(data)}
                  deleteLink={(key, e) => this.deleteLink(key, e)}
                />
              ))}
            </SortableContainer>
          </div>
        </div>

        <Modal
          closeTimeoutMS={100}
          onRequestClose={() => this.setState({ showAddModal: false, urlError: '', iconError: '' })}
          isOpen={this.state.showAddModal}
          className="Modal resetmodal mainModal"
          overlayClassName="Overlay resetoverlay"
          ariaHideApp={false}
        >
          <AddModal
            urlError={this.state.urlError}
            addLink={(name, url, icon) => this.addLink(name, url, icon)}
            editLink={(og, name, url, icon) => this.editLink(og, name, url, icon)}
            edit={this.state.edit}
            editData={this.state.editData}
            closeModal={() => this.setState({ showAddModal: false, urlError: '', iconError: '', edit: false })}
          />
        </Modal>
      </>
    );
  }
}

export { QuickLinksOptions as default, QuickLinksOptions };