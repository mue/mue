import variables from 'config/variables';
import { useTab } from 'components/Elements/MainModal/backend/TabContext';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';
import { useEffect, useState } from 'react';
import { ShareModal } from 'components/Elements';
import {
  MdIosShare,
  MdFlag,
  MdAccountCircle,
  MdCalendarMonth,
  MdFormatQuote,
  MdImage,
  MdTranslate,
  MdOutlineWarning,
  MdStyle,
  MdClose,
  MdLibraryAdd,
} from 'react-icons/md';
import { Header } from 'components/Layout/Settings';
import Modal from 'react-modal';
import Markdown from 'markdown-to-jsx';
import { Button } from 'components/Elements';

const NewItemPage = () => {
  const { subTab } = useTab();
  const controller = new AbortController();
  const [itemName, setItemName] = useState('');
  const [ItemDescription, setItemDescription] = useState('');
  const [ItemAuthor, setItemAuthor] = useState('');
  const [ItemType, setItemType] = useState('');
  const [ItemIcon, setItemIcon] = useState('');
  const [count, setCount] = useState(5);
  let quotes = [];
  let ItemData;
  //const [ItemData, setItemData] = useState([]);

  async function getItemData() {
    const item = await (
      await fetch(`${variables.constants.API_URL}/marketplace/item/quote_packs/${subTab}`, {
        signal: controller.signal,
      })
    ).json();
    console.log(item);

    setItemName(item.data.display_name);
    setItemType(item.data.type);
    setItemDescription(item.data.description);
    setItemAuthor(item.data.author);
    setItemType(item.data.type);
    setItemIcon(item.data.icon_url);
    console.log(ItemType)
    if (ItemType === 'quotes') {
      quotes = item.data.quotes
      console.log(quotes)
    }
    ItemData = item.data.data;
  }

  useEffect(() => {
    getItemData();
  }, []);

  const moreInfoItem = (icon, header, text) => (
    <div className="infoItem">
      {icon}
      <div className="text">
        <span className="header">{header}</span>
        <span>{text}</span>
      </div>
    </div>
  );

  const itemWarning = () => {
    const template = (message) => (
      <div className="itemWarning">
        <MdOutlineWarning />
        <div className="text">
          <span className="header">Warning</span>
          <span>{message}</span>
        </div>
      </div>
    );

    /*if (this.props.data.data.sideload === true) {
      return template(variables.getMessage('modals.main.marketplace.product.sideload_warning'));
    }

    if (this.props.data.data.image_api === true) {
      return template(variables.getMessage('modals.main.marketplace.product.third_party_api'));
    }

    if (this.props.data.data.language !== undefined && this.props.data.data.language !== null) {
      if (shortLocale !== this.props.data.data.language) {
        return template(variables.getMessage('modals.main.marketplace.product.not_in_language'));
      }
    }*/

    return null;
  };

  {
    /*async function toggle(pageType, data) {
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
  }*/
  }

  return (
    <>
      {/*<Modal
        closeTimeoutMS={300}
        isOpen={this.state.shareModal}
        className="Modal mainModal"
        overlayClassName="Overlay"
        ariaHideApp={false}
        onRequestClose={() => this.setState({ shareModal: false })}
      >
        <ShareModal
          data={variables.constants.API_URL + '/marketplace/share/' + btoa(this.props.data.slug)}
          modalClose={() => this.setState({ shareModal: false })}
        />
      </Modal>*/}
      {/*<Header
        title={
          this.props.addons
            ? variables.getMessage('modals.main.addons.added')
            : this.props.data.onCollection && this.props.data.data.in_collections?.length > 0
              ? this.props.data.data.in_collections[0].display_name
              : variables.getMessage('modals.main.navbar.marketplace')
        }
        secondaryTitle={
          this.props.data.data.sideload
            ? this.props.data.data.name
            : this.props.data.data.display_name
        }
        report={false}
        goBack={this.props.toggleFunction}
      />*/}
      <div className="itemPage">
        <div className="itemShowcase">
          <div className="subHeader">
            {moreInfoItem(
              <MdAccountCircle />,
              variables.getMessage('modals.main.marketplace.product.created_by'),
              ItemAuthor,
            )}
            {itemWarning()}
          </div>
          {/*{this.props.data.data.photos && (
            <div className="carousel">
              <div className="carousel_container">
                <Carousel data={this.props.data.data.photos} />
              </div>
            </div>
          )}
          {this.props.data.data.settings && (
            <img
              alt="product"
              draggable={false}
              src={iconsrc}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderIcon;
              }}
            />
          )}*/}
          <div className="marketplaceDescription">
            <span className="title">
              {variables.getMessage('modals.main.marketplace.product.description')}
            </span>
            <Markdown>{ItemDescription}</Markdown>
          </div>
          {quotes[0]}
          {ItemType === 'quotes' && (
            <>
              <table>
                <tbody>
                  <tr>
                    <th>{variables.getMessage('modals.main.settings.sections.quote.title')}</th>
                    <th>{variables.getMessage('modals.main.settings.sections.quote.author')}</th>
                  </tr>
                  {quotes.slice(0, count).map((quote, index) => (
                    <tr key={index}>
                      <td>{quote.quote}</td>
                      <td>{quote.author}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="showMoreItems">
                <span className="link" onClick={() => count === quotes.length}>
                  {count !== quotes.length
                    ? variables.getMessage('modals.main.marketplace.product.show_all')
                    : variables.getMessage('modals.main.marketplace.product.show_less')}
                </span>
              </div>
            </>
          )}
          {/*{this.props.data.data.settings && (
            <>
              <table>
                <tbody>
                  <tr>
                    <th>{variables.getMessage('modals.main.marketplace.product.setting')}</th>
                    <th>{variables.getMessage('modals.main.marketplace.product.value')}</th>
                  </tr>
                  {Object.entries(this.props.data.data.settings)
                    .slice(0, this.state.count)
                    .map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="showMoreItems">
                <span className="link" onClick={() => this.incrementCount('settings')}>
                  {this.state.count !== this.props.data.data.settings.length
                    ? variables.getMessage('modals.main.marketplace.product.show_all')
                    : variables.getMessage('modals.main.marketplace.product.show_less')}
                </span>
              </div>
            </>
          )}*/}
          <div className="marketplaceDescription">
            <span className="title">
              {variables.getMessage('modals.main.marketplace.product.details')}
            </span>
            <div className="moreInfo">
              {/*{this.props.data.data.updated_at &&
                moreInfoItem(
                  <MdCalendarMonth />,
                  variables.getMessage('modals.main.marketplace.product.updated_at'),
                  formattedDate,
                )}*/}
              {ItemData?.quotes &&
                moreInfoItem(
                  <MdFormatQuote />,
                  variables.getMessage('modals.main.marketplace.product.no_quotes'),
                  ItemData.quotes.length,
                )}
              {ItemData?.photos &&
                moreInfoItem(
                  <MdImage />,
                  variables.getMessage('modals.main.marketplace.product.no_images'),
                  ItemData.photos.length,
                )}
              {/*{ItemData.quotes && ItemData.language
                ? moreInfoItem(
                    <MdTranslate />,
                    variables.getMessage('modals.main.settings.sections.language.title'),
                    languageNames.of(this.props.data.data.language),
                  )
                : null}
              {moreInfoItem(
                <MdStyle />,
                variables.getMessage('modals.main.settings.sections.background.type.title'),
                variables.getMessage(
                  'modals.main.marketplace.' + this.getName(this.props.data.data.type),
                ) || 'marketplace',
              )}*/}
            </div>
          </div>
        </div>
        <div
          className="itemInfo"
          style={{
            backgroundImage: `url("${ItemIcon}")`,
          }}
        >
          <div className="front">
            <img
              className="icon"
              alt="icon"
              draggable={false}
              src={ItemIcon}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderIcon;
              }}
            />
            {localStorage.getItem('welcomePreview') !== 'true' ? (
              <Button
                type="settings"
                onClick={() => this.manage('install')}
                icon={<MdLibraryAdd />}
                label={variables.getMessage('modals.main.marketplace.product.buttons.addtomue')}
              />
            ) : (
              <p style={{ textAlign: 'center' }}>
                {variables.getMessage(
                  'modals.main.marketplace.product.buttons.not_available_preview',
                )}
              </p>
            )}
            {/*{this.props.data.data.sideload !== true && (
              <div className="iconButtons">
                <Button
                  type="icon"
                  onClick={() => this.setState({ shareModal: true })}
                  icon={<MdIosShare />}
                  tooltipTitle={variables.getMessage('widgets.quote.share')}
                  tooltipKey="share"
                />
                <Button
                  type="icon"
                  onClick={() =>
                    window.open(
                      variables.constants.REPORT_ITEM +
                        this.props.data.data.display_name.split(' ').join('+'),
                      '_blank',
                    )
                  }
                  icon={<MdFlag />}
                  tooltipTitle={variables.getMessage(
                    'modals.main.marketplace.product.buttons.report',
                  )}
                  tooltipKey="report"
                />
              </div>
            )}*/}
            {/*}
            {this.props.data.data.in_collections?.length > 0 && (
              <div>
                <div className="inCollection">
                  <span className="subtitle">
                    {variables.getMessage('modals.main.marketplace.product.part_of')}
                  </span>
                  <span
                    className="title"
                    onClick={() =>
                      this.props.toggleFunction(
                        'collection',
                        this.props.data.data.in_collections[0].name,
                      )
                    }
                  >
                    {this.props.data.data.in_collections[0].display_name}
                  </span>
                </div>
              </div>
            )}*/}
          </div>
        </div>
      </div>
      {/*{moreByCurator.length > 1 && (
        <div className="moreFromCurator">
          <span className="title">
            {variables.getMessage('modals.main.marketplace.product.more_from_curator', {
              name: this.props.data.author,
            })}
          </span>
          <div>
            <Items
              isCurator={true}
              type={this.props.data.data.type}
              items={moreByCurator}
              onCollection={this.state.collection}
              toggleFunction={(input) => this.props.toggleFunction('item', input)}
              collectionFunction={(input) => this.props.toggleFunction('collection', input)}
              filter={''}
              moreByCreator={true}
              showCreateYourOwn={false}
            />
          </div>
        </div>
      )}*/}
    </>
  );
};

export { NewItemPage as default, NewItemPage };
