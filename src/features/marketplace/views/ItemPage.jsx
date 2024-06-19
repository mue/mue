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

const ItemPage = () => {
  const { subTab } = useTab();
  const controller = new AbortController();
  const [count, setCount] = useState(5);
  const [item, setItemData] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const { selectedItem } = useMarketData();

  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const installedItems = JSON.parse(localStorage.getItem('installed')) || [];
    const installed = installedItems.some((item) => item.name === selectedItem.name);
    setIsInstalled(installed);
  }, [selectedItem]);

  const installItem = () => {
    const installedItems = JSON.parse(localStorage.getItem('installed')) || [];
    if (!installedItems.some((item) => item.name === selectedItem.name)) {
      installedItems.push(selectedItem);
      localStorage.setItem('installed', JSON.stringify(installedItems));
      setIsInstalled(true);
    }
  };

  const uninstallItem = () => {
    let installedItems = JSON.parse(localStorage.getItem('installed')) || [];
    installedItems = installedItems.filter((item) => item.name !== selectedItem.name);
    localStorage.setItem('installed', JSON.stringify(installedItems));
    setIsInstalled(false);
  };

  const locale = localStorage.getItem('language');
  const shortLocale = locale.includes('-') ? locale.split('-')[0] : locale;
  let languageNames = new Intl.DisplayNames([shortLocale], { type: 'language' });

  let dateObj, formattedDate;
  if (selectedItem?.updated_at) {
    dateObj = new Date(selectedItem?.updated_at);
    formattedDate = new Intl.DateTimeFormat(shortLocale, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }).format(dateObj);
  }

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
    }*/

    if (selectedItem?.image_api === true) {
      return template(variables.getMessage('marketplace:product.third_party_api'));
    }

    if (selectedItem?.language !== undefined && selectedItem?.language !== null) {
      if (shortLocale !== selectedItem?.language) {
        return template(variables.getMessage('marketplace:product.not_in_language'));
      }
    }

    return null;
  };

  const showAndCollapse = (max) => {
    if (count > 5) {
      setCount(5);
    } else {
      setCount(max);
    }
  };

  const ItemDetails = () => {
    return (
      <div className="marketplaceDescription">
        <span className="title">{variables.getMessage('marketplace:product.details')}</span>
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
              selectedItem?.quotes.length,
            )}
          {selectedItem?.photos &&
            moreInfoItem(
              <MdImage />,
              variables.getMessage('marketplace:product.no_images'),
              selectedItem?.photos.length,
            )}
          {selectedItem?.quotes && selectedItem?.language
            ? moreInfoItem(
                <MdTranslate />,
                variables.getMessage('settings:sections.language.title'),
                languageNames.of(selectedItem?.language),
              )
            : null}
          {moreInfoItem(
            <MdStyle />,
            variables.getMessage('settings:sections.background.type.title'),
            variables.getMessage('marketplace:' + getName(selectedItem?.type)) || 'marketplace',
          )}
        </div>
      </div>
    );
  };

  const ItemShowcase = () => {
    switch (selectedItem?.type) {
      case 'quotes':
        return (
          <>
            <table>
              <tbody>
                <tr>
                  <th>{variables.getMessage('settings:sections.quote.title')}</th>
                  <th>{variables.getMessage('settings:sections.quote.author')}</th>
                </tr>
                {selectedItem?.quotes.slice(0, count).map((quote, index) => (
                  <tr key={index}>
                    <td>{quote.quote}</td>
                    <td>{quote.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="showMoreItems">
              <span className="link" onClick={() => showAndCollapse(selectedItem?.quotes.length)}>
                {count !== selectedItem?.quotes.length
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
                {Object.entries(selectedItem?.settings)
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
                {count !== selectedItem?.settings.length
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

  const sidePanel = () => {
    return (
      <div
        className="itemInfo"
        style={{
          backgroundImage: `radial-gradient(circle at center top, ${selectedItem.colour}80, ${selectedItem.colour}20)`,
        }}
      >
        <img
          className="icon"
          alt="icon"
          draggable={false}
          src={selectedItem?.icon_url}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderIcon;
          }}
        />
        {!isInstalled ? (
          <button
            onClick={installItem}
            className="bg-white text-black cursor-pointer transition-all duration-200 rounded-full px-6 py-2 text-base hover:bg-[#ccc]"
          >
            Add To Mue
          </button>
        ) : (
          <button
            onClick={uninstallItem}
            className="bg-white text-black cursor-pointer transition-all duration-200 rounded-full px-6 py-2 text-base hover:bg-[#ccc]"
          >
            Remove
          </button>
        )}
        {localStorage.getItem('welcomePreview') !== 'true' ? (
          <Button
            type="settings"
            onClick={() => this.manage('install')}
            icon={<MdLibraryAdd />}
            label={variables.getMessage('marketplace:product.buttons.addtomue')}
          />
        ) : (
          <p style={{ textAlign: 'center' }}>
            {variables.getMessage('marketplace:product.buttons.not_available_preview')}
          </p>
        )}
        {selectedItem?.sideload !== true && (
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
                  variables.constants.REPORT_ITEM + selectedItem?.display_name.split(' ').join('+'),
                  '_blank',
                )
              }
              icon={<MdFlag />}
              tooltipTitle={variables.getMessage('marketplace:product.buttons.report')}
              tooltipKey="report"
            />
          </div>
        )}
        {selectedItem?.in_collections?.length > 0 && (
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
                        selectedItem?.in_collections[0].name,
                      )
                    }*/
              >
                {selectedItem?.in_collections[0].display_name}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    document.querySelector('#modal').scrollTop = 0;
  });

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
          data={variables.constants.API_URL + '/marketplace/share/' + btoa(selectedItem?.name)}
          modalClose={() => setShareModal(false)}
        />
      </Modal>
      <div className="itemPage">
        <div className="itemShowcase">
          <div className="subHeader">
            {moreInfoItem(
              <MdAccountCircle />,
              variables.getMessage('marketplace:product.created_by'),
              selectedItem?.author,
            )}
            {itemWarning()}
          </div>
          {selectedItem?.photos && (
            <div className="carousel">
              <div className="carousel_container">
                <Carousel data={selectedItem?.photos} />
              </div>
            </div>
          )}
          {selectedItem?.settings && selectedItem?.screenshot_url !== null && (
            <img
              alt="product"
              draggable={false}
              src={selectedItem?.screenshot_url}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderIcon;
              }}
            />
          )}
          <div className="marketplaceDescription">
            <span className="title">{variables.getMessage('marketplace:product.description')}</span>
            <Markdown>{selectedItem?.description}</Markdown>
          </div>
          <ItemShowcase />
          <ItemDetails />
        </div>
        {sidePanel()}
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

export { ItemPage as default, ItemPage };
