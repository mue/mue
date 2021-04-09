import React from 'react';

import LocalMallIcon from '@material-ui/icons/LocalMall';
import Item from '../Item';
import Items from '../Items';
import FileUpload from '../../settings/FileUpload';

import MarketplaceFunctions from '../../../../../modules/helpers/marketplace';

import { toast } from 'react-toastify';

export default class Added extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      installed: JSON.parse(localStorage.getItem('installed')),
      current_data: {
        type: '',
        name: '',
        content: {}
      },
      item_data: {
        name: 'Name',
        author: 'Author',
        description: 'Description',
        updated: '???',
        version: '1.0.0',
        icon: ''
      },
      button: ''
    };
    this.buttons = {
      uninstall: <button className='removeFromMue' onClick={() => this.manage('uninstall')}>Remove</button>,
    }
  }

  toggle(type, type2, data) {
    if (type === 'item') {
      const installed = JSON.parse(localStorage.getItem('installed'));
      const info = installed.find(i => i.name === data);

      this.setState({
        current_data: {
          type: type2,
          name: data,
          content: info
        },
        item_data: {
          name: info.name,
          author: info.author,
          description: MarketplaceFunctions.urlParser(info.description.replace(/\n/g, '<br>')),
          updated: 'Not Implemented',
          version: info.version,
          icon: info.screenshot_url
        }
      });

      document.getElementById('item').style.display = 'block';
      document.getElementById('marketplace').style.display = 'none';
    } else {
      document.getElementById('marketplace').style.display = 'block';
      document.getElementById('item').style.display = 'none';
    }

    this.setState({
      button: this.buttons.uninstall
    });
  }

  manage(type, input) {
    switch (type) {
      case 'install':
        MarketplaceFunctions.install(input.type, input, true);
        break;
      case 'uninstall':
        MarketplaceFunctions.uninstall(this.state.current_data.name, this.state.current_data.content.type);
        break;
      default:
        break;
    }

    toast(window.language.toasts[type + 'ed']);

    let button = '';
    if (type === 'install') {
      button = this.buttons.uninstall;
    }

    this.setState({
      button: button,
      installed: JSON.parse(localStorage.getItem('installed'))
    });
  }

  render() {
    let content = (
      <Items 
        items={this.state.installed} 
        toggleFunction={(input) => this.toggle('item', 'addon', input)} 
        reloadItemsList={() => this.setState({ installed: JSON.parse(localStorage.getItem('installed')) })} 
      />
    );

    if (this.state.installed.length === 0) {
      content = (
        <div className='items'>
          <div className='emptyMessage'>
            <LocalMallIcon/>
            <h1>Empty</h1>
            <p className='description'>Nothing here (yet)</p>
            <button className='goToMarket'>Take me there</button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div id='marketplace'>
          <FileUpload id='file-input' type='settings' accept='application/json' loadFunction={(e) => this.manage('install', JSON.parse(e.target.result))} />
          {/*<button className='addToMue sideload' onClick={() => document.getElementById('file-input').click()}>Sideload</button>*/}
          {content}
        </div>
        <Item data={this.state.item_data} button={this.state.button} toggleFunction={() => this.toggle()} />
      </>
    );
  }
}
