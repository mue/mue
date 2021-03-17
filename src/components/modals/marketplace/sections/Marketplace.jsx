import React from 'react';

import WifiOffIcon from '@material-ui/icons/WifiOff';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Item from '../Item';
import Items from '../Items';

import MarketplaceFunctions from '../../../../modules/helpers/marketplace';

import { toast } from 'react-toastify';

import * as Constants from '../../../../modules/constants';

export default class Marketplace extends React.PureComponent {
  constructor(...args) {
    super(...args);
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
    }
    this.buttons = {
      uninstall: <button className='removeFromMue' onClick={() => this.manage('uninstall')}>Remove</button>,
      install: <button className='addToMue' onClick={() => this.manage('install')}>Add to Mue</button>
    }
  }

  async toggle(type, data) {
    switch (type) {
      case 'item':
        let info;
      // get item info
        try {
          info = await (await fetch(`${Constants.MARKETPLACE_URL}/item/${this.props.type}/${data}`)).json();
        } catch (e) {
          return toast(this.props.toastLanguage.error);
        }

        // check if already installed
        let button = this.buttons.install;

        const installed = JSON.parse(localStorage.getItem('installed'));

        if (installed.some(item => item.name === data)) {
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
    const { data } = await (await fetch(Constants.MARKETPLACE_URL + '/all')).json();
    const featured = await (await fetch(Constants.MARKETPLACE_URL + '/featured')).json();

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

    toast(this.props.toastLanguage[type + 'ed']);
    this.setState({
      button: (type === 'install') ? this.buttons.uninstall : this.buttons.install
    });
  }

  componentDidMount() {
    if (localStorage.getItem('animations') === 'true') {
      document.getElementById('marketplace').classList.add('marketplaceanimation');
    }

    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return;
    }

    this.getItems();
  }

  render() {
    const errorMessage = (msg) => {
      return (
        <div id='marketplace'>
          <div className='emptyMessage' style={{ 'marginTop': '20px', 'transform': 'translateY(80%)' }}>
            {msg}
          </div>
        </div>
      );
    }

    if (navigator.onLine === false) {
      return errorMessage(
        <React.Fragment>
          <WifiOffIcon/>
          <h1>Offline</h1>
          <p className='description'>Mue down!</p>
        </React.Fragment>
      );
    }

    if (localStorage.getItem('offlineMode') === 'true') {
      return errorMessage(
        <React.Fragment>
          <WifiOffIcon/>
          <h1>Offline mode is enabled</h1>
          <p className='description'>Please turn off offline mode to access the marketplace</p>
        </React.Fragment>
      );
    }

    if (this.state.done === false) {
      return errorMessage(<h1>Loading</h1>);
    }

    return (
      <React.Fragment>
        <div id='marketplace'>
          <div className='featured' style={{ 'backgroundColor': this.state.featured.colour }}>
            <p>{this.state.featured.title}</p>
            <h1>{this.state.featured.name}</h1>
            <button className='addToMue' onClick={() => window.location.href = this.state.featured.buttonLink}>{this.state.featured.buttonText}</button>
          </div>
          <Items
            items={this.state.items.slice(0, 3)}
            toggleFunction={(input) => this.toggle('item', input)} />
        </div>
      </React.Fragment>
    );
  }
}
