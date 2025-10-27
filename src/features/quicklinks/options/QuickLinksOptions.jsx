import variables from 'config/variables';
import { PureComponent, createRef } from 'react';
import { MdAddLink, MdLinkOff, MdOutlineDragIndicator, MdEdit, MdDelete } from 'react-icons/md';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Header, Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { Checkbox, Dropdown } from 'components/Form/Settings';
import { Button } from 'components/Elements';
import Modal from 'react-modal';

import { AddModal } from 'components/Elements/AddModal';

import EventBus from 'utils/eventbus';
import { getTitleFromUrl, isValidUrl } from 'utils/links';

const readQuicklinks = () => {
  try {
    const raw = localStorage.getItem('quicklinks');
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Failed to parse quicklinks from localStorage. Resetting to []', e);
    return [];
  }
};

const DragHandle = () => (
  <div className="quicklink-drag-handle" aria-hidden="true">
    <MdOutlineDragIndicator />
  </div>
);

const SortableItem = ({ value, enabled, startEditLink, deleteLink }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: value.key,
    disabled: !enabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getIconUrl = (item) => {
    return item.icon || 'https://icon.horse/icon/' + item.url.replace('https://', '').replace('http://', '');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`quicklink-item ${!enabled ? 'disabled' : ''}`}
      role="listitem"
    >
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
};

const SortableList = ({ items, enabled, onDragEnd, startEditLink, deleteLink }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((item) => item.key)} strategy={verticalListSortingStrategy}>
        <div className="quicklinks-list" role="list">
          {items.map((item) => (
            <SortableItem
              key={item.key}
              value={item}
              enabled={enabled}
              startEditLink={startEditLink}
              deleteLink={deleteLink}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

class QuickLinksOptions extends PureComponent {
  constructor() {
    super();
    this.state = {
      items: readQuicklinks(),
      showAddModal: false,
      urlError: '',
      iconError: '',
      edit: false,
      editData: '',
      enabled: localStorage.getItem('quicklinksenabled') !== 'false',
    };
    this.quicklinksContainer = createRef();
    this.silenceEvent = false;
    this.handleRefresh = null;
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

  const stored = readQuicklinks();
  const data = stored.filter((i) => i.key !== key);
  this.silenceEvent = true;
  localStorage.setItem('quicklinks', JSON.stringify(data));
  this.setState({ items: data }, () => {
    variables.stats.postEvent('feature', 'Quicklink delete');
    EventBus.emit('refresh', 'quicklinks');
    setTimeout(() => { this.silenceEvent = false; }, 0);
  });
}


  async addLink(name, url, icon) {
  const data = readQuicklinks();

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  if (url.length <= 0 || isValidUrl(url) === false) {
    return this.setState({ urlError: variables.getMessage('widgets.quicklinks.url_error') });
  }

  if (icon.length > 0 && isValidUrl(icon) === false) {
    return this.setState({ iconError: variables.getMessage('widgets.quicklinks.url_error') });
  }

  const newItem = {
    name: name || (await getTitleFromUrl(url)),
    url,
    icon: icon || '',
    key: Date.now().toString() + Math.random().toString(36).substring(2),
  };

  data.push(newItem);

  this.silenceEvent = true;
  localStorage.setItem('quicklinks', JSON.stringify(data));
  this.setState({ items: data, showAddModal: false, urlError: '', iconError: '' }, () => {
    variables.stats.postEvent('feature', 'Quicklink add');
    EventBus.emit('refresh', 'quicklinks');
    setTimeout(() => { this.silenceEvent = false; }, 0);
  });
}


  startEditLink(data) {
    this.setState({ edit: true, editData: data, showAddModal: true });
  }

  async editLink(og, name, url, icon) {
  const data = readQuicklinks();
  const dataobj = data.find((i) => i.key === og.key);
  if (!dataobj) return;

  dataobj.name = name || (await getTitleFromUrl(url));
  dataobj.url = url;
  dataobj.icon = icon || '';

  this.silenceEvent = true;
  localStorage.setItem('quicklinks', JSON.stringify(data));
  this.setState({ items: data, showAddModal: false, edit: false }, () => {
    EventBus.emit('refresh', 'quicklinks');
    setTimeout(() => { this.silenceEvent = false; }, 0);
  });
}


  arrayMove = (array, oldIndex, newIndex) => {
    const result = Array.from(array);
    const [removed] = result.splice(oldIndex, 1);
    result.splice(newIndex, 0, removed);
    return result;
  };

  handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || !this.state.enabled) return;
    if (active.id === over.id) return;

    const oldIndex = this.state.items.findIndex((item) => item.key === active.id);
    const newIndex = this.state.items.findIndex((item) => item.key === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(this.state.items, oldIndex, newIndex);

    this.silenceEvent = true;
    this.setState({ items: newItems }, () => {
      localStorage.setItem('quicklinks', JSON.stringify(newItems));
      EventBus.emit('refresh', 'quicklinks');
      setTimeout(() => {
        this.silenceEvent = false;
      }, 0);
    });
  };


  componentDidMount() {
  this.setContainerDisplay(this.state.enabled);

  this.handleRefresh = (data) => {
    if (data !== 'quicklinks') return;
    if (this.silenceEvent) return;

    const enabled = localStorage.getItem('quicklinksenabled') !== 'false';
    const newItems = readQuicklinks();
    const oldItems = this.state.items || [];
    const oldKeys = new Set(oldItems.map(i => i.key));
    const newKeys = new Set(newItems.map(i => i.key));

    const keysEqual =
      oldItems.length === newItems.length &&
      oldItems.every(i => newKeys.has(i.key));

    if (enabled !== this.state.enabled || !keysEqual) {
      this.setContainerDisplay(enabled);
      this.setState({ items: newItems, enabled });
    }
  };

  EventBus.on('refresh', this.handleRefresh);
}


  componentDidUpdate(prevProps, prevState) {
  if (prevState.enabled !== this.state.enabled) {
    this.setContainerDisplay(this.state.enabled);
  }
}

 componentWillUnmount() {
  if (this.handleRefresh) {
    EventBus.off('refresh', this.handleRefresh);
  } else {
    try {
      EventBus.off('refresh');
    } catch {
      // Ignore errors
    }
  }
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
            <SortableList
              items={this.state.items}
              enabled={enabled}
              onDragEnd={this.handleDragEnd}
              startEditLink={(data) => this.startEditLink(data)}
              deleteLink={(key, e) => this.deleteLink(key, e)}
            />
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