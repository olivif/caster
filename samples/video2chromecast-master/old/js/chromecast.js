var chromecast = (function() {

  /**
   * Session idle time out in miliseconds
   **/
  var SESSION_IDLE_TIMEOUT = 300000;

  var storedSession;

  //initializeCastApi();

  function initializeCastApi() {
    if (!chrome.cast || !chrome.cast.isAvailable) {
      setTimeout(initializeCastApi, 1000);
      if (!chrome.cast || !chrome.cast.media) {
        return;
      }
    }

    // default app ID to the default media receiver app
    // optional: you may change it to your own app ID/receiver
    var applicationIDs = [
      chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    ];


    // auto join policy can be one of the following three
    // 1) no auto join
    // 2) same appID, same URL, same tab
    // 3) same appID and same origin URL
    var autoJoinPolicyArray = [
      chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
      chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED,
      chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    ];

    // request session
    var sessionRequest = new chrome.cast.SessionRequest(applicationIDs[0]);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
      function() {
        console.log('aaa', arguments);
      },
      function() {
        console.log('bbb', arguments); // check available or unavailable
      },
      autoJoinPolicyArray[1]);

    chrome.cast.initialize(apiConfig, onInitSuccess, onError);
  }

  /**
   * initialization success callback
   */
  function onInitSuccess() {
    console.log('init success');
    // check if a session ID is saved into localStorage
    storedSession = JSON.parse(localStorage.getItem('storedSession'));
  }


  /**
   * launch app and request session
   */
  function launchApp(callback) {
    console.log('launching app...');
    chrome.cast.requestSession(function(session) {
      callback(session);
    }, onError);
  }

  /**
   * generic error callback
   * @param {Object} e A chrome.cast.Error object.
   */
  function onError(e) {
    console.log('Error', e);
  }

  /**
   * load media
   * @param {string} mediaURL media URL string
   * @this loadMedia
   */
  function loadMedia(session, mediaURL, contentType) {
    var mediaInfo = new chrome.cast.media.MediaInfo(mediaURL);
    currentMediaTitle = '[Video from Video2Chromecast extension]';
    currentMediaThumb = 'icons/icon.png';
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
    mediaInfo.contentType = contentType || 'video/mp4';

    mediaInfo.metadata.title = currentMediaTitle;
    mediaInfo.metadata.images = [{
      'url': currentMediaThumb
    }];

    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;
    request.currentTime = 0;

    console.log('loadMedia', request);
    session.loadMedia(request,
      function() {
        console.log(arguments);
      },
      function() {
        session.stop();
        onError(arguments);
      });
  }

  return {
    init: function() {
      initializeCastApi();
    },
    play: function(url, contentType) {
      console.log('chromecast got url', url);
      launchApp(function(session) {
        loadMedia(session, url, contentType);
      });
    }
  };
})();