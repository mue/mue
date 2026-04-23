export const getDefaultConfig = () => ({
  layoutMode: 'flex',
  gridColumns: 'auto',
  gridRows: 'auto',
  itemsPerPage: null,
  displayStyle: localStorage.getItem('quickLinksStyle') || 'icon',
  showTooltips: localStorage.getItem('quicklinkstooltip') !== 'false',
  openInNewTab: localStorage.getItem('quicklinksnewtab') === 'true',
  zoom: Number(localStorage.getItem('zoomQuicklinks') || 100),
  groupingEnabled: false,
  showGroupHeaders: true,
  collapsibleGroups: true,
  bookmarkSyncEnabled: false,
  bookmarkFolderId: null,
  syncDirection: 'import_only',
  autoSyncInterval: 0,
  lastSyncTimestamp: null,
  iconFallbackChain: ['icon.horse', 'google', 'duckduckgo', 'placeholder'],
  customIconsEnabled: true,
  responsiveBreakpoints: { mobile: 768, tablet: 1024 },
});

export const readConfig = () => {
  try {
    const raw = localStorage.getItem('quicklinks_config');
    if (!raw) return getDefaultConfig();
    return { ...getDefaultConfig(), ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to parse quicklinks config, using defaults', e);
    return getDefaultConfig();
  }
};

export const writeConfig = (config) => {
  try {
    localStorage.setItem('quicklinks_config', JSON.stringify(config));
    return true;
  } catch (e) {
    console.error('Failed to write quicklinks config:', e);
    return false;
  }
};
