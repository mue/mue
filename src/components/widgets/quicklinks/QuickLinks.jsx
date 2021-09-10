import { PureComponent, createRef } from 'react';
import { TextareaAutosize } from '@mui/material';
import Hotkeys from 'react-hot-keys';

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
      showAddLink: 'hidden',
      nameError: '',
      urlError: ''
    };
    this.quicklinksContainer = createRef();
  }

  deleteLink(key, event) {
    event.preventDefault();

    // remove link from array
    const data = JSON.parse(localStorage.getItem('quicklinks')).filter((i) => i.key !== key);

    localStorage.setItem('quicklinks', JSON.stringify(data));
    this.setState({
      items: data
    });

    window.stats.postEvent('feature', 'Quicklink delete');
  }

  addLink = () => {
    const data = JSON.parse(localStorage.getItem('quicklinks'));
    let url = this.state.url;

    let nameError, urlError;
    if (this.state.name.length <= 0) {
      nameError = this.language.name_error;
    }

    // regex: https://ihateregex.io/expr/url/
    // eslint-disable-next-line no-useless-escape
    if (url.length <= 0 || /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/.test(url) === false) {
      urlError = this.language.url_error;
    }

    if (nameError || urlError) {
      return this.setState({
        nameError,
        urlError
      });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }

    data.push({
      name: this.state.name,
      url: url,
      key: Math.random().toString(36).substring(7) + 1
    });

    localStorage.setItem('quicklinks', JSON.stringify(data));

    this.setState({
      items: data,
      name: '',
      url: ''
    });

    window.stats.postEvent('feature', 'Quicklink add');

    this.toggleAdd();

    // make sure image is correct size
    this.setZoom(this.quicklinksContainer.current);
  }

  toggleAdd = () => {
    this.setState({
      showAddLink: (this.state.showAddLink === 'hidden') ? 'visible' : 'hidden'
    });
  }

  // widget zoom
  setZoom(element) {
    const images = element.getElementsByTagName('img');

    for (const img of images) {
      img.style.height = `${0.87 * Number((localStorage.getItem('zoomQuicklinks') || 100) / 100)}em`;
    }
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'quicklinks') {
        if (localStorage.getItem('quicklinksenabled') === 'false') {
          return this.quicklinksContainer.current.style.display = 'none';
        }

        this.quicklinksContainer.current.style.display = 'block';
        this.setZoom(this.quicklinksContainer.current);

        this.setState({
          items: JSON.parse(localStorage.getItem('quicklinks'))
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
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    let target, rel = null;
    if (localStorage.getItem('quicklinksnewtab') === 'true') {
      target = '_blank';
      rel = 'noopener noreferrer';
    }

    const tooltipEnabled = localStorage.getItem('quicklinkstooltip');
    const useProxy = (localStorage.getItem('quicklinksddgProxy') !== 'false');

    const quickLink = (item) => {
      const url = useProxy ? 'https://icons.duckduckgo.com/ip2/' : 'https://www.google.com/s2/favicons?sz=32&domain=';

      const link = (
        <a key={item.key} onContextMenu={(e) => this.deleteLink(item.key, e)} href={item.url} target={target} rel={rel} draggable={false}>
          <img src={url + item.url.replace('https://', '').replace('http://', '') + (useProxy ? '.ico' : '')} alt={item.name} draggable={false}/>
        </a>
      );

      if (tooltipEnabled === 'true') {
        return <Tooltip title={item.name}>{link}</Tooltip>;
      } else {
        return link;
      }
    };

    const marginTop = (this.state.items.length > 0) ? '9vh' : '4vh';

    return (
      <div className='quicklinks-container' ref={this.quicklinksContainer}>
        {this.state.items.map((item) => (
          quickLink(item)
        ))}
        <button className='quicklinks' onClick={this.toggleAdd}>+</button>
        <span className='quicklinkscontainer' style={{ visibility: this.state.showAddLink, marginTop }}>
          <div className='topbarquicklinks' onKeyDown={this.topbarEnter}>
            <h4>{this.language.new}</h4>
            <TextareaAutosize rowsmax={1} placeholder={this.language.name} value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
            <p>{this.state.nameError}</p>
            <TextareaAutosize rowsmax={10} placeholder={this.language.url} value={this.state.url} onChange={(e) => this.setState({ url: e.target.value })} />
            <p>{this.state.urlError}</p>
            <button className='pinNote' onClick={this.addLink}>{this.language.add}</button>
          </div>
        </span>
        {window.keybinds.toggleQuicklinks && window.keybinds.toggleQuicklinks !== '' ? <Hotkeys keyName={window.keybinds.toggleQuicklinks} onKeyDown={this.toggleAdd} /> : null}
      </div>
    );
  }
}
