import variables from 'config/variables';
import { useState, useEffect } from 'react';
import { MdWifiOff, MdLocalMall, MdOutlineArrowForward, MdLibraryAdd } from 'react-icons/md';

import ItemPage from './oldItemPage';
import Items from '../components/Items/OldItems';

import { Header } from 'components/Layout/Settings';
import { Button } from 'components/Elements';

import { sortItems } from '../api';

import { useTab } from 'components/Elements/MainModal/backend/TabContext';

function Marketplace() {
  const [items, setItems] = useState([]);
  const [done, setDone] = useState(false);
  const [item, setItem] = useState({});
  const [collection, setCollection] = useState({});
  const [filter, setFilter] = useState('');
  const [type, setType] = useState('all');
  const [busy, setBusy] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState('');
  const { changeTab } = useTab();

  const controller = new AbortController();
  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, []);

  async function toggle(pageType, data) {
    if (pageType === 'item') {
      const toggleType = type === 'all' || type === 'collections' ? data.type : type;
      const item = await (
        await fetch(`${variables.constants.API_URL}/marketplace/item/${toggleType}/${data.name}`, {
          signal: controller.signal,
        })
      ).json();

      if (controller.signal.aborted === true) {
        return;
      }

      // check if already installed
      let addonInstalled = false;
      let addonInstalledVersion;
      const installed = JSON.parse(localStorage.getItem('installed'));
      if (installed.some((item) => item.name === item.data.name)) {
        addonInstalled = true;
        for (let i = 0; i < installed.length; i++) {
          if (installed[i].name === item.data.name) {
            addonInstalledVersion = installed[i].version;
            break;
          }
        }
      }

      setItem({
        onCollection: data._onCollection,
        type: item.data.type,
        display_name: item.data.name,
        author: item.data.author,
        description: item.data.description,
        version: item.data.version,
        icon: item.data.screenshot_url,
        data: item.data,
        local: {
          installed: addonInstalled,
          version: addonInstalledVersion,
        },
        slug: data.name,
      });

      setType('item');

      variables.stats.postEvent('marketplace-item', `${item.display_name} viewed`);
    } else if (pageType === 'collection') {
      setDone(false);
      setItem({});

      const collection = await (
        await fetch(`${variables.constants.API_URL}/marketplace/collection/${data}`, {
          signal: controller.signal,
        })
      ).json();

      setItems(collection.data.items);
      setCollection({
        visible: true,
        title: collection.data.display_name,
        description: collection.data.description,
        img: collection.data.img,
      });

      setType('collection');
    } else {
      setItem({});
      setCollection({});
      setType('normal');
    }
  }

  async function getItems() {
    setDone(false);
    const dataURL =
      variables.constants.API_URL +
      (type === 'collections' ? '/marketplace/collections' : '/marketplace/items/' + type);

    const { data } = await (
      await fetch(dataURL, {
        signal: controller.signal,
      })
    ).json();

    if (controller.signal.aborted === true) {
      return;
    }

    setItems(sortItems(data, 'z-a'));
    setDone(true);
  }

  async function getCollections() {
    setDone(false);

    const { data } = await (
      await fetch(variables.constants.API_URL + '/marketplace/collections', {
        signal: controller.signal,
      })
    ).json();

    setItems(data);
    setDone(true);
  }

  function returnToMain() {
    setCollection(false);
  }

  useEffect(() => {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      return;
    }

    getItems();
  }, []);

  useEffect(() => {
    // stop making requests
    return () => controller.abort();
  }, []);

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
        <span className="title">{variables.getMessage('marketplace:offline.title')}</span>
        <span className="subtitle">{variables.getMessage('marketplace:offline.description')}</span>
      </>,
    );
  }

  if (done === false) {
    return errorMessage(
      <div className="loaderHolder">
        <div id="loader"></div>
        <span className="subtitle">{variables.getMessage('modals.main.loading')}</span>
      </div>,
    );
  }

  if (!items || items?.length === 0) {
    getItems();
    return errorMessage(
      <>
        <MdLocalMall />
        <span className="title">{variables.getMessage('addons:empty.title')}</span>
        <span className="subtitle">{variables.getMessage('marketplace:no_items')}</span>
      </>,
    );
  }

  if (item.display_name) {
    return (
      <ItemPage
        data={item}
        toggleFunction={(...args) => toggle(...args)}
        icon={item.screenshot_url}
      />
    );
  }

  return (
    <>
      <h1
        onClick={() =>
          changeTab('settings', variables.getMessage('settings:sections.changelog.title'))
        }
      >
        See changelog
      </h1>
      {collection === true ? (
        <>
          <Header
            title={variables.getMessage('modals.main.navbar.marketplace')}
            secondaryTitle={collectionTitle}
            report={false}
            goBack={() => returnToMain()}
          />
          <div
            className="collectionPage"
            style={
              {
                //  backgroundImage: `linear-gradient(to bottom, transparent, black), url('${collectionImg}')`,
              }
            }
          >
            <div className="nice-tag">{variables.getMessage('marketplace:collection')}</div>
            <div className="content">
              <span className="mainTitle">{collectionTitle}</span>={' '}
            </div>

            <Button
              type="collection"
              onClick={() => installCollection()}
              disabled={busy}
              icon={<MdLibraryAdd />}
              label={
                busy
                  ? variables.getMessage('marketplace:installing')
                  : variables.getMessage('marketplace:add_all')
              }
            />
          </div>
        </>
      ) : (
        <>
          {/*<div className="flexTopMarketplace">
            <span className="mainTitle">
              {variables.getMessage('modals.main.navbar.marketplace')}
            </span>
          </div>
          <div className="headerExtras marketplaceCondition">
            {type !== 'collections' && (
              <div>
                <form className="max-w-md mx-auto relative">
                  <input
                    label={variables.getMessage('widgets.search')}
                    placeholder={variables.getMessage('widgets.search')}
                    name="filter"
                    id="filter"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    className="block w-full px-4 py-3 ps-10 text-sm text-gray-900 border border-[#484848] rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-white/5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-neutral-100"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <MdSearch />
                  </div>
                </form>
              </div>
            )}
            <Dropdown
              label={variables.getMessage('addons:sort.title')}
              name="sortMarketplace"
              onChange={(value) => changeSort(value
              items)}
              items={[
                {
                  value: 'a-z',
                  text: variables.getMessage('addons:sort.a_z'),
                },
                {
                  value: 'z-a',
                  text: variables.getMessage('addons:sort.z_a'),
                },
              ]}
            />

          </div>*/}
        </>
      )}

      {type === 'collections' && !collection ? (
        items.map((item) =>
          !item.news ? (
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
                onClick={() => toggle('collection', item.name)}
                icon={<MdOutlineArrowForward />}
                label={variables.getMessage('marketplace:explore_collection')}
                iconPlacement="right"
              />
            </div>
          ) : null,
        )
      ) : (
        <Items
          type={type}
          items={items}
          toggleFunction={(input) => toggle('item', input)}
          filter={filter}
          showCreateYourOwn={true}
        />
      )}
    </>
  );
}

export default Marketplace;
