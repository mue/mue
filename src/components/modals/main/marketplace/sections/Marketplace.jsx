import React from 'react';

import WifiOffIcon from '@material-ui/icons/WifiOff';
import LocalMallIcon from '@material-ui/icons/LocalMall';

import Item from '../Item';
import Items from '../Items';

import MarketplaceFunctions from '../../../../../modules/helpers/marketplace';

import { toast } from 'react-toastify';

export default class Marketplace extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      items: [],
      current_data: {
        type: '',
        name: '',
        content: {}
      },
      button: '',
      featured: {},
      done: false,
      item_data: {
        name: 'Name',
        author: 'Author',
        description: 'Description',
        updated: '???',
        version: '1.0.0',
        icon: ''
      }
    };
    this.buttons = {
      uninstall: <button className='removeFromMue' onClick={() => this.manage('uninstall')}>{window.language.modals.main.marketplace.product.buttons.remove}</button>,
      install: <button className='addToMue' onClick={() => this.manage('install')}>{window.language.modals.main.marketplace.product.buttons.addtomue}</button>
    }
    this.language = window.language.modals.main.marketplace;
  }

  async toggle(type, data) {
    switch (type) {
      case 'item':
        let info;
        // get item info
        try {
          info = await (await fetch(`${window.constants.MARKETPLACE_URL}/item/${this.props.type}/${data}`)).json();
        } catch (e) {
          return toast(window.language.toasts.error);
        }

        // check if already installed
        let button = this.buttons.install;

        const installed = JSON.parse(localStorage.getItem('installed'));

        if (installed.some(item => item.name === info.data.name)) {
          button = this.buttons.uninstall;
        }

        this.setState({
          current_data: { type: this.props.type, name: data, content: info },
          item_data: {
            name: info.data.name,
            author: info.data.author,
            description: MarketplaceFunctions.urlParser(info.data.description.replace(/\n/g, '<br>')),
            updated: info.updated,
            version: info.data.version,
            icon: info.data.screenshot_url
          },
          button: button
        });

        document.getElementById('marketplace').style.display = 'none';
        document.getElementById('item').style.display = 'block';
        break;

      default:
        document.getElementById('marketplace').style.display = 'block';
        document.getElementById('item').style.display = 'none';
        break;
    }
  }

  async getItems() {
    const { data } = await (await fetch(window.constants.MARKETPLACE_URL + '/all')).json();
    const featured = await (await fetch(window.constants.MARKETPLACE_URL + '/featured')).json();

    this.setState({
      items: data[this.props.type],
      featured: featured.data,
      done: true
    });
  }

  manage(type) {
    switch (type) {
      case 'install':
        MarketplaceFunctions.install(this.state.current_data.type, this.state.current_data.content.data);
        break;
      case 'uninstall':
        MarketplaceFunctions.uninstall(this.state.current_data.content.data.name, this.state.current_data.type);
        break;
      default:
        break;
    }

    toast(window.language.toasts[type + 'ed']);
    this.setState({
      button: (type === 'install') ? this.buttons.uninstall : this.buttons.install
    });
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return;
    }

    this.getItems();
  }

  render() {
    const errorMessage = (msg) => {
      return (
        <div id='marketplace'>
          <div className='emptyitems'>
            <div className='emptyMessage'>
              {msg}
            </div>
          </div>
        </div>
      );
    }

    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return errorMessage(
        <>
          <WifiOffIcon/>
          <h1>{this.language.offline.title}</h1>
          <p className='description'>{this.language.offline.description}</p>
        </>
      );
    }

    if (this.state.done === false) {
      return errorMessage(<h1>{window.language.modals.main.loading}</h1>);
    }

    if (this.state.items.length === 0) {
      return errorMessage(<>
        <LocalMallIcon/>
        <h1>{window.language.modals.main.addons.empty.title}</h1>
        <p className='description'>{this.language.no_items}</p>
      </>)
    }

    return (
      <>
        <div id='marketplace'>
          <div className='featured' style={{ 'backgroundColor': this.state.featured.colour }}>
            <p>{this.state.featured.title}</p>
            <h1>{this.state.featured.name}</h1>
            <button className='addToMue' onClick={() => window.location.href = this.state.featured.buttonLink}>{this.state.featured.buttonText}</button>
          </div>
          <Items
            items={this.state.items}
            toggleFunction={(input) => this.toggle('item', input)} />
        </div>
        <Item data={this.state.item_data} button={this.state.button} toggleFunction={() => this.toggle()} />
      </>
    );
  }
}
