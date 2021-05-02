import React from 'react';

import WifiOffIcon from '@material-ui/icons/WifiOff';
import LocalMallIcon from '@material-ui/icons/LocalMall';

import Item from '../Item';
import Items from '../Items';
import Dropdown from '../../settings/Dropdown';

import MarketplaceFunctions from '../../../../../modules/helpers/marketplace';

import { toast } from 'react-toastify';

export default class Marketplace extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      items: [],
      button: '',
      featured: {},
      done: false,
      item: {
        name: 'Name',
        author: 'Author',
        description: 'Description',
        //updated: '???',
        version: '1.0.0',
        icon: ''
      },
      display: {
        marketplace: 'block',
        item: 'none'
      }
    };
    this.buttons = {
      uninstall: <button className='removeFromMue' onClick={() => this.manage('uninstall')}>{window.language.modals.main.marketplace.product.buttons.remove}</button>,
      install: <button className='addToMue' onClick={() => this.manage('install')}>{window.language.modals.main.marketplace.product.buttons.addtomue}</button>
    };
    this.language = window.language.modals.main.marketplace;
    this.controller = new AbortController();
  }

  async toggle(type, data) {
    if (type === 'item') {
      let info;
      // get item info
      try {
        info = await (await fetch(`${window.constants.MARKETPLACE_URL}/item/${this.props.type}/${data}`, { signal: this.controller.signal })).json();
      } catch (e) {
        if (this.controller.signal.aborted === false) {
          return toast(window.language.toasts.error);
        }
      }

      if (this.controller.signal.aborted === true) {
        return;
      }

      // check if already installed
      let button = this.buttons.install;

      const installed = JSON.parse(localStorage.getItem('installed'));

      if (installed.some((item) => item.name === info.data.name)) {
        button = this.buttons.uninstall;
      }

      this.setState({
        item: {
          type: this.props.type,
          display_name: info.data.name,
          author: info.data.author,
          description: MarketplaceFunctions.urlParser(info.data.description.replace(/\n/g, '<br>')),
          //updated: info.updated,
          version: info.data.version,
          icon: info.data.screenshot_url,
          data: info.data
        },
        button: button,
        display: {
          item: 'block',
          marketplace: 'none'
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

  async getItems() {
    const { data } = await (await fetch(window.constants.MARKETPLACE_URL + '/all', { signal: this.controller.signal })).json();
    const featured = await (await fetch(window.constants.MARKETPLACE_URL + '/featured', { signal: this.controller.signal })).json();

    if (this.controller.signal.aborted === true) {
      return;
    }

    this.setState({
      items: data[this.props.type],
      oldItems: data[this.props.type],
      featured: featured.data,
      done: true
    });

    this.sortMarketplace(localStorage.getItem('sortMarketplace'));
  }

  manage(type) {
    if (type === 'install') {
      MarketplaceFunctions.install(this.state.item.type, this.state.item.data);
    } else {
      MarketplaceFunctions.uninstall(this.state.item.type, this.state.item.display_name);
    }

    toast(window.language.toasts[type + 'ed']);
    this.setState({
      button: (type === 'install') ? this.buttons.uninstall : this.buttons.install
    });
  }

  sortMarketplace(value) {
    let items = this.state.oldItems;
    switch (value) {
      case 'a-z':
        items.sort();
        items.reverse();
        break;
      case 'z-a':
        items.sort();
        items.reverse();
      break;
    }

    this.setState({
      items: items,
      display: {
        item: 'none',
        marketplace: 'block'
      }
    });
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return;
    }

    this.getItems();
  }

  componentWillUnmount() {
    // stop making requests
    this.controller.abort();
  }

  render() {
    const errorMessage = (msg) => {
      return (
        <div className='emptyitems'>
          <div className='emptyMessage'>
            {msg}
          </div>
        </div>
      );
    };

    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return errorMessage(<>
        <WifiOffIcon/>
        <h1>{this.language.offline.title}</h1>
        <p className='description'>{this.language.offline.description}</p>
      </>);
    }

    if (this.state.done === false) {
      return errorMessage(<h1>{window.language.modals.main.loading}</h1>);
    }

    if (this.state.items.length === 0) {
      return errorMessage(<>
        <LocalMallIcon/>
        <h1>{window.language.modals.main.addons.empty.title}</h1>
        <p className='description'>{this.language.no_items}</p>
      </>);
    }

    return (
      <>
        <div style={{ 'display': this.state.display.marketplace }}>
          <div className='featured' style={{ 'backgroundColor': this.state.featured.colour }}>
            <p>{this.state.featured.title}</p>
            <h1>{this.state.featured.name}</h1>
            <button className='addToMue' onClick={() => window.open(this.state.featured.buttonLink)}>{this.state.featured.buttonText}</button>
          </div>
          <br/>
          <Dropdown label={window.language.modals.main.addons.sort.title} name='sortMarketplace' onChange={(value) => this.sortMarketplace(value)}>
            <option value='a-z'>{window.language.modals.main.addons.sort.a_z}</option>
            <option value='z-a'>{window.language.modals.main.addons.sort.z_a}</option>
          </Dropdown>
          <br/>
          <Items items={this.state.items} toggleFunction={(input) => this.toggle('item', input)} />
        </div>
        <Item data={this.state.item} button={this.state.button} toggleFunction={() => this.toggle()} display={this.state.display.item} />
      </>
    );
  }
}
