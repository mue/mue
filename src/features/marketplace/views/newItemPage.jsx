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
  const [count, setCount] = useState(5);
  const [item, setItemData] = useState(null);
  const [shareModal, setShareModal] = useState(false);

  async function getItemData() {
    let testType = 'quote_packs';
    // Fetch data from API
    const response = await fetch(
      `${variables.constants.API_URL}/marketplace/item/${testType}/${subTab}`,
      {
        signal: controller.signal,
      },
    );
    const item = await response.json();
    console.log(item);

    const { data } = item;

    return {
      data,
    };
  }

  useEffect(() => {
    async function fetchData() {
      const data = await getItemData();
      setItemData(data.data);
    }

    fetchData();
  }, []);

  if (!item) {
    return null; // or a loading spinner
  }

  const {
    onCollection,
    type,
    display_name,
    author,
    description,
    version,
    icon,
    data,
    local,
    slug,
  } = item;

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

  const ItemDetails = () => {
    return (
      <div className="marketplaceDescription">
        <span className="title">
          {variables.getMessage('modals.main.marketplace.product.details')}
        </span>
        <div className="moreInfo">
          {item?.updated_at &&
            moreInfoItem(
              <MdCalendarMonth />,
              variables.getMessage('modals.main.marketplace.product.updated_at'),
              formattedDate,
            )}
          {item?.quotes &&
            moreInfoItem(
              <MdFormatQuote />,
              variables.getMessage('modals.main.marketplace.product.no_quotes'),
              item.quotes.length,
            )}
          {item?.photos &&
            moreInfoItem(
              <MdImage />,
              variables.getMessage('modals.main.marketplace.product.no_images'),
              item.photos.length,
            )}
          {item?.quotes && item?.language
            ? moreInfoItem(
                <MdTranslate />,
                variables.getMessage('modals.main.settings.sections.language.title'),
                languageNames.of(item.language),
              )
            : null}
          {/*{moreInfoItem(
          <MdStyle />,
          variables.getMessage('modals.main.settings.sections.background.type.title'),
          variables.getMessage(
            'modals.main.marketplace.' + this.getName(this.props.data.data.type),
          ) || 'marketplace',
        )}*/}
        </div>
      </div>
    );
  };

  const ItemShowcase = () => {
    switch (item.type) {
      case 'quotes':
        return (
          <>
            <table>
              <tbody>
                <tr>
                  <th>{variables.getMessage('modals.main.settings.sections.quote.title')}</th>
                  <th>{variables.getMessage('modals.main.settings.sections.quote.author')}</th>
                </tr>
                {item.quotes.slice(0, count).map((quote, index) => (
                  <tr key={index}>
                    <td>{quote.quote}</td>
                    <td>{quote.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="showMoreItems">
              <span className="link" onClick={() => count === item.quotes.length}>
                {count !== item.quotes.length
                  ? variables.getMessage('modals.main.marketplace.product.show_all')
                  : variables.getMessage('modals.main.marketplace.product.show_less')}
              </span>
            </div>
          </>
        );
      case 'settings':
        return (
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
        );
      default:
        return null;
    }
  };

  const locale = localStorage.getItem('language');
  const shortLocale = locale.includes('_') ? locale.split('_')[0] : locale;
  let languageNames = new Intl.DisplayNames([shortLocale], { type: 'language' });

  let dateObj, formattedDate;
  if (item.updated_at) {
    dateObj = new Date(item.updated_at);
    formattedDate = new Intl.DateTimeFormat(shortLocale, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }).format(dateObj);
  }

  return (
    <>
      <Modal
        closeTimeoutMS={300}
        isOpen={shareModal}
        className="Modal mainModal"
        overlayClassName="Overlay"
        ariaHideApp={false}
        onRequestClose={() => setShareModal(false)}
      >
        <ShareModal
          data={variables.constants.API_URL + '/marketplace/share/' + btoa(this.props.data.slug)}
          modalClose={() => setShareModal(false)}
        />
      </Modal>
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
              item.author,
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
            <Markdown>{item.description}</Markdown>
          </div>
          <ItemShowcase />
          <ItemDetails />
        </div>
        <div
          className="itemInfo"
          style={{
            backgroundImage: `url("${item.icon_url || placeholderIcon}")`,
          }}
        >
          <div className="front">
            <img
              className="icon"
              alt="icon"
              draggable={false}
              src={item.icon_url}
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
            {item.sideload !== true && (
              <div className="iconButtons">
                <Button
                  type="icon"
                  onClick={() => setShareModal(true)}
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
            )}
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
