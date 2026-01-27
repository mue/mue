import { MdMenu } from 'react-icons/md';
import { Tooltip } from 'components/Elements';
import { useT } from 'contexts/TranslationContext';

function SidebarToggle({ isCollapsed, onToggle }) {
  const t = useT();

  return (
    <Tooltip
      title={isCollapsed ? t('modals.main.sidebar.expand') : t('modals.main.sidebar.collapse')}
      placement="right"
    >
      <button
        className="sidebarToggleButton"
        onClick={onToggle}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!isCollapsed}
      >
        <MdMenu />
      </button>
    </Tooltip>
  );
}

export default SidebarToggle;
