import React from 'react';

import EventBus from '../../../modules/helpers/eventbus';

import Tooltip from '../../helpers/tooltip/Tooltip';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import './quicklinks.scss';

export default class QuickLinks extends React.PureComponent {
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
    this.language = window.language.widgets.quicklinks;
  }

  deleteLink(key, event) {
    event.preventDefault();

    let data = JSON.parse(localStorage.getItem('quicklinks'));
    data = data.filter((i) => i.key !== key);

    localStorage.setItem('quicklinks', JSON.stringify(data));
    this.setState({
      items: data
    });

    window.stats.postEvent('feature', 'Quicklink delete');
  }

  addLink = () => {
    let data = JSON.parse(localStorage.getItem('quicklinks'));
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
        nameError: nameError,
        urlError: urlError
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
  }

  toggleAdd = () => {
    if (this.state.showAddLink === 'hidden') {
      this.setState({
        showAddLink: 'visible'
      });
    } else {
      this.setState({
        showAddLink: 'hidden'
      });
    }
  }

  componentDidMount() {
    EventBus.on('refresh', (data) => {
      if (data === 'quicklinks') {
        const element = document.querySelector('.quicklinks-container');

        if (localStorage.getItem('quicklinksenabled') === 'false') {
          return element.style.display = 'none';
        }

        element.style.display = 'block';
        this.setState({
          items: JSON.parse(localStorage.getItem('quicklinks'))
        });
      }
    });

    // allows you to add a link by pressing enter
    document.querySelector('.topbarquicklinks').onkeydown = (e) => {
      e = e || window.event;
      const code = e.which || e.keyCode;
      if (code === 13 && this.state.showAddLink === 'visible') {
        this.addLink();
        e.preventDefault();
      }
    };
  }

  render() {
    let target, rel = null;
    if (localStorage.getItem('quicklinksnewtab') === 'true') {
      target = '_blank';
      rel = 'noopener noreferrer';
    }

    const tooltipEnabled = localStorage.getItem('quicklinkstooltip');

    const quickLink = (item) => {
      const useProxy = (localStorage.getItem('quicklinksddgProxy') !== 'false');
      const url = useProxy ? 'https://icons.duckduckgo.com/ip2/' : 'https://www.google.com/s2/favicons?sz=32&domain=';

      const link = (
        <a key={item.key} onContextMenu={(e) => this.deleteLink(item.key, e)} href={item.url} target={target} rel={rel} draggable={false}>
          <img src={url + item.url.replace('https://', '').replace('http://', '') + (useProxy ? '.ico' : '')} alt={item.name} draggable={false}/>
        </a>
      );

      if (tooltipEnabled === 'true') {
        return <Tooltip title={item.name} key={item.name} draggable={false}>{link}</Tooltip>;
      } else {
        return link;
      }
    };

    return (
      <div className='quicklinks-container'>
        {this.state.items.map((item) => (
          quickLink(item)
        ))}
        <button className='quicklinks' onClick={this.toggleAdd}>+</button>
        <span className='quicklinkscontainer' style={{ 'visibility': this.state.showAddLink }}>
          <div className='topbarquicklinks'>
            <h4>{this.language.new}</h4>
            <TextareaAutosize rowsMax={1} placeholder={this.language.name} value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
            <p>{this.state.nameError}</p>
            <TextareaAutosize rowsMax={10} placeholder={this.language.url} value={this.state.url} onChange={(e) => this.setState({ url: e.target.value })} />
            <p>{this.state.urlError}</p>
            <button className='pinNote' onClick={this.addLink}>{this.language.add}</button>
          </div>
        </span>
      </div>
    );
  }
}