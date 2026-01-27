import { memo, useState, useEffect } from 'react';
import { useT } from 'contexts/TranslationContext';
import { Tooltip } from 'components/Elements';
import { getIconComponent, DIVIDER_LABELS } from '../constants/tabConfig';

function Tab({ label, currentTab, onClick, navbarTab, isCollapsed }) {
  const t = useT();
  const [isExperimental, setIsExperimental] = useState(true);

  useEffect(() => {
    setIsExperimental(localStorage.getItem('experimental') !== 'false');
  }, []);

  // Get the icon component for this label (label is already translated)
  const IconComponent = getIconComponent(label, { getMessage: t });

  // Determine if this label should have a divider after it
  const hasDivider = DIVIDER_LABELS.some((key) => t(key) === label);

  // Build className
  const baseClass = navbarTab ? 'navbar-item' : 'tab-list-item';
  const activeClass = navbarTab ? 'navbar-item-active' : 'tab-list-active';
  const className = `${baseClass}${currentTab === label ? ` ${activeClass}` : ''}`;

  // Hide experimental tab if experimental mode is disabled
  const isExperimentalTab = label === t('modals.main.settings.sections.experimental.title');
  if (isExperimentalTab && !isExperimental) {
    return <hr />;
  }

  return (
    <>
      {isCollapsed ? (
        <Tooltip title={label} placement="right">
          <button className={className} onClick={() => onClick(label)}>
            {IconComponent && <IconComponent />}
          </button>
        </Tooltip>
      ) : (
        <button className={className} onClick={() => onClick(label)}>
          {IconComponent && <IconComponent />} <span>{label}</span>
        </button>
      )}
      {!isCollapsed && hasDivider && <hr />}
    </>
  );
}

export default memo(Tab);
