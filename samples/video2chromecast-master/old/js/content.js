function injectScript(script) {
  var apiScript = document.createElement("script");
  apiScript.src = script;
  (document.head || document.documentElement).appendChild(apiScript);
}

function injectJs(js) {
  var apiScript = document.createElement("script");
  apiScript.appendChild(document.createTextNode(js));
  (document.head || document.documentElement).appendChild(apiScript);
}

injectScript("chrome-extension://" + chrome.runtime.id + "/js/ext/cast_sender.js");
injectScript("chrome-extension://" + chrome.runtime.id + "/js/chromecast.js");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.id) {
    case "video":
      var video = request.video;
      console.log('play', video);
      var contentType = video.type; // video.type.indexOf('flv') >= 0 ? undefined : video.type;
      // TODO
      injectJs("chromecast.init();setTimeout(function(){chromecast.play('" + video.url + "','" + contentType + "');},2000);");
      sendResponse();
      break;
    default:
      sendResponse();
  }
});