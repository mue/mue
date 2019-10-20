// Original code sourced from https://forums.opera.com/topic/25046/how-to-disable-completely-the-speed-dial/14

chrome.tabs.onCreated.addListener((tab) => {
    if (tab.status === 'complete' && tab.url === 'chrome://startpage/') chrome.tabs.update(tab.id, { url: chrome.extension.getURL('index.html') });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { 
    if (changeInfo.status === 'complete' && tab.url === 'chrome://startpage/') chrome.tabs.update(tabId, { url: chrome.extension.getURL('index.html') });
});