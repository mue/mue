import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import { MdAddLink, MdLinkOff, MdCancel, MdEdit } from 'react-icons/md';
import Header from '../Header';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Modal from 'react-modal';

import SettingsItem from '../SettingsItem';
import AddModal from './quicklinks/AddModal';

import EventBus from 'modules/helpers/eventbus';

export default class QuickLinks extends PureComponent {
  constructor() {
    super();
    this.state = {
      items: JSON.parse(localStorage.getItem('quicklinks')),
      showAddModal: false,
      urlError: '',
      iconError: '',
      edit: false,
      editData: '',
    };
    this.quicklinksContainer = createRef();
  }

  deleteLink(key, event) {
    event.preventDefault();

    // remove link from array
    const data = JSON.parse(localStorage.getItem('quicklinks')).filter((i) => i.key !== key);

    localStorage.setItem('quicklinks', JSON.stringify(data));
    this.setState({
      items: data,
    });

    variables.stats.postEvent('feature', 'Quicklink delete');
  }

  addLink(name, url, icon) {
    const data = JSON.parse(localStorage.getItem('quicklinks'));

    // regex: https://ihateregex.io/expr/url/
    // eslint-disable-next-line no-useless-escape
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_.~#?&=]*)/;
    if (url.length <= 0 || urlRegex.test(url) === false) {
      return this.setState({
        urlError: variables.getMessage('widgets.quicklinks.url_error'),
      });
    }

    if (icon.length > 0 && urlRegex.test(icon) === false) {
      return this.setState({
        iconError: variables.getMessage('widgets.quicklinks.url_error'),
      });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }

    data.push({
      name: name || url,
      url,
      icon: icon || '',
      key: Math.random().toString(36).substring(7) + 1,
    });

    localStorage.setItem('quicklinks', JSON.stringify(data));

    this.setState({
      items: data,
      showAddModal: false,
      urlError: '',
      iconError: '',
    });

    variables.stats.postEvent('feature', 'Quicklink add');
  }

  startEditLink(data) {
    this.setState({
      edit: true,
      editData: data,
      showAddModal: true,
    });
  }

  editLink(og, name, url, icon) {
    const data = JSON.parse(localStorage.getItem('quicklinks'));
    const dataobj = data.find((i) => i.key === og.key);
    dataobj.name = name || url;
    dataobj.url = url;
    dataobj.icon = icon || '';

    localStorage.setItem('quicklinks', JSON.stringify(data));

    this.setState({
      items: data,
      showAddModal: false,
      edit: false,
    });
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'quicklinks') {
        if (localStorage.getItem('quicklinksenabled') === 'false') {
          return (this.quicklinksContainer.current.style.display = 'none');
        }

        this.quicklinksContainer.current.style.display = 'block';

        this.setState({
          items: JSON.parse(localStorage.getItem('quicklinks')),
        });
      }
    });
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    let target,
      rel = null;
    if (localStorage.getItem('quicklinksnewtab') === 'true') {
      target = '_blank';
      rel = 'noopener noreferrer';
    }

    const useText = localStorage.getItem('quicklinksText') === 'true';

    const quickLink = (item) => {
      if (useText) {
        return (
          <a
            className="quicklinkstext"
            key={item.key}
            onContextMenu={(e) => this.deleteLink(item.key, e)}
            href={item.url}
            target={target}
            rel={rel}
            draggable={false}
          >
            {item.name}
          </a>
        );
      }

      const img =
        item.icon ||
        'https://icon.horse/icon/ ' + item.url.replace('https://', '').replace('http://', '');

      const link = (
        <div className="messageMap" key={item.key}>
          <div className="icon">
            <img
              src={img}
              alt={item.name}
              draggable={false}
              style={{ height: '30px', width: '30px' }}
            />
          </div>
          <div className="messageText">
            <div className="title">{item.name}</div>
            <div className="subtitle">
              <a
                className="quicklinknostyle"
                target="_blank"
                rel="noopener noreferrer"
                href={item.url}
              >
                {item.url}
              </a>
            </div>
          </div>
          <div>
            <div className="messageAction">
              <button className="deleteButton" onClick={() => this.startEditLink(item)}>
                {variables.getMessage('modals.main.settings.sections.quicklinks.edit')}
                <MdEdit />
              </button>
              <button className="deleteButton" onClick={(e) => this.deleteLink(item.key, e)}>
                {variables.getMessage('modals.main.marketplace.product.buttons.remove')}
                <MdCancel />
              </button>
            </div>
          </div>
        </div>
      );

      return link;
    };

    return (
      <>
        <Header
          title={variables.getMessage('modals.main.settings.sections.quicklinks.title')}
          setting="quicklinksenabled"
          category="quicklinks"
          element=".quicklinks-container"
          zoomSetting="zoomQuicklinks"
          switch={true}
        />
        <SettingsItem
          title={variables.getMessage('modals.main.settings.additional_settings')}
          subtitle={variables.getMessage('modals.main.settings.sections.quicklinks.additional')}
        >
          <Checkbox
            name="quicklinksnewtab"
            text={variables.getMessage('modals.main.settings.sections.quicklinks.open_new')}
            category="quicklinks"
          />
          <Checkbox
            name="quicklinkstooltip"
            text={variables.getMessage('modals.main.settings.sections.quicklinks.tooltip')}
            category="quicklinks"
          />
        </SettingsItem>
        <SettingsItem
          title={variables.getMessage('modals.main.settings.sections.quicklinks.styling')}
          description={variables.getMessage(
            'modals.main.settings.sections.quicklinks.styling_description',
          )}
        >
          <Dropdown
            label={variables.getMessage('modals.main.settings.sections.quicklinks.style')}
            name="quickLinksStyle"
            category="quicklinks"
          >
            <option value="icon">
              {variables.getMessage('modals.main.settings.sections.quicklinks.options.icon')}
            </option>
            <option value="text">
              {variables.getMessage('modals.main.settings.sections.quicklinks.options.text_only')}
            </option>
            <option value="metro">
              {variables.getMessage('modals.main.settings.sections.quicklinks.options.metro')}
            </option>
          </Dropdown>
        </SettingsItem>

        <SettingsItem
          title={variables.getMessage('modals.main.settings.sections.quicklinks.title')}
          final={true}
        >
          <button onClick={() => this.setState({ showAddModal: true })}>
            {variables.getMessage('modals.main.settings.sections.quicklinks.add_link')}{' '}
            <MdAddLink />
          </button>
        </SettingsItem>

        {this.state.items.length === 0 ? (
          <div className="photosEmpty">
            <div className="emptyNewMessage">
              <MdLinkOff />
              <span className="title">
                {variables.getMessage('modals.main.settings.sections.quicklinks.no_quicklinks')}
              </span>
              <span className="subtitle">
                {variables.getMessage('modals.main.settings.sections.message.add_some')}
              </span>
              <button onClick={() => this.setState({ showAddModal: true })}>
                {variables.getMessage('modals.main.settings.sections.quicklinks.add_link')}
                <MdAddLink />
              </button>
            </div>
          </div>
        ) : null}

        <div className="messagesContainer" ref={this.quicklinksContainer}>
          {this.state.items.map((item) => quickLink(item))}
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
            closeModal={() => this.setState({ showAddModal: false, urlError: '', iconError: '' })}
          />
        </Modal>
      </>
    );
  }
}
