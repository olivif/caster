'use strict';

var videos = {};

chrome.runtime.onInstalled.addListener(function(details) {
  console.log('previousVersion', details.previousVersion);
});

// clear tabs on request
chrome.tabs.onUpdated.addListener(function(tabId, changeinfo) {
  if (changeinfo.status === 'loading') {
    console.log('clear videos', changeinfo);
    videos[tabId] = [];
    chrome.pageAction.hide(tabId);
  }
});

// on some data received
chrome.webRequest.onHeadersReceived.addListener(function(details) {

  var headers = {};
  details.responseHeaders.forEach(function(d) {
    headers[d.name] = d.value;
  });

  var contentType = headers['Content-Type'];
  if (contentType && contentType.indexOf('video') > -1) {
    chrome.tabs.getSelected(null, function(tab) {
      var length = headers['Content-Length'];
      var video = {
        url: details.url,
        type: contentType,
        size: length,
        date: new Date()
      };
      if (!videos[tab.id]) {
        videos[tab.id] = [];
      }
      videos[tab.id].push(video);
      chrome.pageAction.show(tab.id);
    });
  }

}, {
  urls: ['<all_urls>'],
  types: ['object', 'other']
}, ['responseHeaders']);