import { useT } from 'contexts/TranslationContext';
import { useState, useEffect } from 'react';
import { MdClose, MdChevronRight, MdArrowBack, MdArrowForward } from 'react-icons/md';
import { Tooltip, Button } from 'components/Elements';
import { NAVBAR_BUTTONS, TAB_TYPES } from '../constants/tabConfig';
import { updateHash } from 'utils/deepLinking';
import mueAboutIcon from 'assets/icons/mue_about.png';

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

    window.addEventListener('storage', updateCount);

    window.addEventListener('installedAddonsChanged', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('installedAddonsChanged', updateCount);
    };
  }, []);

  const currentTabButton = NAVBAR_BUTTONS.find(({ tab }) => tab === currentTab);
  const currentTabLabel = currentTabButton ? t(currentTabButton.messageKey) : '';

  const getSubSectionLabel = (subSection, sectionName) => {
    if (!subSection || !sectionName) {
      return subSection;
    }

    const translationKey = `modals.main.settings.sections.${sectionName}.${subSection}.title`;
    const translated = t(translationKey);

    if (!translated || translated === translationKey) {
      return subSection.charAt(0).toUpperCase() + subSection.slice(1);
    }

    return translated;
  };

  const breadcrumbPath = [];

  if (currentTabLabel) {
    breadcrumbPath.push({
      label: currentTabLabel,
      onClick:
        (iframeBreadcrumbs && iframeBreadcrumbs.length > 0) || productView
          ? () => {
              updateHash('#discover/all');
            }
          : null,
    });

    if (iframeBreadcrumbs && iframeBreadcrumbs.length > 0) {
      const relevantCrumbs = iframeBreadcrumbs.slice(1);

      relevantCrumbs.forEach((crumb, index) => {
        const isLast = index === relevantCrumbs.length - 1;

        const lowerLabel = crumb.label.toLowerCase();
        const translationKey = MARKETPLACE_TYPE_TO_KEY[lowerLabel];
        const displayLabel = translationKey ? t(translationKey) : crumb.label;

        const categoryKey = BREADCRUMB_LABEL_TO_CATEGORY[lowerLabel];

        breadcrumbPath.push({
          label: displayLabel,
          onClick:
            crumb.clickable && !isLast && crumb.href
              ? () => {
                  const href = crumb.href;

                  if (href.includes('type=')) {
                    const urlParams = new URLSearchParams(href.split('?')[1]);
                    const typeParam = urlParams.get('type');
                    if (typeParam) {
                      updateHash(`#discover/${typeParam}`);
                    }
                  }
                  else if (href.includes('/collections')) {
                    updateHash('#discover/collections');
                  } else if (href.includes('/collection/')) {
                    const collectionId = href.split('/collection/')[1]?.split('?')[0];
                    if (collectionId) {
                      updateHash(`#discover/collection/${collectionId}`);
                    }
                  } else if (categoryKey) {
                    updateHash(`#discover/${categoryKey}`);
                  } else if (href === '/marketplace' || href === '/marketplace/') {
                    updateHash('#discover/all');
                  }
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
      if (productView.isCollection) {
        breadcrumbPath.push({
          label: productView.collectionTitle || productView.name,
          onClick: null,
        });
      } else {
        if (productView.fromCollection && productView.collectionTitle) {
          breadcrumbPath.push({
            label: productView.collectionTitle,
            onClick: productView.onBack || null,
          });
        } else {
          const categoryKey = MARKETPLACE_TYPE_TO_KEY[productView.type];
          if (categoryKey) {
            breadcrumbPath.push({
              label: t(categoryKey),
              onClick: productView.onBack || null,
            });
          }
        }
        breadcrumbPath.push({
          label: productView.name,
          onClick: null,
        });
      }
    } else if (currentSection) {
      breadcrumbPath.push({
        label: currentSection,
        onClick: currentSubSection ? () => onSubSectionChange(null) : null,
      });

      if (currentSubSection) {
        breadcrumbPath.push({
          label: getSubSectionLabel(currentSubSection, currentSectionName),
          onClick: null,
        });
      }
    }
  }

  return (
    <div className="modalTopBar">
      <div className="topBarLeft">
        <div className="navigationButtons">
          <Tooltip title={t('common.navigation.back')} key="backTooltip">
            <button
              className="navButton"
              onClick={onBack}
              disabled={!canGoBack}
              aria-label={t('common.navigation.navigate_back')}
            >
              <MdArrowBack />
            </button>
          </Tooltip>
          <Tooltip title={t('common.navigation.forward')} key="forwardTooltip">
            <button
              className="navButton"
              onClick={onForward}
              disabled={!canGoForward}
              aria-label={t('common.navigation.navigate_forward')}
            >
              <MdArrowForward />
            </button>
          </Tooltip>
        </div>
        <img src={mueAboutIcon} alt="Mue" className="topBarLogo" draggable={false} />
        {breadcrumbPath.length > 0 && (
          <nav className="breadcrumbs" aria-label={t('common.navigation.breadcrumb_navigation')}>
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
                      aria-label={t('common.navigation.navigate_to', { item: item.label })}
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
