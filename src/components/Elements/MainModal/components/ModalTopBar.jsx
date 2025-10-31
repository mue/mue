import variables from 'config/variables';
import { MdClose, MdChevronRight, MdArrowBack, MdArrowForward } from 'react-icons/md';
import { Tooltip, Button } from 'components/Elements';
import { NAVBAR_BUTTONS } from '../constants/tabConfig';
import mueAboutIcon from 'assets/icons/mue_about.png';

// Map marketplace types to translation keys
const MARKETPLACE_TYPE_TO_KEY = {
  photo_packs: 'modals.main.marketplace.photo_packs',
  photos: 'modals.main.marketplace.photo_packs',
  quote_packs: 'modals.main.marketplace.quote_packs',
  quotes: 'modals.main.marketplace.quote_packs',
  preset_settings: 'modals.main.marketplace.preset_settings',
  settings: 'modals.main.marketplace.preset_settings',
  collections: 'modals.main.marketplace.collections',
  all: 'modals.main.marketplace.all',
};

function ModalTopBar({
  currentTab,
  currentSection,
  productView,
  onTabChange,
  onClose,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
}) {
  // Get the current tab label
  const currentTabButton = NAVBAR_BUTTONS.find(({ tab }) => tab === currentTab);
  const currentTabLabel = currentTabButton
    ? variables.getMessage(currentTabButton.messageKey)
    : '';

  // Determine breadcrumb path with click handlers
  const breadcrumbPath = [];

  if (currentTabLabel) {
    breadcrumbPath.push({
      label: currentTabLabel,
      onClick: productView ? productView.onBackToAll : null, // Clickable if viewing a product
    });

    if (productView) {
      console.log('ModalTopBar productView:', productView);
      console.log('fromCollection:', productView.fromCollection, 'isCollection:', productView.isCollection, 'collectionTitle:', productView.collectionTitle);

      // If viewing a collection page itself (not a product within it)
      if (productView.isCollection) {
        // Show: Discover > Collection Name
        breadcrumbPath.push({
          label: productView.collectionTitle || productView.name,
          onClick: null, // Current page - not clickable
        });
      } else {
        // Viewing a product
        // Show: Discover > Collection/Category > Product
        if (productView.fromCollection && productView.collectionTitle) {
          console.log('Showing collection breadcrumb:', productView.collectionTitle);
          // If from a collection, show collection name
          breadcrumbPath.push({
            label: productView.collectionTitle,
            onClick: productView.onBack || null,
          });
        } else {
          console.log('Showing category breadcrumb');
          // Otherwise show category
          const categoryKey = MARKETPLACE_TYPE_TO_KEY[productView.type];
          if (categoryKey) {
            breadcrumbPath.push({
              label: variables.getMessage(categoryKey),
              onClick: productView.onBack || null,
            });
          }
        }
        // Add product name as final breadcrumb
        breadcrumbPath.push({
          label: productView.name,
          onClick: null, // Current item - not clickable
        });
      }
    } else if (currentSection) {
      // Show: Tab > Section
      breadcrumbPath.push({
        label: currentSection,
        onClick: null, // Current section - not clickable
      });
    }
  }

  return (
    <div className="modalTopBar">
      <div className="topBarLeft">
        <div className="navigationButtons">
          <Tooltip title="Back" key="backTooltip">
            <button
              className="navButton"
              onClick={onBack}
              disabled={!canGoBack}
              aria-label="Navigate back"
            >
              <MdArrowBack />
            </button>
          </Tooltip>
          <Tooltip title="Forward" key="forwardTooltip">
            <button
              className="navButton"
              onClick={onForward}
              disabled={!canGoForward}
              aria-label="Navigate forward"
            >
              <MdArrowForward />
            </button>
          </Tooltip>
        </div>
        <img
          src={mueAboutIcon}
          alt="Mue"
          className="topBarLogo"
          draggable={false}
        />
        {breadcrumbPath.length > 0 && (
          <div className="breadcrumbs">
            {breadcrumbPath.map((item, index) => {
              const isLast = index === breadcrumbPath.length - 1;
              const isClickable = item.onClick !== null;

              return (
                <span key={index} className="breadcrumb-segment">
                  <span
                    className={`breadcrumb-item ${isLast ? 'breadcrumb-current' : ''} ${
                      isClickable ? 'breadcrumb-clickable' : ''
                    }`}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </span>
                  {!isLast && <MdChevronRight className="breadcrumb-separator" />}
                </span>
              );
            })}
          </div>
        )}
      </div>
      <div className="topBarRight">
        <div className="topBarNavigation">
          {NAVBAR_BUTTONS.map(({ tab, icon: Icon, messageKey }) => (
            <Button
              key={tab}
              type="navigation"
              onClick={() => onTabChange(tab)}
              active={currentTab === tab}
              icon={<Icon />}
              label={variables.getMessage(messageKey)}
            />
          ))}
        </div>
        <Tooltip title={variables.getMessage('modals.welcome.buttons.close')} key="closeTooltip">
          <span className="closeModal" onClick={onClose}>
            <MdClose />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}

export default ModalTopBar;
