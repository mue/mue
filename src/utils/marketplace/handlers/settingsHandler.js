function showReminder() {
  document.querySelector('.reminder-info').style.display = 'flex';
  localStorage.setItem('showReminder', true);
}

export const settingsHandler = {
  install: (packData, context) => {
    localStorage.removeItem('backup_settings');

    const oldSettings = [];
    Object.keys(localStorage).forEach((key) => {
      oldSettings.push({ name: key, value: localStorage.getItem(key) });
    });

    localStorage.setItem('backup_settings', JSON.stringify(oldSettings));
    Object.keys(packData.settings).forEach((key) => {
      localStorage.setItem(key, packData.settings[key]);
    });
    showReminder();

    return { refreshEvent: null };
  },

  uninstall: (packData, context) => {
    const oldSettings = JSON.parse(localStorage.getItem('backup_settings'));
    localStorage.clear();
    oldSettings.forEach((item) => {
      localStorage.setItem(item.name, item.value);
    });
    showReminder();

    return { refreshEvent: null };
  },
};
