import variables from 'config/variables';
import { PureComponent } from 'react';
import { toast } from 'react-toastify';
import {
  MdWifiOff,
  MdLocalMall,
  MdClose,
  MdSearch,
  MdOutlineArrowForward,
  MdLibraryAdd,
} from 'react-icons/md';

import Item from '../components/Items/Item';
import Items from '../components/Items/Items';
import Dropdown from '../../../components/Form/Settings/Dropdown/Dropdown';
import { Header } from 'components/Layout/Settings';
import { Button } from 'components/Elements';

import { install, urlParser, uninstall } from 'utils/marketplace';

class Marketplace extends PureComponent {
  constructor() {
    super();
    this.state = {
      items: [],
      button: '',
      done: false,
      item: {},
      collection: false,
      filter: '',
    };
    this.buttons = {
      uninstall: (
        <Button
          type="settings"
          onClick={() => this.manage('uninstall')}
          icon={<MdClose />}
          label={variables.getMessage('modals.main.marketplace.product.buttons.remove')}
        />
      ),
      install: (
        <Button
          type="settings"
          onClick={() => this.manage('install')}
          icon={<MdLibraryAdd />}
          label={variables.getMessage('modals.main.marketplace.product.buttons.addtomue')}
        />
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
        if (type === 'all' || type === 'collections') {
          type = data.type;
        }
        info = await (
          await fetch(`${variables.constants.API_URL}/marketplace/item/${type}/${data.name}`, {
            signal: this.controller.signal,
          })
        ).json();
      } catch (e) {
        if (this.controller.signal.aborted === false) {
          return toast(variables.getMessage('toasts.error'));
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
        await fetch(`${variables.constants.API_URL}/marketplace/collection/${data}`, {
          signal: this.controller.signal,
        })
      ).json();
      this.setState({
        items: collection.data.items,
        collectionTitle: collection.data.display_name,
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
    this.setState({
      done: false,
    });
    const dataURL =
      this.props.type === 'collections'
        ? variables.constants.API_URL + '/marketplace/collections'
        : variables.constants.API_URL + '/marketplace/items/' + this.props.type;
    const { data } = await (
      await fetch(dataURL, {
        signal: this.controller.signal,
      })
    ).json();
    const collections = await (
      await fetch(variables.constants.API_URL + '/marketplace/collections', {
        signal: this.controller.signal,
      })
    ).json();

    if (this.controller.signal.aborted === true) {
      return;
    }

    this.setState({
      items: data,
      oldItems: data,
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

    toast(variables.getMessage('toasts.' + type + 'ed'));
    this.setState({
      button: type === 'install' ? this.buttons.uninstall : this.buttons.install,
    });

    variables.stats.postEvent(
      'marketplace-item',
      `${this.state.item.display_name} ${type === 'install' ? 'installed' : 'uninstalled'}`,
    );
    variables.stats.postEvent('marketplace', type === 'install' ? 'Install' : 'Uninstall');
  }

  async installCollection() {
    this.setState({ busy: true });
    try {
      const installed = JSON.parse(localStorage.getItem('installed'));
      for (const item of this.state.items) {
        if (installed.some((i) => i.name === item.display_name)) continue; // don't install if already installed
        let { data } = await (
          await fetch(`${variables.constants.API_URL}/marketplace/item/${item.type}/${item.name}`, {
            signal: this.controller.signal,
          })
        ).json();
        install(data.type, data);
        variables.stats.postEvent('marketplace-item', `${item.display_name} installed}`);
        variables.stats.postEvent('marketplace', 'Install');
      }
      toast(variables.getMessage('toasts.installed'));
    } catch (error) {
      console.error(error);
      toast(variables.getMessage('toasts.error'));
    } finally {
      this.setState({ busy: false });
    }
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
            <span className="mainTitle">
              {variables.getMessage('modals.main.navbar.marketplace')}
            </span>
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
          <span className="title">
            {variables.getMessage('modals.main.marketplace.offline.title')}
          </span>
          <span className="subtitle">
            {variables.getMessage('modals.main.marketplace.offline.description')}
          </span>
        </>,
      );
    }

    if (this.state.done === false) {
      return errorMessage(
        <>
          <div className="loaderHolder">
            <div id="loader"></div>
            <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
          </div>
        </>,
      );
    }

    if (!this.state.items || this.state.items?.length === 0) {
      this.getItems();
      return (
        <>
          {errorMessage(
            <>
              <MdLocalMall />
              <span className="title">
                {variables.getMessage('modals.main.addons.empty.title')}
              </span>
              <span className="subtitle">
                {variables.getMessage('modals.main.marketplace.no_items')}
              </span>
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
            <Header
              title={variables.getMessage('modals.main.navbar.marketplace')}
              secondaryTitle={variables.getMessage('modals.main.marketplace.collection')}
              report={false}
              goBack={() => this.returnToMain()}
            />
            <div
              className="collectionPage"
              style={{
                backgroundImage: `linear-gradient(to bottom, transparent, black), url('${this.state.collectionImg}')`,
              }}
            >
              <div className="nice-tag">
                {variables.getMessage('modals.main.marketplace.collection')}
              </div>
              <div className="content">
                <span className="mainTitle">{this.state.collectionTitle}</span>
                <span className="subtitle">{this.state.collectionDescription}</span>
              </div>

              <Button
                type="collection"
                onClick={() => this.installCollection()}
                disabled={this.state.busy}
                icon={<MdLibraryAdd />}
                label={variables.getMessage('modals.main.marketplace.add_all')}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flexTopMarketplace">
              <span className="mainTitle">
                {variables.getMessage('modals.main.navbar.marketplace')}
              </span>
            </div>
            <div className="headerExtras marketplaceCondition">
              {this.props.type !== 'collections' && (
                <div>
                  <form className="marketplaceSearch">
                    <input
                      label={variables.getMessage('widgets.search')}
                      placeholder={variables.getMessage('widgets.search')}
                      name="filter"
                      id="filter"
                      value={this.state.filter}
                      onChange={(event) => this.setState({ filter: event.target.value })}
                    />
                    <MdSearch />
                  </form>
                </div>
              )}
              <Dropdown
                label={variables.getMessage('modals.main.addons.sort.title')}
                name="sortMarketplace"
                onChange={(value) => this.sortMarketplace(value)}
                items={[
                  {
                    value: 'a-z',
                    text: variables.getMessage('modals.main.addons.sort.a_z'),
                  },
                  {
                    value: 'z-a',
                    text: variables.getMessage('modals.main.addons.sort.z_a'),
                  },
                ]}
              />
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
                  <Button
                    type="collection"
                    onClick={() => this.toggle('collection', item.name)}
                    icon={<MdOutlineArrowForward />}
                    label={variables.getMessage('modals.main.marketplace.explore_collection')}
                    iconPlacement="right"
                  />
                </div>
              ) : null}
            </>
          ))
        ) : (
          <Items
            type={this.props.type}
            items={this.state.items}
            collection={
              this.state.collections[Math.floor(Math.random() * this.state.collections.length)] ||
              []
            }
            onCollection={this.state.collection}
            toggleFunction={(input) => this.toggle('item', input)}
            collectionFunction={(input) => this.toggle('collection', input)}
            filter={this.state.filter}
          />
        )}
      </>
    );
  }
}

export default Marketplace;
