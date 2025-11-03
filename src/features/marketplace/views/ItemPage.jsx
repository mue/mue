import variables from 'config/variables';
import { useState, Fragment } from 'react';
import { toast } from 'react-toastify';
import { MdIosShare, MdFlag, MdAccountCircle } from 'react-icons/md';
import Modal from 'react-modal';

import { Button } from 'components/Elements';

import { install, uninstall } from 'utils/marketplace';
import { ShareModal } from 'components/Elements';
import placeholderIcon from 'assets/icons/marketplace-placeholder.png';
import { Items } from '../components/Items/Items';

// Tab components
import OverviewTab from './components/OverviewTab';
import QuotesTab from './components/QuotesTab';
import PhotosTab from './components/PhotosTab';
import PresetsTab from './components/PresetsTab';

// Helper components
import InfoItem from './components/InfoItem';
import WarningBanner from './components/WarningBanner';

const ItemPage = (props) => {
  const [showUpdateButton, setShowUpdateButton] = useState(
    props.addonInstalled === true && props.addonInstalledVersion !== props.data.version,
  );
  const [shareModal, setShareModal] = useState(false);
  const [count, setCount] = useState(5);
  const [activeTab, setActiveTab] = useState('overview');

  const updateAddon = () => {
    uninstall(props.data.type, props.data.display_name);
    install(props.data.type, props.data);
    toast(variables.getMessage('toasts.updated'));
    setShowUpdateButton(false);
  };

  const incrementCount = (type) => {
    const data = props.data.data;
    let length;

    if (type === 'quotes' && Array.isArray(data.quotes)) {
      length = data.quotes.length;
    } else if (type === 'settings' && data.settings) {
      length = Object.keys(data.settings).length;
    } else {
      return;
    }

    const newCount = count !== length ? length : 5;
    setCount(newCount);
  };

  const getName = (name) => {
    const nameMappings = {
      photos: 'photo_packs',
      quotes: 'quote_packs',
      settings: 'preset_settings',
    };
    return nameMappings[name] || name;
  };

  const locale = localStorage.getItem('language');
  const shortLocale = locale.includes('_') ? locale.split('_')[0] : locale;
  const languageNames = new Intl.DisplayNames([shortLocale], { type: 'language' });

  // Extract colour from data (British spelling as used in API)
  const mainColor = props.data.data.colour;

  // Helper function to determine if a color is light or dark
  const isLightColor = (hexColor) => {
    if (!hexColor) return false;
    // Remove # if present
    const hex = hexColor.replace('#', '');
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Calculate relative luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6; // If > 0.6, it's a light color
  };

  const isLight = isLightColor(mainColor);
  const textColor = isLight ? '#000000' : '#ffffff';

  const quotes = Array.isArray(props.data.data.quotes) ? props.data.data.quotes : [];
  const photos = Array.isArray(props.data.data.photos) ? props.data.data.photos : [];
  const settings = props.data.data.settings;
  const hasPhotos = photos.length > 0;
  const hasQuotes = quotes.length > 0;
  const hasSettings = !!settings;

  // Format date for details section
  let formattedDate = '';
  if (props.data.data.updated_at) {
    const dateObj = new Date(props.data.data.updated_at);
    formattedDate = new Intl.DateTimeFormat(shortLocale, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }).format(dateObj);
  }

  // Create dynamic styles for theming with the main color
  const themedStyles = mainColor ? (
    <style>{`
      /* Icon buttons styling */
      .iconButtons .btn-icon {
        background: ${mainColor} !important;
        background-image: none !important;
        border-color: ${mainColor} !important;
        box-shadow: 0 0 0 1px ${mainColor}, 0 4px 12px ${mainColor}40 !important;
        color: ${textColor} !important;
      }
      .iconButtons .btn-icon:hover {
        background: ${mainColor} !important;
        filter: brightness(${isLight ? '0.95' : '1.15'});
        transform: translateY(-2px);
        box-shadow: 0 0 0 1px ${mainColor}, 0 6px 20px ${mainColor}60 !important;
      }

      /* ItemInfo background gradient */
      .itemInfo {
        background: linear-gradient(135deg, ${mainColor}ee 0%, ${mainColor}aa 50%, ${mainColor}66 100%) !important;
        box-shadow: 0 8px 32px ${mainColor}40 !important;
      }

      /* Icon shadow */
      .itemInfo .icon {
        box-shadow: 0 8px 32px ${mainColor}80, 0 0 0 1px ${mainColor}40 !important;
      }

      /* Install button styling */
      .itemInfo .installButton {
        background: ${mainColor} !important;
        background-image: linear-gradient(135deg, ${mainColor} 0%, ${mainColor}dd 100%) !important;
        box-shadow: 0 4px 16px ${mainColor}60 !important;
      }

      .itemInfo .installButton:hover {
        background: ${mainColor} !important;
        filter: brightness(${isLight ? '0.95' : '1.15'});
        box-shadow: 0 6px 24px ${mainColor}80 !important;
      }

      /* Install button text and icon color */
      .itemInfo .installButton span,
      .itemInfo .installButton svg {
        color: ${textColor} !important;
      }

      /* Mue logo - circle matches text color, paths match button color */
      .itemInfo .installButton .mueLogo circle {
        fill: ${textColor} !important;
      }

      .itemInfo .installButton .mueLogo path {
        fill: ${mainColor} !important;
      }

      /* Remove the default gradient animation when themed */
      .itemInfo .installButton.installed {
        background: ${mainColor}aa !important;
        background-image: none !important;
      }

      .itemInfo .installButton.installed:hover {
        background: ${mainColor}99 !important;
      }
    `}</style>
  ) : null;

  if (!props.data.display_name) {
    return null;
  }

  let updateButton;
  if (showUpdateButton) {
    updateButton = (
      <Fragment key="update">
        <Button
          type="settings"
          onClick={() => updateAddon()}
          label={variables.getMessage('modals.main.addons.product.buttons.update_addon')}
        />
      </Fragment>
    );
  }

  // prevent console error
  let iconsrc = props.data.icon;
  if (!props.data.icon) {
    iconsrc = null;
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
          data={variables.constants.API_URL + '/marketplace/share/' + btoa(props.data.api_name)}
          modalClose={() => setShareModal(false)}
        />
      </Modal>
      {/* <Header
        title={
          props.addons
            ? variables.getMessage('modals.main.addons.added')
            : props.data.onCollection && props.data.data.in_collections?.length > 0
              ? props.data.data.in_collections[0].display_name
              : variables.getMessage('modals.main.navbar.marketplace')
        }
        secondaryTitle={
          props.data.data.sideload
            ? props.data.data.name
            : props.data.data.display_name
        }
        report={false}
        goBack={props.toggleFunction}
      /> */}
      <div className="itemPage">
        <aside className="itemInfo">
          <div className="front">
            <img
              className="icon"
              alt="icon"
              draggable={false}
              src={props.data.data.icon_url}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderIcon;
              }}
            />
            {localStorage.getItem('welcomePreview') !== 'true' ? (
              <>
                {props.button}
                {updateButton}
              </>
            ) : (
              <p style={{ textAlign: 'center' }}>
                {variables.getMessage('modals.main.marketplace.product.buttons.not_available_preview')}
              </p>
            )}
            {props.data.data.sideload !== true && (
              <>
                {themedStyles}
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
                          props.data.data.display_name.split(' ').join('+'),
                        '_blank',
                      )
                    }
                    icon={<MdFlag />}
                    tooltipTitle={variables.getMessage('modals.main.marketplace.product.buttons.report')}
                    tooltipKey="report"
                  />
                </div>
              </>
            )}
            {props.data.data.in_collections?.length > 0 && (
              <div className="inCollection">
                <span className="subtitle">
                  {variables.getMessage('modals.main.marketplace.product.part_of')}
                </span>
                <span
                  className="title"
                  onClick={() =>
                    props.toggleFunction('collection', props.data.data.in_collections[0].name)
                  }
                >
                  {props.data.data.in_collections[0].display_name}
                </span>
              </div>
            )}
          </div>
        </aside>
        <div className="itemContent">
          <div className="itemTop">
            <div className="subHeader">
              <InfoItem
                icon={<MdAccountCircle />}
                header={variables.getMessage('modals.main.marketplace.product.created_by')}
                text={props.data.author}
              />
              <WarningBanner data={props.data.data} shortLocale={shortLocale} />
            </div>
            <div className="itemTabs">
              <button
                type="button"
                className={`itemTab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                {variables.getMessage('modals.main.marketplace.product.overview_tab') || 'Overview'}
              </button>
              {hasQuotes && (
                <button
                  type="button"
                  className={`itemTab ${activeTab === 'quotes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('quotes')}
                >
                  {variables.getMessage('modals.main.marketplace.product.quotes_tab') || 'Quotes'}
                </button>
              )}

              {hasPhotos && (
                <button
                  type="button"
                  className={`itemTab ${activeTab === 'photos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('photos')}
                >
                  {variables.getMessage('modals.main.marketplace.product.photos_tab') || 'Photos'}
                </button>
              )}

              {hasSettings && (
                <button
                  type="button"
                  className={`itemTab ${activeTab === 'presets' ? 'active' : ''}`}
                  onClick={() => setActiveTab('presets')}
                >
                  {variables.getMessage('modals.main.marketplace.product.presets_tab') || 'Presets'}
                </button>
              )}
            </div>
          </div>
          <div className="tabContent">
            {activeTab === 'overview' && (
              <OverviewTab
                data={props.data.data}
                description={props.data.description}
                iconsrc={iconsrc}
                shortLocale={shortLocale}
                languageNames={languageNames}
                formattedDate={formattedDate}
                getName={getName}
                count={count}
                onIncrementCount={(type) => incrementCount(type)}
              />
            )}
            {activeTab === 'quotes' && hasQuotes && (
              <QuotesTab
                quotes={quotes}
                count={count}
                onIncrementCount={(type) => incrementCount(type)}
              />
            )}
            {activeTab === 'photos' && hasPhotos && <PhotosTab photos={photos} />}
            {activeTab === 'presets' && hasSettings && (
              <PresetsTab
                settings={settings}
                count={count}
                onIncrementCount={(type) => incrementCount(type)}
              />
            )}
          </div>
        </div>
      </div>
      {/* {moreByCurator.length > 1 && (
        <div className="moreFromCurator">
          <span className="title">
            {variables.getMessage('modals.main.marketplace.product.more_from_curator', {
              name: props.data.author,
            })}
          </span>
          <div>
            <Items
              isCurator={true}
              type={props.data.data.type}
              items={moreByCurator}
              onCollection={state.collection}
              toggleFunction={(input) => props.toggleFunction('item', input)}
              collectionFunction={(input) => props.toggleFunction('collection', input)}
              filter={''}
              moreByCreator={true}
              showCreateYourOwn={false}
            />
          </div>
        </div>
      )} */}
      {props.relatedItems && props.relatedItems.length > 0 && (
        <div className="moreFromCurator">
          <span className="title">
            {variables.getMessage('modals.main.marketplace.you_might_also_like') ||
              'You might also like'}
          </span>
          <div>
            <Items
              type={props.data.data.type}
              items={props.relatedItems}
              onCollection={false}
              toggleFunction={(input) => props.toggleFunction('item', input)}
              collectionFunction={(input) => props.toggleFunction('collection', input)}
              filter={''}
              moreByCreator={false}
              showCreateYourOwn={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export { ItemPage as default, ItemPage };
