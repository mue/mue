import { readConfig, writeConfig } from './configUtils';

export function migrateQuicklinksData() {
  try {
    const version = localStorage.getItem('quicklinks_version');

    if (!version || version === '1.0') {
      const oldData = JSON.parse(localStorage.getItem('quicklinks') || '[]');
      const newData = oldData.map((item, index) => ({
        ...item,
        iconType: item.icon ? 'custom_url' : 'auto',
        iconData: null,
        iconFallbacks: [],
        groupId: null,
        order: index,
        bookmarkId: null,
        bookmarkSource: null,
        lastSynced: null,
        syncEnabled: true,
        customColor: null,
        hideLabel: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        accessCount: 0,
        lastAccessed: null,
      }));

      localStorage.setItem('quicklinks', JSON.stringify(newData));
      localStorage.setItem('quicklinks_groups', JSON.stringify([]));

      const config = readConfig();
      writeConfig(config);

      localStorage.setItem('quicklinks_version', '2.0');

      return true;
    }

    return false;
  } catch (e) {
    console.error('Quicklinks migration failed:', e);
    return false;
  }
}
