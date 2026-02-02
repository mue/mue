import { useT } from 'contexts/TranslationContext';
import { useState, useEffect } from 'react';
import { MdClose, MdChevronRight, MdArrowBack, MdArrowForward } from 'react-icons/md';
import { Tooltip, Button } from 'components/Elements';
import { NAVBAR_BUTTONS, TAB_TYPES } from '../constants/tabConfig';
import { updateHash } from 'utils/deepLinking';
import mueAboutIcon from 'assets/icons/mue_about.png';

// Map marketplace types to translation keys
const MARKETPLACE_TYPE_TO_KEY = {
  photo_packs: 'modals.main.marketplace.photo_packs',
  'photo packs': 'modals.main.marketplace.photo_packs',
  photos: 'modals.main.marketplace.photo_packs',
  quote_packs: 'modals.main.marketplace.quote_packs',
  'quote packs': 'modals.main.marketplace.quote_packs',
  quotes: 'modals.main.marketplace.quote_packs',
  preset_settings: 'modals.main.marketplace.preset_settings',
  'preset settings': 'modals.main.marketplace.preset_settings',
  settings: 'modals.main.marketplace.preset_settings',
  collections: 'modals.main.marketplace.collections',
  all: 'modals.main.marketplace.all',
};

// Map breadcrumb labels (from website) to category keys for navigation
const BREADCRUMB_LABEL_TO_CATEGORY = {
  'photo packs': 'photo_packs',
  'quote packs': 'quote_packs',
  'preset settings': 'preset_settings',
  collections: 'collections',
  marketplace: 'all',
};

function ModalTopBar({
  currentTab,
  currentSection,
  currentSectionName,
  currentSubSection,
  productView,
  iframeBreadcrumbs,
  onTabChange,
  onSectionChange,
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
      // Make "Discover" clickable when viewing items/categories to go back to "All"
      onClick:
        (iframeBreadcrumbs && iframeBreadcrumbs.length > 0) || productView
          ? () => {
              updateHash('#discover/all');
            }
          : null,
    });

    // Check if we have iframe breadcrumbs (from Discover iframe)
    if (iframeBreadcrumbs && iframeBreadcrumbs.length > 0) {
      // Use all iframe breadcrumbs except the first one (which is usually "Marketplace" or the category)
      // Skip the first breadcrumb as it's redundant with our tab label
      const relevantCrumbs = iframeBreadcrumbs.slice(1);

      relevantCrumbs.forEach((crumb, index) => {
        const isLast = index === relevantCrumbs.length - 1;

        // Translate the breadcrumb label if it's a known category
        const lowerLabel = crumb.label.toLowerCase();
        const translationKey = MARKETPLACE_TYPE_TO_KEY[lowerLabel];
        const displayLabel = translationKey ? t(translationKey) : crumb.label;

        // Get the category key for navigation
        const categoryKey = BREADCRUMB_LABEL_TO_CATEGORY[lowerLabel];

        breadcrumbPath.push({
          label: displayLabel,
          // Make it clickable if it has an href and it's not the last item
          onClick:
            crumb.clickable && !isLast && crumb.href
              ? () => {
                  // Convert website href to extension hash format
                  const href = crumb.href;

                  // Try to extract type from URL parameters first (most reliable)
                  if (href.includes('type=')) {
                    const urlParams = new URLSearchParams(href.split('?')[1]);
                    const typeParam = urlParams.get('type');
                    if (typeParam) {
                      updateHash(`#discover/${typeParam}`);
                    }
                  }
                  // Otherwise check specific paths
                  else if (href.includes('/collections')) {
                    updateHash('#discover/collections');
                  } else if (href.includes('/collection/')) {
                    const collectionId = href.split('/collection/')[1]?.split('?')[0];
                    if (collectionId) {
                      updateHash(`#discover/collection/${collectionId}`);
                    }
                  } else if (categoryKey) {
                    // If we recognized the category from the label, navigate to it
                    updateHash(`#discover/${categoryKey}`);
                  } else if (href === '/marketplace' || href === '/marketplace/') {
                    updateHash('#discover/all');
                  }
                  // If it's a specific item, we'd need more context to determine the category
                  // In that case, using history.back() might be more reliable
                  else {
                    const stepsBack = relevantCrumbs.length - index - 1;
                    for (let i = 0; i < stepsBack; i++) {
                      window.history.back();
                    }
                  }
                }
              : null,
        });
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
        <img src={mueAboutIcon} alt="Mue" className="topBarLogo" draggable={false} />
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
                  {!isLast && (
                    <MdChevronRight className="breadcrumb-separator" aria-hidden="true" />
                  )}
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
            const badgeValue =
              tab === TAB_TYPES.LIBRARY && installedCount > 0 ? installedCount : undefined;

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
