angular.module('myApp.castApi', ['ngRoute'])

    .service('castApi', function() {

        var CAST_API_INITIALIZATION_DELAY = 1000;

        var APP_ID = "7475FD27";

        // Initializes the chromecast api and connects using the appId
        this.initializeApi = function() {

            /**
     * Cast initialization timer delay
     **/
            var CAST_API_INITIALIZATION_DELAY = 1000;

            var APP_ID = "7475FD27";

            /**
             * Call initialization
             */
            if (!chrome.cast || !chrome.cast.isAvailable) {
                setTimeout(initializeCastApi, CAST_API_INITIALIZATION_DELAY);
            }

            /**
             * initialization
             */
            function initializeCastApi() {

                var applicationIDs = [APP_ID];

                var autoJoinPolicyArray = [
                    chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
                    chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED,
                    chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
                ];

                // request session
                var sessionRequest = new chrome.cast.SessionRequest(applicationIDs[0]);
                console.log("sessionRequest null = " + sessionRequest === null);
                var apiConfig = new chrome.cast.ApiConfig(
                    sessionRequest,
                    sessionListener,
                    receiverListener,
                    autoJoinPolicyArray[1]);

                chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
            }
            
            function onInitError(e) {
                console.log("on init error ");
                console.log(e);
            }
            
            function onInitSuccess() {
                console.log("on init success ");
            }
            
            function sessionListener() {
                
            }
            
            function receiverListener() {
                
            }
        };
    });