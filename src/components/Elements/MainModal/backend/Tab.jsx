import variables from 'config/variables';
import { memo, useState, useEffect } from 'react';
import { getIconComponent, DIVIDER_LABELS, MUE_TITLE_LABELS } from '../constants/tabConfig';

function Tab({ label, currentTab, onClick, navbarTab }) {
  const [isExperimental, setIsExperimental] = useState(true);

  useEffect(() => {
    setIsExperimental(localStorage.getItem('experimental') !== 'false');
  }, []);

  // Get the icon component for this label
  const IconComponent = getIconComponent(label, variables);

  // Determine if this label should have a divider after it
  const hasDivider = DIVIDER_LABELS.some((key) => variables.getMessage(key) === label);

  // Determine if this label should have "Mue" title before it
  const hasMueTitle = MUE_TITLE_LABELS.some((key) => variables.getMessage(key) === label);

  // Build className
  const baseClass = navbarTab ? 'navbar-item' : 'tab-list-item';
  const activeClass = navbarTab ? 'navbar-item-active' : 'tab-list-active';
  const className = `${baseClass}${currentTab === label ? ` ${activeClass}` : ''}`;

  // Hide experimental tab if experimental mode is disabled
  const isExperimentalTab =
    label === variables.getMessage('modals.main.settings.sections.experimental.title');
  if (isExperimentalTab && !isExperimental) {
    return <hr />;
  }

  return (
    <>
      {hasMueTitle && <span className="mainTitle">Mue</span>}
      <button className={className} onClick={() => onClick(label)}>
        {IconComponent && <IconComponent />} <span>{label}</span>
      </button>
      {hasDivider && <hr />}
    </>
  );
}

export default memo(Tab);
