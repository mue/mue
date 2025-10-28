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

import ItemPage from './ItemPage';
import Items from '../components/Items/Items';
import Dropdown from '../../../components/Form/Settings/Dropdown/Dropdown';
import { Header } from 'components/Layout/Settings';
import { Button } from 'components/Elements';

import { install, urlParser, uninstall } from 'utils/marketplace';
import { updateHash } from 'utils/deepLinking';

// API v2 base URL
const API_V2_BASE = `${variables.constants.API_URL}/marketplace`;

class Marketplace extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      relatedItems: [],
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

  async toggle(pageType, data) {
    if (pageType === 'item') {
      let info;
      let relatedItems = [];

      // get item info using API v2
      try {
        let type = this.props.type;
        if (type === 'all' || type === 'collections') {
          type = data.type;
        }

        // API v2: Fetch by ID if available, otherwise by name
        const itemEndpoint = data.id
          ? `${API_V2_BASE}/item/${data.id}`
          : `${API_V2_BASE}/item/${type}/${data.name}`;

        info = await (
          await fetch(itemEndpoint, {
            signal: this.controller.signal,
          })
        ).json();

        // Fetch related items using API v2
        if (info.data?.id) {
          try {
            const relatedResponse = await fetch(`${API_V2_BASE}/item/${info.data.id}/related`, {
              signal: this.controller.signal,
            });
            const relatedData = await relatedResponse.json();
            relatedItems = relatedData.data?.related || [];
          } catch (relatedError) {
            console.warn('Failed to fetch related items:', relatedError);
          }

          // Track view using API v2
          fetch(`${API_V2_BASE}/item/${info.data.id}/view`, {
            method: 'POST',
            signal: this.controller.signal,
          }).catch(() => {}); // Silent fail for analytics
        }
      } catch (error) {
        // Error caught but only used for flow control
        if (this.controller.signal.aborted === false) {
          console.error('Failed to fetch item:', error);
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
          id: info.data.id, // Store item ID for deep linking
          onCollection: data._onCollection,
          type: info.data.type,
          display_name: info.data.name || info.data.display_name,
          author: info.data.author,
          description: urlParser(info.data.description.replace(/\n/g, '<br>')),
          version: info.data.version,
          icon: info.data.screenshot_url,
          data: info.data,
          addonInstalled,
          addonInstalledVersion,
          api_name: data.name,
        },
        relatedItems,
        button: button,
      });

      // Update URL hash with item ID for deep linking
      if (info.data?.id) {
        updateHash(`#marketplace/${info.data.type}/${info.data.id}`);
      }

      document.querySelector('#modal').scrollTop = 0;
      variables.stats.postEvent('marketplace-item', `${this.state.item.display_name} viewed`);
    } else if (pageType === 'collection') {
      this.setState({ done: false, item: {} });
      // Use API v2 for collections
      const collection = await (
        await fetch(`${API_V2_BASE}/collection/${data}`, {
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

      // Update hash for collection deep linking
      updateHash(`#marketplace/collection/${data}`);
    } else {
      this.setState({ item: {}, relatedItems: [] });
      // Clear hash when returning to main view
      updateHash('#marketplace');
    }
  }

  async getItems() {
    this.setState({ done: false });

    // Use API v2 endpoints
    const dataURL =
      this.props.type === 'collections'
        ? `${API_V2_BASE}/collections`
        : `${API_V2_BASE}/items/${this.props.type}`;

    const { data } = await (await fetch(dataURL, { signal: this.controller.signal })).json();
    const collections = await (
      await fetch(`${API_V2_BASE}/collections`, {
        signal: this.controller.signal,
      })
    ).json();

    if (this.controller.signal.aborted === true) {
      return;
    }

    const sorted = this.sortMarketplace(data, false);

    this.setState({
      items: sorted.items,
      sortType: sorted.sortType,
      oldItems: sorted.items,
      collections: collections.data,
      displayedCollection:
        collections.data[Math.floor(Math.random() * collections.data.length)] || [],
      done: true,
    });
  }

  manage(type) {
    if (type === 'install') {
      install(this.state.item.type, this.state.item.data);
    } else {
      uninstall(this.state.item.type, this.state.item.display_name);
    }

    toast(variables.getMessage('toasts.' + type + 'ed'));
    this.setState({ button: type === 'install' ? this.buttons.uninstall : this.buttons.install });

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

        // Use API v2 - fetch by ID if available, otherwise by name
        const itemEndpoint = item.id
          ? `${API_V2_BASE}/item/${item.id}`
          : `${API_V2_BASE}/item/${item.type}/${item.name}`;

        const { data } = await (
          await fetch(itemEndpoint, {
            signal: this.controller.signal,
          })
        ).json();

        install(data.type, data, false, true);
        variables.stats.postEvent('marketplace-item', `${item.display_name} installed}`);
        variables.stats.postEvent('marketplace', 'Install');
      }
      toast(variables.getMessage('toasts.installed'));
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast(variables.getMessage('toasts.error'));
    } finally {
      this.setState({ busy: false });
    }
  }

  sortMarketplace(data, sendEvent) {
    const value = localStorage.getItem('sortMarketplace') || 'a-z';
    let items = data || this.state.items;
    if (!items) {
      return;
    }

    switch (value) {
      case 'a-z': {
        // sort by name key alphabetically
        const sorted = items.sort((a, b) => {
          if (a.display_name < b.display_name) {
            return -1;
          }
          if (a.display_name > b.display_name) {
            return 1;
          }
          return 0;
        });
        items = sorted;
        break;
      }
      case 'z-a':
        items.sort();
        items.reverse();
        break;
      default:
        break;
    }

    if (sendEvent) {
      variables.stats.postEvent('marketplace', 'Sort');
    }

    return { items: items, sortType: value };
  }

  changeSort(value) {
    localStorage.setItem('sortMarketplace', value);
    this.setState(this.sortMarketplace(null, true));
  }

  returnToMain() {
    this.setState({ items: this.state.oldItems, collection: false });
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return;
    }

    this.getItems();

    // Handle deep link data if provided
    if (this.props.deepLinkData) {
      const { itemId, collection, category } = this.props.deepLinkData;

      // Wait for items to load, then open the specific item or collection
      setTimeout(() => {
        if (collection) {
          // Open collection
          this.toggle('collection', collection);
        } else if (itemId) {
          // Open specific item by ID
          this.toggle('item', { id: itemId, type: category });
        }
      }, 500);
    }
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
        <div className="loaderHolder">
          <div id="loader"></div>
          <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
        </div>,
      );
    }

    if (!this.state.items || this.state.items?.length === 0) {
      this.getItems();
      return errorMessage(
        <>
          <MdLocalMall />
          <span className="title">{variables.getMessage('modals.main.addons.empty.title')}</span>
          <span className="subtitle">
            {variables.getMessage('modals.main.marketplace.no_items')}
          </span>
        </>,
      );
    }

    if (this.state.item.display_name) {
      return (
        <ItemPage
          data={this.state.item}
          button={this.state.button}
          toggleFunction={(...args) => this.toggle(...args)}
          addonInstalled={this.state.item.addonInstalled}
          addonInstalledVersion={this.state.item.addonInstalledVersion}
          icon={this.state.item.screenshot_url}
          relatedItems={this.state.relatedItems}
        />
      );
    }

    return (
      <>
        {this.state.collection === true ? (
          <>
            <Header
              title={variables.getMessage('modals.main.navbar.marketplace')}
              secondaryTitle={this.state.collectionTitle}
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
                label={
                  this.state.busy
                    ? variables.getMessage('modals.main.marketplace.installing')
                    : variables.getMessage('modals.main.marketplace.add_all')
                }
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
                onChange={(value) => this.changeSort(value)}
                items={[
                  { value: 'a-z', text: variables.getMessage('modals.main.addons.sort.a_z') },
                  { value: 'z-a', text: variables.getMessage('modals.main.addons.sort.z_a') },
                ]}
              />
            </div>
          </>
        )}
        {this.props.type === 'collections' && !this.state.collection ? (
          this.state.items.map((item) =>
            !item.news ? (
              <div
                key={item.name}
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
            ) : null,
          )
        ) : (
          <Items
            type={this.props.type}
            items={this.state.items}
            collection={this.state.displayedCollection}
            onCollection={this.state.collection}
            toggleFunction={(input) => this.toggle('item', input)}
            collectionFunction={(input) => this.toggle('collection', input)}
            filter={this.state.filter}
            showCreateYourOwn={true}
          />
        )}
      </>
    );
  }
}

export default Marketplace;
