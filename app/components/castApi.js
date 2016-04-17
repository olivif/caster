app.service('castApi', ['$rootScope', function ($rootScope) {

    //messages
    this.CASTAPI_CONNECTION_SUCCESS = "ChromeCast API is available.";
    this.CASTAPI_CONNECTION_ERROR = "ChromeCast API is not available. Make sure you are using Chrome.";

    var CAST_API_INITIALIZATION_DELAY = 1000;

    var APP_ID = "7475FD27";

    // State
    var session = null;

    // Initializes the chromecast api and connects using the appId
    this.initializeApi = function (onSuccess, onError) {

        if (!chrome.cast || !chrome.cast.isAvailable) {
            console.log("No ChromeCast yet, scheduling initialize.");
            setTimeout(initializeCastApi, CAST_API_INITIALIZATION_DELAY);
        }

        function initializeCastApi() {

            var applicationIDs = [APP_ID];

            var autoJoinPolicyArray = [
                chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
                chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED,
                chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
            ];

            // request session
            var sessionRequest = new chrome.cast.SessionRequest(applicationIDs[0]);
            var apiConfig = new chrome.cast.ApiConfig(
                sessionRequest,
                sessionListener,
                receiverListener,
                autoJoinPolicyArray[1]);

            console.log("Initializing ..")
            chrome.cast.initialize(apiConfig, onSuccess, onError);
        }

        function sessionListener(e) {
            console.log("Received sesssion with id " + e.sessionId);
            session = e;
        }

        function receiverListener(e) {
            if (e === 'available') {
                console.log('Receiver available');
            }
            else {
                console.log('No receivers available');
            }
        }
    };

    this.loadMedia = function (mediaUrl) {

        launchApp(loadMediaObject);
        
        function loadMediaObject() {
            // Prepare mediaInfo object
            var mediaInfo = new chrome.cast.media.MediaInfo(mediaUrl);
            mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
            mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
            mediaInfo.contentType = 'video/mp4';
            mediaInfo.metadata.title = "Placeholder title";
            mediaInfo.metadata.images = [];

            // Load 
            var request = new chrome.cast.media.LoadRequest(mediaInfo);
            request.autoplay = true;
            request.currentTime = 0;

            session.loadMedia(request, onSuccess, onError);
        }

        function onSuccess(e) {
            console.log("Media request succeeded");
        }

        function onError(e) {
            console.log("Media request failed");
        }

        function launchApp(onAppLaunched) {
            console.log("Launching app");
            chrome.cast.requestSession(onSuccess, onError);

            function onSuccess(e) {
                console.log("Received sesssion with id " + e.sessionId);
                session = e;
                onAppLaunched();
            }

            function onError(e) {
                console.log("No session");
            }
        }
    };

}]);