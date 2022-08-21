import variables from 'modules/variables';
import { PureComponent } from 'react';
import { toast } from 'react-toastify';
import {
  MdWifiOff,
  MdLocalMall,
  MdOutlineKeyboardArrowRight,
  MdRefresh,
  MdOutlineArrowForward,
  MdOutlineOpenInNew,
} from 'react-icons/md';

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
      item: {},
      collection: false,
    };
    this.buttons = {
      uninstall: (
        <button onClick={() => this.manage('uninstall')}>
          {this.getMessage('modals.main.marketplace.product.buttons.remove')}
        </button>
      ),
      install: (
        <button onClick={() => this.manage('install')}>
          {this.getMessage('modals.main.marketplace.product.buttons.addtomue')}
        </button>
      ),
    };
    this.controller = new AbortController();
  }

  async toggle(type, data) {
    if (type === 'item') {
      let info;
      // get item info
      try {
        let type = this.props.type;
        if (type === 'all') {
          type = data.type;
        }
        info = await (
          await fetch(`${variables.constants.MARKETPLACE_URL}/item/${type}/${data.name}`, {
            signal: this.controller.signal,
          })
        ).json();
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
          addonInstalledVersion,
          api_name: data.name,
        },
        button: button,
      });

      variables.stats.postEvent('marketplace-item', `${this.state.item.display_name} viewed`);
    } else if (type === 'collection') {
      this.setState({
        done: false,
      });
      const collection = await (
        await fetch(`${variables.constants.MARKETPLACE_URL}/collection/${data}`, {
          signal: this.controller.signal,
        })
      ).json();
      this.setState({
        items: collection.data.items,
        collectionTitle: collection.data.name,
        collectionDescription: collection.data.description,
        collectionImg: collection.data.img,
        collection: true,
        done: true,
      });
    } else {
      this.setState({
        item: {},
      });
    }
  }

  async getItems() {
    const dataURL =
      this.props.type === 'collections'
        ? variables.constants.MARKETPLACE_URL + '/collections'
        : variables.constants.MARKETPLACE_URL + '/items/' + this.props.type;
    const { data } = await (
      await fetch(dataURL, {
        signal: this.controller.signal,
      })
    ).json();
    const featured = await (
      await fetch(variables.constants.MARKETPLACE_URL + '/featured', {
        signal: this.controller.signal,
      })
    ).json();
    const collections = await (
      await fetch(variables.constants.MARKETPLACE_URL + '/collections', {
        signal: this.controller.signal,
      })
    ).json();

    if (this.controller.signal.aborted === true) {
      return;
    }

    this.setState({
      items: data,
      oldItems: data,
      featured: featured.data,
      collections: collections.data,
      done: true,
    });

    this.sortMarketplace(localStorage.getItem('sortMarketplace'), false);
  }

  manage(type) {
    if (type === 'install') {
      install(this.state.item.type, this.state.item.data);
    } else {
      uninstall(this.state.item.type, this.state.item.display_name);
    }

    toast(this.getMessage('toasts.' + type + 'ed'));
    this.setState({
      button: type === 'install' ? this.buttons.uninstall : this.buttons.install,
    });

    variables.stats.postEvent(
      'marketplace-item',
      `${this.state.item.display_name} ${type === 'install' ? 'installed' : 'uninstalled'}`,
    );
    variables.stats.postEvent('marketplace', type === 'install' ? 'Install' : 'Uninstall');
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
      sortType: value,
    });

    if (sendEvent) {
      variables.stats.postEvent('marketplace', 'Sort');
    }
  }

  returnToMain() {
    this.setState({
      items: this.state.oldItems,
      collection: false,
    });
  }

  reloadItems() {
    this.setState({
      done: false,
    });

    this.getItems();
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
        <>
          <div className="flexTopMarketplace">
            <span className="mainTitle">{this.getMessage('modals.main.navbar.marketplace')}</span>
          </div>
          <div className="emptyItems">
            <div className="emptyMessage">{msg}</div>
          </div>
        </>
      );
    };

    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return errorMessage(
        <>
          <MdWifiOff />
          <h1>{this.getMessage('modals.main.marketplace.offline.title')}</h1>
          <p className="description">
            {this.getMessage('modals.main.marketplace.offline.description')}
          </p>
        </>,
      );
    }

    if (this.state.done === false) {
      return errorMessage(
        <>
          <div className="loaderHolder">
            <div id="loader"></div>
            <span className="subtitle">{this.getMessage('modals.main.loading')}</span>
          </div>
        </>,
      );
    }

    const featured = () => {
      const openFeatured = () => {
        variables.stats.postEvent('marketplace', 'Featured clicked');
        window.open(this.state.featured.buttonLink);
      };

      return (
        <div className="featured" style={{ backgroundColor: this.state.featured.colour }}>
          <p>{this.state.featured.title}</p>
          <h1>{this.state.featured.name}</h1>
          <button className="addToMue" onClick={() => openFeatured()}>
            {this.state.featured.buttonText}
          </button>
        </div>
      );
    };

    if (this.state.items.length === 0) {
      return (
        <>
          {featured()}
          {errorMessage(
            <>
              <MdLocalMall />
              <h1>{this.getMessage('modals.main.addons.empty.title')}</h1>
              <p className="description">{this.getMessage('modals.main.marketplace.no_items')}</p>
            </>,
          )}
        </>
      );
    }

    if (this.state.item.display_name) {
      return (
        <Item
          data={this.state.item}
          button={this.state.button}
          toggleFunction={() => this.toggle()}
          addonInstalled={this.state.item.addonInstalled}
          addonInstalledVersion={this.state.item.addonInstalledVersion}
          icon={this.state.item.screenshot_url}
        />
      );
    }

    return (
      <>
        {this.state.collection === true ? (
          <>
            <div className="flexTopMarketplace">
              <span className="mainTitle" onClick={() => this.returnToMain()}>
                <span className="backTitle">
                  {this.getMessage('modals.main.navbar.marketplace')}
                </span>
                <MdOutlineKeyboardArrowRight /> Collection
              </span>
            </div>
            <div
              className="collectionPage"
              style={{
                backgroundImage: `linear-gradient(to bottom, transparent, #2f3542), url('${this.state.collectionImg}')`,
              }}
            >
              <div className="content">
                <span className="mainTitle">{this.state.collectionTitle}</span>
                <span className="subtitle">{this.state.collectionDescription}</span>
              </div>
              <div className="nice-tag">Collection</div>
            </div>
          </>
        ) : (
          <>
            <div className="flexTopMarketplace">
              <span className="mainTitle">{this.getMessage('modals.main.navbar.marketplace')}</span>
            </div>
            <div className="headerExtras marketplaceCondition">
              <span className="link" onClick={() => this.reloadItems()}>
                <MdRefresh /> {this.getMessage('widgets.navbar.tooltips.refresh')}
              </span>
              <Dropdown
                label={this.getMessage('modals.main.addons.sort.title')}
                name="sortMarketplace"
                onChange={(value) => this.sortMarketplace(value)}
              >
                <option value="a-z">{this.getMessage('modals.main.addons.sort.a_z')}</option>
                <option value="z-a">{this.getMessage('modals.main.addons.sort.z_a')}</option>
              </Dropdown>
            </div>
          </>
        )}
        {this.props.type === 'collections' && !this.state.collection ? (
          this.state.items.map((item) => (
            <>
              {!item.news ? (
                <div
                  className="collection"
                  style={
                    item.news
                      ? { backgroundColor: item.background_colour }
                      : {
                          backgroundImage: `linear-gradient(to left, #000, transparent, #000), url('${item.img}')`,
                        }
                  }
                >
                  <div className="content">
                    <span className="title">{item.display_name}</span>
                    <span className="subtitle">{item.description}</span>
                  </div>
                  <button
                    className="nice-button"
                    onClick={() => this.toggle('collection', item.name)}
                  >
                    <MdOutlineArrowForward />{' '}
                    {this.getMessage('modals.main.marketplace.explore_collection')}
                  </button>
                </div>
              ) : null}
            </>
          ))
        ) : (
          <Items
            type={this.props.type}
            items={this.state.items}
            collections={this.state.collections}
            onCollection={this.state.collection}
            toggleFunction={(input) => this.toggle('item', input)}
            collectionFunction={(input) => this.toggle('collection', input)}
          />
        )}
      </>
    );
  }
}
