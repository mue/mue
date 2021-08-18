import { PureComponent } from 'react';
import { toast } from 'react-toastify';
import { WifiOff, LocalMall } from '@material-ui/icons';

import Item from '../Item';
import Items from '../Items';
import Dropdown from '../../settings/Dropdown';

import { install, urlParser, uninstall } from '../../../../../modules/helpers/marketplace';

export default class Marketplace extends PureComponent {
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
          type: info.data.type,
          display_name: info.data.name,
          author: info.data.author,
          description: urlParser(info.data.description.replace(/\n/g, '<br>')),
          //updated: info.updated,
          version: info.data.version,
          icon: info.data.screenshot_url,
          data: info.data
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

    toast(window.language.toasts[type + 'ed']);
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
        <h1>{this.language.offline.title}</h1>
        <p className='description'>{this.language.offline.description}</p>
      </>);
    }

    if (this.state.done === false) {
      return errorMessage(<h1>{window.language.modals.main.loading}</h1>);
    }

    const featured = () => {
      const openFeatured = () => {
        window.stats.postEvent('marketplace', 'Featured clicked');
        window.open(this.state.featured.buttonLink);
      }

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
            <h1>{window.language.modals.main.addons.empty.title}</h1>
            <p className='description'>{this.language.no_items}</p>
          </>)}
        </>
      );
    }

    if (this.state.item.display_name) {
      return <Item data={this.state.item} button={this.state.button} toggleFunction={() => this.toggle()}/>;
    }

    return (
      <>
        {featured()}
        <br/>
        <Dropdown label={window.language.modals.main.addons.sort.title} name='sortMarketplace' onChange={(value) => this.sortMarketplace(value)}>
          <option value='a-z'>{window.language.modals.main.addons.sort.a_z}</option>
          <option value='z-a'>{window.language.modals.main.addons.sort.z_a}</option>
        </Dropdown>
        <br/>
        <Items items={this.state.items} toggleFunction={(input) => this.toggle('item', input)} />
      </>
    );
  }
}
