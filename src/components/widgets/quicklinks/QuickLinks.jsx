import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import './scss/index.scss';

export default class QuickLinks extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      items: JSON.parse(localStorage.getItem('quicklinks')),
      name: '',
      url: ''
    };
  }

  updateLink(type, value) {
    this.setState({
      [type]: value
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
      items: JSON.parse(localStorage.getItem('quicklinks')),
      name: '',
      url: ''
    });
  }

  render() {
    return (
      <div className='quicklinks-container'>
        {this.state.items.map((item) => (
          <Tooltip title={item.name} key={item.name}>
            <a href={item.url}><img src={'https://s2.googleusercontent.com/s2/favicons?domain_url=' + item.url}/></a>
          </Tooltip>
        ))}
        <div className='quicklinks'>
          <button>+</button>
          <span className='quicklinkscontainer'>
            <div className='topbarquicklinks'>
              <h4>New Link</h4>
              <TextareaAutosize rowsMax={1} placeholder='Name' value={this.state.name} onChange={(e) => this.updateLink('name', e.target.value)} />
              <br/>
              <TextareaAutosize rowsMax={10} placeholder='URL' value={this.state.url} onChange={(e) => this.updateLink('url', e.target.value)} />
              <br/>
              <button className='pinNote' onClick={this.addLink}>Add</button>
            </div>
          </span>
        </div>
      </div>
    );
  }
}