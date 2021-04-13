import React from 'react';

import EventBus from '../../../modules/helpers/eventbus';

import Tooltip from '@material-ui/core/Tooltip';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import './quicklinks.scss';

export default class QuickLinks extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      items: JSON.parse(localStorage.getItem('quicklinks')),
      name: '',
      url: '',
      showAddLink: 'hidden'
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
  }

  addLink = () => {
    let data = JSON.parse(localStorage.getItem('quicklinks'));
    data.push({
      name: this.state.name,
      url: this.state.url,
      key: Math.random().toString(36).substring(7) + 1
    });

    localStorage.setItem('quicklinks', JSON.stringify(data));

    this.setState({
      items: data,
      name: '',
      url: ''
    });

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
  }

  render() {
    let target, rel = null;
    if (localStorage.getItem('quicklinksnewtab') === 'true') {
      target ='_blank';
      rel ='noopener noreferrer';
    }

    const tooltipEnabled = localStorage.getItem('quicklinkstooltip');

    const quickLink = (item) => {
      const link = (
        <a key={item.key} onContextMenu={(e) => this.deleteLink(item.key, e)} href={item.url} target={target} rel={rel} draggable={false}>
          <img src={'https://icons.duckduckgo.com/ip2/' + item.url.replace('https://', '').replace('http://', '') + '.ico'} alt={item.name} draggable={false}/>
        </a>
      );

      if (tooltipEnabled === 'true') {
        return <Tooltip title={item.name} key={item.name}>{link}</Tooltip>;
      } else {
        return link;
      }
    }

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
            <br/>
            <TextareaAutosize rowsMax={10} placeholder={this.language.url} value={this.state.url} onChange={(e) => this.setState({ url: e.target.value })} />
            <br/>
            <button className='pinNote' onClick={this.addLink}>{this.language.add}</button>
          </div>
        </span>
      </div>
    );
  }
}