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
import { useMarketData } from 'features/marketplace/api/MarketplaceDataContext';
import { Carousel } from '../components/Elements/Carousel';

const NewItemPage = () => {
  const { subTab } = useTab();
  const controller = new AbortController();
  const [count, setCount] = useState(5);
  const [item, setItemData] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const { selectedItem } = useMarketData();

  const getName = (name) => {
    const nameMappings = {
      photos: 'photo_packs',
      quotes: 'quote_packs',
      settings: 'preset_settings',
    };
    return nameMappings[name] || name;
  };

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
      return template(variables.getMessage('marketplace:product.sideload_warning'));
    }

    if (this.props.data.data.image_api === true) {
      return template(variables.getMessage('marketplace:product.third_party_api'));
    }

    if (this.props.data.data.language !== undefined && this.props.data.data.language !== null) {
      if (shortLocale !== this.props.data.data.language) {
        return template(variables.getMessage('marketplace:product.not_in_language'));
      }
    }*/

    return null;
  };

  const ItemDetails = () => {
    return (
      <div className="marketplaceDescription">
        <span className="title">
          {variables.getMessage('marketplace:product.details')}
        </span>
        <div className="moreInfo">
          {selectedItem?.updated_at &&
            moreInfoItem(
              <MdCalendarMonth />,
              variables.getMessage('marketplace:product.updated_at'),
              formattedDate,
            )}
          {selectedItem?.quotes &&
            moreInfoItem(
              <MdFormatQuote />,
              variables.getMessage('marketplace:product.no_quotes'),
              selectedItem.quotes.length,
            )}
          {selectedItem?.photos &&
            moreInfoItem(
              <MdImage />,
              variables.getMessage('marketplace:product.no_images'),
              selectedItem.photos.length,
            )}
          {selectedItem?.quotes && selectedItem?.language
            ? moreInfoItem(
                <MdTranslate />,
                variables.getMessage('settings:sections.language.title'),
                languageNames.of(selectedItem.language),
              )
            : null}
          {moreInfoItem(
          <MdStyle />,
          variables.getMessage('settings:sections.background.type.title'),
          variables.getMessage(
            'marketplace:' + getName(selectedItem.type),
          ) || 'marketplace',
        )}
        </div>
      </div>
    );
  };

  const ItemShowcase = () => {
    switch (selectedItem.type) {
      case 'quotes':
        return (
          <>
            <table>
              <tbody>
                <tr>
                  <th>{variables.getMessage('settings:sections.quote.title')}</th>
                  <th>{variables.getMessage('settings:sections.quote.author')}</th>
                </tr>
                {selectedItem.quotes.slice(0, count).map((quote, index) => (
                  <tr key={index}>
                    <td>{quote.quote}</td>
                    <td>{quote.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="showMoreItems">
              <span className="link" onClick={() => count === selectedItem.quotes.length}>
                {count !== selectedItem.quotes.length
                  ? variables.getMessage('marketplace:product.show_all')
                  : variables.getMessage('marketplace:product.show_less')}
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
                  <th>{variables.getMessage('marketplace:product.setting')}</th>
                  <th>{variables.getMessage('marketplace:product.value')}</th>
                </tr>
                {Object.entries(selectedItem.settings)
                  .slice(0, count)
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
                {count !== selectedItem.settings.length
                  ? variables.getMessage('marketplace:product.show_all')
                  : variables.getMessage('marketplace:product.show_less')}
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
  if (selectedItem.updated_at) {
    dateObj = new Date(selectedItem.updated_at);
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
          data={variables.constants.API_URL + '/marketplace/share/' + btoa(selectedItem.name)}
          modalClose={() => setShareModal(false)}
        />
      </Modal>
      {/*<Header
        title={
          this.props.addons
            ? variables.getMessage('addons:added')
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
              variables.getMessage('marketplace:product.created_by'),
              selectedItem.author,
            )}
            {itemWarning()}
          </div>
          {selectedItem.photos && (
            <div className="carousel">
              <div className="carousel_container">
                <Carousel data={selectedItem.photos} />
              </div>
            </div>
          )}
          {/*{selectedItem.settings && (
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
              {variables.getMessage('marketplace:product.description')}
            </span>
            <Markdown>{selectedItem.description}</Markdown>
          </div>
          <ItemShowcase />
          <ItemDetails />
        </div>
        <div
          className="itemInfo"
          style={{
            backgroundImage: `url("${selectedItem.icon_url || placeholderIcon}")`,
          }}
        >
          <div className="front">
            <img
              className="icon"
              alt="icon"
              draggable={false}
              src={selectedItem.icon_url}
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
                label={variables.getMessage('marketplace:product.buttons.addtomue')}
              />
            ) : (
              <p style={{ textAlign: 'center' }}>
                {variables.getMessage(
                  'marketplace:product.buttons.not_available_preview',
                )}
              </p>
            )}
            {selectedItem.sideload !== true && (
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
                    'marketplace:product.buttons.report',
                  )}
                  tooltipKey="report"
                />
              </div>
            )}
            {selectedItem.in_collections?.length > 0 && (
              <div>
                <div className="inCollection">
                  <span className="subtitle">
                    {variables.getMessage('marketplace:product.part_of')}
                  </span>
                  <span
                    className="title"
                    /*onClick={() =>
                      this.props.toggleFunction(
                        'collection',
                        selectedItem.in_collections[0].name,
                      )
                    }*/
                  >
                    {selectedItem.in_collections[0].display_name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/*{moreByCurator.length > 1 && (
        <div className="moreFromCurator">
          <span className="title">
            {variables.getMessage('marketplace:product.more_from_curator', {
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
