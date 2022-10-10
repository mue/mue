import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import { TextareaAutosize } from '@mui/material';
import { MdAddLink, MdLinkOff, MdClose, MdCancel, MdEdit } from 'react-icons/md';
import Header from '../Header';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import Modal from 'react-modal';

import SettingsItem from '../SettingsItem';

import Tooltip from 'components/helpers/tooltip/Tooltip';

import EventBus from 'modules/helpers/eventbus';

export default class QuickLinks extends PureComponent {
  constructor() {
    super();
    this.state = {
      items: JSON.parse(localStorage.getItem('quicklinks')),
      name: '',
      url: '',
      showAddLink: 'none',
      nameError: '',
      urlError: '',
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

  addLink = () => {
    const data = JSON.parse(localStorage.getItem('quicklinks'));
    let url = this.state.url;
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
      name: this.state.name || url,
      url,
      icon: this.state.icon || '',
      key: Math.random().toString(36).substring(7) + 1,
    });

    localStorage.setItem('quicklinks', JSON.stringify(data));

    this.setState({
      items: data,
      name: '',
      url: '',
    });

    variables.stats.postEvent('feature', 'Quicklink add');

    this.toggleAdd();

    // make sure image is correct size
    this.setZoom(this.quicklinksContainer.current);
  };

  toggleAdd = () => {
    this.setState({
      showAddModal: this.state.showAddLink === 'false' ? 'true' : 'false',
    });
  };

  // widget zoom
  setZoom(element) {
    const zoom = localStorage.getItem('zoomQuicklinks') || 100;
    if (localStorage.getItem('quicklinksText')) {
      for (const link of element.getElementsByTagName('a')) {
        link.style.fontSize = `${1.4 * Number(zoom / 100)}em`;
      }
    } else {
      for (const img of element.getElementsByTagName('img')) {
        img.style.height = `${1.4 * Number(zoom / 100)}em`;
      }
    }
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'quicklinks') {
        if (localStorage.getItem('quicklinksenabled') === 'false') {
          return (this.quicklinksContainer.current.style.display = 'none');
        }

        this.quicklinksContainer.current.style.display = 'block';
        this.setZoom(this.quicklinksContainer.current);

        this.setState({
          items: JSON.parse(localStorage.getItem('quicklinks')),
        });
      }
    });

    this.setZoom(this.quicklinksContainer.current);
  }

  // allows you to add a link by pressing enter
  topbarEnter = (e) => {
    e = e || window.event;
    const code = e.which || e.keyCode;
    if (code === 13 && this.state.showAddLink === 'visible') {
      this.addLink();
      e.preventDefault();
    }
  };

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

    const tooltipEnabled = localStorage.getItem('quicklinkstooltip');
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
            <img src={img} alt={item.name} draggable={false} />
          </div>
          <div className="messageText">
            <div className="title">{item.name}</div>
            <div className="subtitle">{item.url}</div>
          </div>
          <div>
            <div className="messageAction">
              <button className="deleteButton" onClick={() => this.modifyMessage('remove', index)}>
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
        <SettingsItem title="Quick Links' Styling" description="Customise Quick Links' Appearance.">
          <Dropdown label="Style" name="quickLinksStyle" category="other">
            <option value="icon">Icon</option>
            <option value="text">Text Only</option>
            <option value="metro">Metro</option>
          </Dropdown>
        </SettingsItem>

        <SettingsItem title="Quick Links" subtitle="" final={true}>
          <button onClick={this.toggleAdd}>
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
              <button onClick={this.toggleAdd}>
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
          onRequestClose={() => this.setState({ showAddModal: false })}
          isOpen={this.state.showAddModal}
          className="Modal resetmodal mainModal"
          overlayClassName="Overlay resetoverlay"
          ariaHideApp={false}
        >
          <div className="smallModal">
            <div className="shareHeader">
              <span className="title">{variables.getMessage('widgets.quicklinks.new')}</span>
              <Tooltip title={variables.getMessage('modals.welcome.buttons.close')}>
                <div className="close" onClick={() => this.setState({ showAddModal: false })}>
                  <MdClose />
                </div>
              </Tooltip>
            </div>
            <div className="quicklinkModalTextbox">
              <TextareaAutosize
                maxRows={1}
                placeholder={variables.getMessage('widgets.quicklinks.name')}
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
              <span className="dropdown-error" />
              <TextareaAutosize
                maxRows={10}
                placeholder={variables.getMessage('widgets.quicklinks.url')}
                value={this.state.url}
                onChange={(e) => this.setState({ url: e.target.value })}
              />
              <span className="dropdown-error">{this.state.urlError}</span>
              <TextareaAutosize
                maxRows={10}
                placeholder={variables.getMessage('widgets.quicklinks.icon')}
                value={this.state.icon}
                onChange={(e) => this.setState({ icon: e.target.value })}
              />
              <span className="dropdown-error" />
              <button onClick={this.addLink}>
                <MdAddLink /> {variables.getMessage('widgets.quicklinks.add')}
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}
