import variables from 'modules/variables';
import { PureComponent, createRef } from 'react';
import { TextareaAutosize } from '@mui/material';
import { MdAddToPhotos } from 'react-icons/md';

import Tooltip from 'components/helpers/tooltip/Tooltip';

import EventBus from 'modules/helpers/eventbus';

import './quicklinks.scss';

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
      showAddLink: this.state.showAddLink === 'none' ? 'flex' : 'none',
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
        img.style.height = `${30 * Number(zoom / 100)}px`;
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

    const quickLink = (item) => {
      if (localStorage.getItem('quickLinksStyle') === 'text') {
        return (
          <a
            className="quicklinkstext"
            key={item.key}
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

      if (localStorage.getItem('quickLinksStyle') === 'metro') {
        return (
          <a
          className="quickLinksMetro"
          key={item.key}
          href={item.url}
          target={target}
          rel={rel}
          draggable={false}
        >
              <img src={img} alt={item.name} draggable={false} />
              <span className="subtitle">{item.name}</span>
          </a>
        );
      }

      const link = (
        <a
          key={item.key}
          href={item.url}
          target={target}
          rel={rel}
          draggable={false}
        >
          <img src={img} alt={item.name} draggable={false} />
        </a>
      );

      return tooltipEnabled === 'true' ? (
        <Tooltip title={item.name} placement="bottom">
          {link}
        </Tooltip>
      ) : (
        link
      );
    };

    return (
      <>
        <div className="quicklinkscontainer" ref={this.quicklinksContainer}>
          {this.state.items.map((item) => quickLink(item))}
        </div>
        <div className="quicklinkscontainer">
          <div
            className="quicklinksdropdown"
            onKeyDown={this.topbarEnter}
            style={{ display: this.state.showAddLink }}
          >
            <span className="dropdown-title">{variables.getMessage('widgets.quicklinks.new')}</span>
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
              <MdAddToPhotos /> {variables.getMessage('widgets.quicklinks.add')}
            </button>
          </div>
        </div>
      </>
    );
  }
}
