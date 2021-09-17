import variables from 'modules/variables';
import { PureComponent } from 'react';
import { toast } from 'react-toastify';
import { WifiOff, LocalMall } from '@mui/icons-material';

import Item from '../Item';
import Items from '../Items';
import Dropdown from '../../settings/Dropdown';

import { install, urlParser, uninstall } from 'modules/helpers/marketplace';

export default class Marketplace extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      items: [],
      button: '',
      featured: {},
      done: false,
      item: {}
    };
    this.buttons = {
      uninstall: <button className='removeFromMue' onClick={() => this.manage('uninstall')}>{this.getMessage('modals.main.marketplace.product.buttons.remove')}</button>,
      install: <button className='addToMue' onClick={() => this.manage('install')}>{this.getMessage('modals.main.marketplace.product.buttons.addtomue')}</button>
    };
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
          return toast(this.getMessage('toasts.error'));
        }
      }

      if (this.controller.signal.aborted === true) {
        return;
      }

      // check if already installed
      let button = this.buttons.install;
      let addonInstalled = false;
      let addonInstalledVersion;

      const installed = JSON.parse(localStorage.getItem('installed'));

      if (installed.some((item) => item.name === info.data.name)) {
        button = this.buttons.uninstall;
        addonInstalled = true;
        for (let i = 0; i < installed.length; i++) {
          if (installed[i].name === info.data.name) {
            addonInstalledVersion = installed[i].version;
            break;
          }
        }
      }

      this.setState({
        item: {
          type: info.data.type,
          display_name: info.data.name,
          author: info.data.author,
          description: urlParser(info.data.description.replace(/\n/g, '<br>')),
          //updated: info.updated,
          version: info.data.version,
          icon: info.data.screenshot_url,
          data: info.data,
          addonInstalled,
          addonInstalledVersion
        },
        button: button
      });

      window.stats.postEvent('marketplace-item', `${this.state.item.display_name} viewed`);
    } else {
      this.setState({
        item: {}
      });
    }
  }

  async getItems() {
    const { data } = await (await fetch(window.constants.MARKETPLACE_URL + '/items/' + this.props.type, { signal: this.controller.signal })).json();
    const featured = await (await fetch(window.constants.MARKETPLACE_URL + '/featured', { signal: this.controller.signal })).json();

    if (this.controller.signal.aborted === true) {
      return;
    }

    this.setState({
      items: data,
      oldItems: data,
      featured: featured.data,
      done: true
    });

    this.sortMarketplace(localStorage.getItem('sortMarketplace'), false);
  }

  manage(type) {
    if (type === 'install') {
      install(this.state.item.type, this.state.item.data);
    } else {
      uninstall(this.state.item.type, this.state.item.display_name);
    }

    toast(this.getMessage('toats.' + type + 'ed'));
    this.setState({
      button: (type === 'install') ? this.buttons.uninstall : this.buttons.install
    });

    window.stats.postEvent('marketplace-item', `${this.state.item.display_name} ${(type === 'install' ? 'installed': 'uninstalled')}`);
    window.stats.postEvent('marketplace', (type === 'install' ? 'Install': 'Uninstall'));
  }

  sortMarketplace(value, sendEvent) {
    let items = this.state.oldItems;
    switch (value) {
      case 'a-z':
        items.sort();
        // fix sort not working sometimes
        if (this.state.sortType === 'z-a') {
          items.reverse();
        }
        break;
      case 'z-a':
        items.sort();
        items.reverse();
        break;
      default:
        break;
    }

    this.setState({
      items: items,
      sortType: value
    });

    if (sendEvent) {
      window.stats.postEvent('marketplace', 'Sort');
    }
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
        <WifiOff/>
        <h1>{this.getMessage('modals.main.marketplace.offline.title')}</h1>
        <p className='description'>{this.getMessage('modals.main.marketplace.offline.description')}</p>
      </>);
    }

    if (this.state.done === false) {
      return errorMessage(<h1>{this.getMessage('modals.main.loading')}</h1>);
    }

    const featured = () => {
      const openFeatured = () => {
        window.stats.postEvent('marketplace', 'Featured clicked');
        window.open(this.state.featured.buttonLink);
      };

      return (
        <div className='featured' style={{ backgroundColor: this.state.featured.colour }}>
          <p>{this.state.featured.title}</p>
          <h1>{this.state.featured.name}</h1>
          <button className='addToMue' onClick={() => openFeatured()}>{this.state.featured.buttonText}</button>
        </div>
      );
    }

    if (this.state.items.length === 0) {
      return (
        <>
          {featured()}
          {errorMessage(<>
            <LocalMall/>
            <h1>{this.getMessage('modals.main.addons.empty.title')}</h1>
            <p className='description'>{this.getMessage('modals.main.marketplace.no_items')}</p>
          </>)}
        </>
      );
    }

    if (this.state.item.display_name) {
      return <Item data={this.state.item} button={this.state.button} toggleFunction={() => this.toggle()} addonInstalled={this.state.item.addonInstalled} addonInstalledVersion={this.state.item.addonInstalledVersion}/>;
    }

    return (
      <>
        {featured()}
        <br/>
        <Dropdown label={this.getMessage('modals.main.addons.sort.title')} name='sortMarketplace' onChange={(value) => this.sortMarketplace(value)}>
          <option value='a-z'>{this.getMessage('modals.main.addons.sort.a_z')}</option>
          <option value='z-a'>{this.getMessage('modals.main.addons.sort.z_a')}</option>
        </Dropdown>
        <br/>
        <Items items={this.state.items} toggleFunction={(input) => this.toggle('item', input)} />
      </>
    );
  }
}
