import React from 'react';

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

  updateLink(type, value) {
    this.setState({
      [type]: value
    });
  }

  deleteLink(name, event) {
    event.preventDefault();

    let data = JSON.parse(localStorage.getItem('quicklinks'));
    data = data.filter((i) => i.name !== name);

    localStorage.setItem('quicklinks', JSON.stringify(data));
    this.setState({
      items: data
    });
  }

  addLink = () => {
    let data = JSON.parse(localStorage.getItem('quicklinks'));
    data.push({
      name: this.state.name,
      url: this.state.url
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

  render() {
    let target, rel = null;
    if (localStorage.getItem('quicklinksnewtab') === 'true') {
      target ='_blank';
      rel ='noopener noreferrer';
    }

    const tooltipEnabled = localStorage.getItem('quicklinkstooltip');

    const quickLink = (item) => {
      const link = (
        <a key={item.name} onContextMenu={(e) => this.deleteLink(item.name, e)} href={item.url} target={target} rel={rel}>
          <img src={'https://icons.duckduckgo.com/ip2/' + item.url.replace('https://', '').replace('http://', '') + '.ico'} alt={item.name}/>
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
        <span className='quicklinkscontainer' style={{'visibility': this.state.showAddLink}}>
          <div className='topbarquicklinks'>
            <h4>{this.language.new}</h4>
            <TextareaAutosize rowsMax={1} placeholder={this.language.name} value={this.state.name} onChange={(e) => this.updateLink('name', e.target.value)} />
            <br/>
            <TextareaAutosize rowsMax={10} placeholder={this.language.url} value={this.state.url} onChange={(e) => this.updateLink('url', e.target.value)} />
            <br/>
            <button className='pinNote' onClick={this.addLink}>{this.language.add}</button>
          </div>
        </span>
      </div>
    );
  }
}