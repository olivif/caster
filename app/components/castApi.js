app.service('castApi', ['$rootScope', function ($rootScope) {

    //messages
    this.CASTAPI_CONNECTION_SUCCESS = "ChromeCast API is available.";
    this.CASTAPI_CONNECTION_ERROR = "ChromeCast API is not available. Make sure you are using Chrome.";

    var CAST_API_INITIALIZATION_DELAY = 1000;

    var APP_ID = "7475FD27";

    // State
    var session = null;
    var currentMediaSession = null;
    var progress = null;

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

            session.loadMedia(request, mediaListener, onError);
        }

        function mediaListener(mediaSession) {
            currentMediaSession = mediaSession;
            currentMediaSession.addUpdateListener(mediaUpdate);
        }

        function updateProgress() {

            if (currentMediaSession === null) {
                console.log("No media session yet ...");
                return;
            }

            if (currentMediaSession.playerState == 'PLAYING') {
                progress = currentMediaSession.currentTime / currentMediaSession.media.duration * 100;
                console.log("Progress = " + progress);
            }
        }

        function mediaUpdate(isAlive) {
            if (!isAlive) {
                console.log("Media session is not alive.");
                return;
            }

            updateProgress();
        }

        function onError(e) {
            console.log("Media request failed");
        }

        function launchApp(onAppLaunched) {
            console.log("Launching app");
            console.log(session);

            if (session != null && session.sessionId != null) {
                // Join by session id
                console.log("Joining by session with id " + session.sessionId);
                chrome.cast.requestSessionById(session.sessionId);
                session.addUpdateListener(sessionUpdate);
                onAppLaunched();
            } else {
                // Request a new session
                chrome.cast.requestSession(onSuccess, onError);
                console.log("Joining by requesting new session");
            }

            function onSuccess(e) {
                console.log("Received sesssion with id " + e.sessionId);
                session = e;
                session.addUpdateListener(sessionUpdate);
                onAppLaunched();
            }

            function onError(e) {
                console.log("No session");
                console.log(e);
            }
        }

        function sessionUpdate(isAlive) {
            if (!isAlive) {
                console.log("Media session is not alive.");
                return;
            }

            timer = setInterval(updateProgress, 2000);
        }
    };

    this.pauseMedia = function () {
        performMediaSessionOperation("pause");
    }

    this.playMedia = function () {
        performMediaSessionOperation("play");
    }

    this.stopMedia = function () {
        performMediaSessionOperation("stop");
    }

    function performMediaSessionOperation(operationName) {

        if (currentMediaSession == null) {
            console.log("No media session, cannot perform operation.");
            return;
        }

        currentMediaSession[operationName](null, onSuccess, onError);

        function onSuccess() {
            console.log(operationName + " succeded")
        }

        function onError() {
            console.log(operationName + " failed")
        }
    }

    this.getProgress = function () {
        return progress;
    }

    this.hasMediaSession = function () {
        return currentMediaSession != null;
    }

}]);