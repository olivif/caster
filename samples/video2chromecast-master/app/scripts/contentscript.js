'use strict';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.id) {
    case 'video':
      var video = request.video;
      console.log('play', video);
      //var contentType = video.type; // video.type.indexOf('flv') >= 0 ? undefined : video.type;
      // TODO
      // injectJs("chromecast.init();setTimeout(function(){chromecast.play('" + video.url + "','" + contentType + "');},2000);");
      sendResponse();
      break;
    case 'highlight':
      console.log('highlight', request.video);
      sendResponse();
      break;
    case 'unhighlight':
      console.log('unhighlight', request.video);
      sendResponse();
      break;
    default:
      sendResponse();
  }
});