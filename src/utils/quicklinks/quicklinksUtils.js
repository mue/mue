export const readQuicklinks = () => {
  try {
    const raw = localStorage.getItem('quicklinks');
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Failed to parse quicklinks from localStorage. Resetting to []', e);
    return [];
  }
};

export const writeQuicklinks = (data) => {
  try {
    if (!Array.isArray(data)) {
      throw new Error('Quicklinks data must be an array');
    }
    localStorage.setItem('quicklinks', JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to write quicklinks:', e);
    return false;
  }
};
