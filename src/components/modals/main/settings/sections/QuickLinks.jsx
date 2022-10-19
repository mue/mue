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
      edit: false,
      editData: ''
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
    let urlError;

    // regex: https://ihateregex.io/expr/url/
    // eslint-disable-next-line no-useless-escape
    if (
      url.length <= 0 ||
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_.~#?&=]*)/.test(
        url,
      ) === false
    ) {
      urlError = variables.getMessage('widgets.quicklinks.url_error');
    }

    if (urlError) {
      return this.setState({
        urlError,
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
      urlError: ''
    });

    variables.stats.postEvent('feature', 'Quicklink add');
  };

  startEditLink(data) {
    this.setState({
      edit: true,
      editData: data,
      showAddModal: true
    });
  }

  editLink(og, name, url, icon) {
    const data = JSON.parse(localStorage.getItem('quicklinks'));
    const dataobj = data.find(i => i.key === og.key);
    dataobj.name = name || url;
    dataobj.url = url;
    dataobj.icon = icon || '';

    localStorage.setItem('quicklinks', JSON.stringify(data));

    this.setState({
      items: data,
      showAddModal: false,
      edit: false
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

    const useProxy = localStorage.getItem('quicklinksddgProxy') !== 'false';
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

      const url = useProxy
        ? 'https://icons.duckduckgo.com/ip2/'
        : 'https://www.google.com/s2/favicons?sz=32&domain=';
      const img =
        item.icon ||
        url + item.url.replace('https://', '').replace('http://', '') + (useProxy ? '.ico' : '');

      const link = (
        <div className="messageMap">
          <div className="icon">
            <img src={img} alt={item.name} draggable={false} style={{ height: '30px', width: '30px'}} />
          </div>
          <div className="messageText">
            <div className="title">{item.name}</div>
            <div className="subtitle">{item.url}</div>
          </div>
          <div>
            <div className="messageAction">
              <button className="deleteButton" onClick={() => this.startEditLink(item)}>
                Edit
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
            name="quicklinksddgProxy"
            text={variables.getMessage('modals.main.settings.sections.background.ddg_image_proxy')}
            category="quicklinks"
          />
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
        <SettingsItem title="Quick Links Styling" description="Customise Quick Links Appearance.">
          <Dropdown label="Style" name="quickLinksStyle" category="other">
            <option value="icon">Icon</option>
            <option value="text">Text Only</option>
            <option value="metro">Metro</option>
          </Dropdown>
        </SettingsItem>

        <SettingsItem title="Quick Links" subtitle="" final={true}>
          <button onClick={() => this.setState({ showAddModal: true })}>
            Add Link <MdAddLink />
          </button>
        </SettingsItem>

        {this.state.items.length === 0 ? (
          <div className="photosEmpty">
            <div className="emptyNewMessage">
              <MdLinkOff />
              <span className="title">No quicklinks</span>
              <span className="subtitle">
                {variables.getMessage('modals.main.settings.sections.message.add_some')}
              </span>
              <button onClick={() => this.setState({ showAddModal: true })}>
                Add Link
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
          onRequestClose={() => this.setState({ showAddModal: false, urlError: '' })}
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
            closeModal={() => this.setState({ showAddModal: false, urlError: '' })}
          />
        </Modal>
      </>
    );
  }
}
