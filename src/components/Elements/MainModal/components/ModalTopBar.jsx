import { useT } from 'contexts/TranslationContext';
import { useState, useEffect } from 'react';
import { MdClose, MdChevronRight, MdArrowBack, MdArrowForward } from 'react-icons/md';
import { Tooltip, Button } from 'components/Elements';
import { NAVBAR_BUTTONS, TAB_TYPES } from '../constants/tabConfig';
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
  currentSectionName,
  currentSubSection,
  productView,
  iframeBreadcrumbs,
  onTabChange,
  onSubSectionChange,
  onClose,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
}) {
  const t = useT();

  // Track installed addons count for badge
  const [installedCount, setInstalledCount] = useState(() => {
    try {
      const installed = JSON.parse(localStorage.getItem('installed')) || [];
      return installed.length;
    } catch (e) {
      return 0;
    }
  });

  useEffect(() => {
    const updateCount = () => {
      try {
        const installed = JSON.parse(localStorage.getItem('installed')) || [];
        setInstalledCount(installed.length);
      } catch (e) {
        setInstalledCount(0);
      }
    };

    // Listen for storage events (changes from other tabs)
    window.addEventListener('storage', updateCount);

    // Listen for custom event for same-tab updates
    window.addEventListener('installedAddonsChanged', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('installedAddonsChanged', updateCount);
    };
  }, []);

  // Get the current tab label
  const currentTabButton = NAVBAR_BUTTONS.find(({ tab }) => tab === currentTab);
  const currentTabLabel = currentTabButton ? t(currentTabButton.messageKey) : '';

  // Utility function to get translated sub-section label
  const getSubSectionLabel = (subSection, sectionName) => {
    if (!subSection || !sectionName) return subSection;

    // Use the same translation pattern as the section components
    const translationKey = `modals.main.settings.sections.${sectionName}.${subSection}.title`;
    const translated = t(translationKey);

    // If translation key is returned as-is or empty, it means translation doesn't exist
    // Fall back to capitalized sub-section name
    if (!translated || translated === translationKey) {
      return subSection.charAt(0).toUpperCase() + subSection.slice(1);
    }

    return translated;
  };

  // Determine breadcrumb path with click handlers
  const breadcrumbPath = [];

  if (currentTabLabel) {
    breadcrumbPath.push({
      label: currentTabLabel,
      onClick: productView ? productView.onBackToAll : null, // Clickable if viewing a product
    });

    // Check if we have iframe breadcrumbs (from Discover iframe)
    // If so, only use the last item (the item name) and keep our section
    if (iframeBreadcrumbs && iframeBreadcrumbs.length > 0) {
      // Get the last breadcrumb item (the item name)
      const lastCrumb = iframeBreadcrumbs[iframeBreadcrumbs.length - 1];

      // Add current section if available and different from the last crumb
      if (currentSection && currentSection !== lastCrumb.label) {
        breadcrumbPath.push({
          label: currentSection,
          onClick: () => onBack(), // Clickable to go back
        });
      }

      // Add the item name from iframe
      breadcrumbPath.push({
        label: lastCrumb.label,
        onClick: null, // Current item - not clickable
      });
    } else if (productView) {
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
          // If from a collection, show collection name
          breadcrumbPath.push({
            label: productView.collectionTitle,
            onClick: productView.onBack || null,
          });
        } else {
          // Otherwise show category
          const categoryKey = MARKETPLACE_TYPE_TO_KEY[productView.type];
          if (categoryKey) {
            breadcrumbPath.push({
              label: t(categoryKey),
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
      // Show: Tab > Section or Tab > Section > Sub-Section
      breadcrumbPath.push({
        label: currentSection,
        onClick: currentSubSection ? () => onSubSectionChange(null) : null, // Clickable if sub-section is active
      });

      // Add sub-section if present
      if (currentSubSection) {
        breadcrumbPath.push({
          label: getSubSectionLabel(currentSubSection, currentSectionName),
          onClick: null, // Current sub-section - not clickable
        });
      }
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
          <nav className="breadcrumbs" aria-label="Breadcrumb navigation">
            {breadcrumbPath.map((item, index) => {
              const isLast = index === breadcrumbPath.length - 1;
              const isClickable = item.onClick !== null;

              return (
                <span key={index} className="breadcrumb-segment">
                  {isClickable ? (
                    <span
                      className={`breadcrumb-item breadcrumb-clickable`}
                      onClick={item.onClick}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          item.onClick();
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Navigate to ${item.label}`}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <span
                      className={`breadcrumb-item ${isLast ? 'breadcrumb-current' : ''}`}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                  {!isLast && <MdChevronRight className="breadcrumb-separator" aria-hidden="true" />}
                </span>
              );
            })}
          </nav>
        )}
      </div>
      <div className="topBarRight">
        <div className="topBarNavigation">
          {NAVBAR_BUTTONS.map(({ tab, icon: Icon, messageKey }) => {
            // Show badge for Library tab when there are installed addons
            const badgeValue = tab === TAB_TYPES.LIBRARY && installedCount > 0 ? installedCount : undefined;

            return (
              <Button
                key={tab}
                type="navigation"
                onClick={() => onTabChange(tab)}
                active={currentTab === tab}
                icon={<Icon />}
                label={t(messageKey)}
                badge={badgeValue}
              />
            );
          })}
        </div>
        <Tooltip title={t('modals.welcome.buttons.close')} key="closeTooltip">
          <span className="closeModal" onClick={onClose}>
            <MdClose />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}

export default ModalTopBar;
