import { TAB_TYPES } from '../constants/tabConfig';

// Tab-specific configurations with exact divider positions
const TAB_CONFIGS = {
  [TAB_TYPES.SETTINGS]: {
    itemCount: 16, // Excluding experimental
    dividerPositions: [10, 12], // After Weather, Language
    textWidths: [80, 100, 70, 90, 85, 75, 80, 95, 90, 75, 85, 90, 85, 80, 70, 95], // Fixed widths in pixels
    showSearch: true, // Settings has search bar
  },
  [TAB_TYPES.DISCOVER]: {
    itemCount: 5,
    dividerPositions: [0], // After "All"
    textWidths: [60, 95, 95, 110, 90], // Fixed widths
    showSearch: false, // Discover doesn't have search
  },
  [TAB_TYPES.LIBRARY]: {
    itemCount: 0, // Library doesn't show sidebar
    dividerPositions: [],
    textWidths: [],
    showSearch: false,
  },
};

const SidebarSkeleton = ({ currentTab = TAB_TYPES.SETTINGS }) => {
  const config = TAB_CONFIGS[currentTab] || TAB_CONFIGS[TAB_TYPES.SETTINGS];

  // Library tab doesn't show sidebar
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
