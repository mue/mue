import React from 'react';

import LocalMallIcon from '@material-ui/icons/LocalMall';
import Item from '../Item';
import Items from '../Items';

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
      item: {
        name: 'Name',
        author: 'Author',
        description: 'Description',
        //updated: '???',
        version: '1.0.0',
        icon: ''
      },
      button: '',
      display: {
        marketplace: 'block',
        item: 'none'
      }
    };
    this.buttons = {
      uninstall: <button className='removeFromMue' onClick={() => this.uninstall()}>{window.language.modals.main.marketplace.product.buttons.remove}</button>,
    }
    this.language = window.language.modals.main.addons;
  }

  toggle(type, data) {
    if (type === 'item') {
      const installed = JSON.parse(localStorage.getItem('installed'));
      const info = installed.find(i => i.name === data);

      this.setState({
        item: {
          type: info.type,
          name: data,
          display_name: info.name,
          author: info.author,
          description: MarketplaceFunctions.urlParser(info.description.replace(/\n/g, '<br>')),
          //updated: info.updated,
          version: info.version,
          icon: info.screenshot_url
        }
      });

      this.setState({
        button: this.buttons.uninstall,
        display: {
          marketplace: 'none',
          item: 'block'
        }
      });
    } else {
      this.setState({
        display: {
          marketplace: 'block',
          item: 'none'
        }
      });
    }
  }

  uninstall() {
    MarketplaceFunctions.uninstall(this.state.item.display_name, this.state.item.type);
    
    toast(window.language.toasts.uninstalled);

    this.setState({
      button: '',
      installed: JSON.parse(localStorage.getItem('installed'))
    });
  }

  render() {
    let content = (
      <Items 
        items={this.state.installed} 
        toggleFunction={(input) => this.toggle('item', input)} 
        reloadItemsList={() => this.setState({ installed: JSON.parse(localStorage.getItem('installed')) })} 
      />
    );

    if (this.state.installed.length === 0) {
      content = (
        <div className='emptyitems'>
          <div className='emptyMessage'>
            <LocalMallIcon/>
            <h1>{this.language.empty.title}</h1>
            <p className='description'>{this.language.empty.description}</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div id='marketplace' style={{ 'display': this.state.display.marketplace }}>
          {content}
        </div>
        <Item data={this.state.item} button={this.state.button} toggleFunction={() => this.toggle()} display={this.state.display.item} />
      </>
    );
  }
}
