var tab2videos = {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url) {
    if (!tab2videos[tabId]) {
      tab2videos[tabId] = [];
    };
  }
});

chrome.webRequest.onHeadersReceived.addListener(function(details) {
  if (!details) return;

  var headers = parseHeaders(details.responseHeaders);

  var contentType = headers["Content-Type"];
  if (contentType && contentType.indexOf("video") == 0) {
    chrome.tabs.getSelected(null, function(tab) {
      var length = headers["Content-Length"];
      if (length && length > 1024 * 100) {
        var video = {
          "url": details["url"],
          "type": contentType,
          "size": length,
          "date": new Date()
        };
        var videos = tab2videos[tab.id] || [];
        tab2videos[tab.id] = videos;
        var exists = videos.filter(function(v) {
          return v.url === video.url;
        }).length > 0;
        if (!exists) {
          tab2videos[tab.id].push(video);
          chrome.pageAction.show(tab.id);
        }
      }
    });
  }

}, {
  urls: ["<all_urls>"],
  types: ["object", "other"]
}, ["responseHeaders"]);

function parseHeaders(headers) {
  var ret = {};
  headers.forEach(function(h) {
    ret[h.name] = h.value;
  });
  return ret;
}

function notify(str) {
  chrome.notifications.create("", {
    iconUrl: "../icons/icon.png",
    type: 'basic',
    title: 'Video 2 TV',
    message: str
  }, function() {
    console.log('done');
  });
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  switch (request.id) {
    case "url":
      var url = request.url;
      console.log('got url', url);
      chromecast.play(url);
      sendResponse();
      break;
    default:
      notify("Unmatched request of '" + request + "' from script to background.js from " + sender);
      sendResponse();
  }
});