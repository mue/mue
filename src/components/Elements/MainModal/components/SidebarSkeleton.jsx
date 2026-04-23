import { TAB_TYPES } from '../constants/tabConfig';

const TAB_CONFIGS = {
  [TAB_TYPES.SETTINGS]: {
    itemCount: 16,
    dividerPositions: [10, 12],
    textWidths: [80, 100, 70, 90, 85, 75, 80, 95, 90, 75, 85, 90, 85, 80, 70, 95],
    showSearch: true,
  },
  [TAB_TYPES.DISCOVER]: {
    itemCount: 5,
    dividerPositions: [0],
    textWidths: [60, 95, 95, 110, 90],
    showSearch: false,
  },
  [TAB_TYPES.LIBRARY]: {
    itemCount: 0,
    dividerPositions: [],
    textWidths: [],
    showSearch: false,
  },
};

const SidebarSkeleton = ({ currentTab = TAB_TYPES.SETTINGS }) => {
  const config = TAB_CONFIGS[currentTab] || TAB_CONFIGS[TAB_TYPES.SETTINGS];

  if (config.itemCount === 0) {
    return null;
  }

  return (
    <div className="sidebarSkeleton">
      {/* Header with toggle button and optional search */}
      <div className="skeletonHeader">
        <div className="skeletonToggle pulse" />
        {config.showSearch && <div className="skeletonSearch pulse" />}
      </div>

      {Array.from({ length: config.itemCount }).map((_, index) => {
        const hasDivider = config.dividerPositions.includes(index);
        const textWidth = config.textWidths[index] || 80;

        return (
          <div key={index}>
            <div className="skeletonItem">
              <div className="iconPlaceholder pulse" />
              <div className="textPlaceholder pulse" style={{ width: `${textWidth}px` }} />
            </div>
            {hasDivider && <hr className="skeletonDivider" />}
          </div>
        );
      })}
    </div>
  );
};

export default SidebarSkeleton;
