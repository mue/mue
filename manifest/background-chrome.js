/* eslint-disable no-undef */
chrome.runtime.setUninstallURL('https://muetab.com/uninstall');

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('index.html'),
    });
  }
});
