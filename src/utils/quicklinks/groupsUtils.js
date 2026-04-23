export const readGroups = () => {
  try {
    const raw = localStorage.getItem('quicklinks_groups');
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Failed to parse quicklinks groups. Resetting to []', e);
    return [];
  }
};

export const writeGroups = (data) => {
  try {
    if (!Array.isArray(data)) {
      throw new Error('Groups data must be an array');
    }
    localStorage.setItem('quicklinks_groups', JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to write quicklinks groups:', e);
    return false;
  }
};
